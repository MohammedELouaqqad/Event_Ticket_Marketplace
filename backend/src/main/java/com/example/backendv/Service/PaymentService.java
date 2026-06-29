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


@Service
public class PaymentService{

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
        try{
            event = Webhook.constructEvent(
                    payload, header, webhookSecret
            );
        }catch(SignatureVerificationException e){
            return ResponseEntity.internalServerError().body("Signature verification failed");
        }
        switch (event.getType()){
            case "checkout.session.completed":
                var session = (com.stripe.model.checkout.Session) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                if(session != null){
                    Order order = orderRepository.findOrderById( Long.parseLong(session.getMetadata().get("orderId")) );
                    order.setStatus("CONFIRMED");

                    com.example.backendv.Entity.Event eventOrder = eventRepository.findEventById(order.getEvent().getId());
                    eventOrder.setAvailable_tickets(Math.toIntExact(eventOrder.getAvailable_tickets() - order.getQuantity()));

                    User user=userRepository.findUserById(order.getUser().getId());

                    eventRepository.save(eventOrder);
                    orderRepository.save(order);
                    emailSenderService.sendEmailWithAttachment(user.getEmail(),
                            "Ticket of "+order.getEvent().getName()+" Event",
                            "Hello "+user.getName()+"\nYour order has been successfully confirmed.\nEvent: "+order.getEvent().getName()+" "+order.getEvent().getLocation()+".\nOrder ID: "+order.getId()+".\nYour ticket is attached to this email as a QR code. Please present it at the entrance for scanning.\nThank you,\nThe Events Team",
                            qrCodeGeneratorService.generateByteQRCode("This the identifier of this order "+order.getId(),400,400));

                }
                break;
            case "checkout.session.async_payment_failed":
                var failedSession = (com.stripe.model.checkout.Session) event.getDataObjectDeserializer()
                        .getObject().orElse(null);
                if(failedSession != null){
                    Order order = orderRepository.findOrderById( Long.parseLong(failedSession.getMetadata().get("orderId")) );
                    order.setStatus("FAILED");
                    orderRepository.save(order);
                    System.out.println("Payment failed: "+failedSession.getId());
                }
                break;
            default:
                System.out.println("Unhandled event type: "+event.getType());

        }
        return ResponseEntity.ok("ok");
    }
}
