package com.example.backendv.Service;


import com.example.backendv.Entity.Order;
import com.example.backendv.Entity.User;
import com.example.backendv.Repository.EventRepository;
import com.example.backendv.Repository.OrderRepository;
import com.example.backendv.Repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class PaymentService{

    private static final Pattern SESSION_ID_PATTERN =
            Pattern.compile("\"id\"\\s*:\\s*\"(cs_[^\"]+)\"");

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final QrCodeGeneratorService qrCodeGeneratorService;
    private final EmailSenderService emailSenderService;
    private final EventRepository eventRepository;
    @Value("${stripe.secretKey}")
    private String secretKey;

    @Value("${WEBHOOK_SECRET_KEY}")
    private String webhookSecret;

    public PaymentService(OrderRepository orderRepository, EmailSenderService emailSenderService,
                          UserRepository userRepository, QrCodeGeneratorService qrCodeGeneratorService, EventRepository eventRepository) {
        this.orderRepository = orderRepository;
        this.emailSenderService=emailSenderService;
        this.userRepository=userRepository;
        this.qrCodeGeneratorService=qrCodeGeneratorService;
        this.eventRepository = eventRepository;
    }

    public ResponseEntity<String> checkoutOrders(Order order) throws StripeException {
        if (order.getId() == null) {
            return ResponseEntity.badRequest().body("Order id is required before payment");
        }

        Order dbOrder = orderRepository.findOrderById(order.getId());
        if (dbOrder == null) {
            return ResponseEntity.badRequest().body("Order not found");
        }

        com.example.backendv.Entity.Event event = dbOrder.getEvent();
        if (event == null || event.getName() == null || event.getPrice() == null) {
            return ResponseEntity.badRequest().body("Invalid event data for payment");
        }

        if (dbOrder.getQuantity() == null || dbOrder.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Invalid quantity");
        }

        long unitAmount = Math.round(event.getPrice() * 100);
        if (unitAmount < 50) {
            return ResponseEntity.badRequest().body("Price must be at least $0.50");
        }

        Stripe.apiKey = secretKey;

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(event.getName())
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("usd")
                        .setProductData(productData)
                        .setUnitAmount(unitAmount)
                        .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setQuantity(dbOrder.getQuantity())
                        .setPriceData(priceData)
                        .build();

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .putMetadata("orderId", dbOrder.getId().toString())
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:5173/events")
                        .setCancelUrl("http://localhost:5173/events")
                        .addLineItem(lineItem)
                        .build();

        try {
            Session session = Session.create(params);
            return ResponseEntity.ok(session.getUrl());
        } catch (StripeException e) {
            System.err.println("Stripe error: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Stripe error: " + e.getMessage());
        }
    }

    public ResponseEntity<String> handleWebhookEvent(String payload,
                                                    String header) throws MessagingException {
        Event event;
        try {
            event = Webhook.constructEvent(payload, header, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.internalServerError().body("Signature verification failed");
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutCompleted(event);
                break;
            case "checkout.session.async_payment_failed":
                handleCheckoutFailed(event);
                break;
            default:
                System.out.println("Unhandled event type: " + event.getType());
        }
        return ResponseEntity.ok("ok");
    }

    private void handleCheckoutCompleted(Event stripeEvent) {
        Session session = deserializeSession(stripeEvent);
        if (session == null) {
            System.err.println("Webhook: checkout.session.completed — session is null");
            return;
        }

        String orderIdMeta = session.getMetadata().get("orderId");
        if (orderIdMeta == null) {
            System.err.println("Webhook: orderId missing in session metadata");
            return;
        }

        Order order = orderRepository.findOrderById(Long.parseLong(orderIdMeta));
        if (order == null) {
            System.err.println("Webhook: order not found for id " + orderIdMeta);
            return;
        }

        order.setStatus("CONFIRMED");

        com.example.backendv.Entity.Event eventOrder =
                eventRepository.findEventById(order.getEvent().getId());
        if (eventOrder != null && order.getQuantity() != null) {
            int remaining = eventOrder.getAvailable_tickets() - order.getQuantity().intValue();
            eventOrder.setAvailable_tickets(Math.max(remaining, 0));
            eventRepository.save(eventOrder);
        }

        orderRepository.save(order);
        System.out.println("Webhook: order " + order.getId() + " confirmed");

        User user = userRepository.findUserById(order.getUser().getId());
        if (user == null) {
            System.err.println("Webhook: user not found for order " + order.getId());
            return;
        }

        try {
            emailSenderService.sendEmailWithAttachment(
                    user.getEmail(),
                    "Ticket of " + order.getEvent().getName() + " Event",
                    "Hello " + user.getName()
                            + "\nYour order has been successfully confirmed."
                            + "\nEvent: " + order.getEvent().getName() + " " + order.getEvent().getLocation() + "."
                            + "\nOrder ID: " + order.getId() + "."
                            + "\nYour ticket is attached to this email as a QR code. Please present it at the entrance for scanning."
                            + "\nThank you,\nThe Events Team",
                    qrCodeGeneratorService.generateByteQRCode(
                            "This the identifier of this order " + order.getId(), 400, 400)
            );
        } catch (MessagingException e) {
            System.err.println("Webhook: order confirmed but email failed — " + e.getMessage());
        }
    }

    private void handleCheckoutFailed(Event stripeEvent) {
        Session session = deserializeSession(stripeEvent);
        if (session == null) return;

        String orderIdMeta = session.getMetadata().get("orderId");
        if (orderIdMeta == null) return;

        Order order = orderRepository.findOrderById(Long.parseLong(orderIdMeta));
        if (order == null) return;

        order.setStatus("FAILED");
        orderRepository.save(order);
        System.out.println("Payment failed for order: " + order.getId());
    }

    private Session deserializeSession(Event stripeEvent) {
        var deserializer = stripeEvent.getDataObjectDeserializer();
        if (deserializer.getObject().isPresent()) {
            return (Session) deserializer.getObject().get();
        }

        // Fallback when Stripe API version mismatch prevents direct deserialization
        try {
            Stripe.apiKey = secretKey;
            String rawJson = deserializer.getRawJson();
            if (rawJson != null && !rawJson.isBlank()) {
                Matcher matcher = SESSION_ID_PATTERN.matcher(rawJson);
                if (matcher.find()) {
                    return Session.retrieve(matcher.group(1));
                }
            }
        } catch (Exception e) {
            System.err.println("Webhook: failed to deserialize session — " + e.getMessage());
        }
        return null;
    }
}
