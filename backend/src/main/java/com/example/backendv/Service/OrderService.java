package com.example.backendv.Service;

import com.example.backendv.Entity.Event;
import com.example.backendv.Entity.Order;
import com.example.backendv.Entity.User;
import com.example.backendv.Repository.EventRepository;
import com.example.backendv.Repository.OrderRepository;

import com.example.backendv.Repository.UserRepository;
import com.stripe.net.StripeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final EventRepository eventRepository;
    private final EmailSenderService senderService;
    private final UserRepository userRepository;
    private final QrCodeGeneratorService qrCodeGeneratorService;

    public OrderService(OrderRepository orderRepository, EventRepository eventRepository, EmailSenderService senderService, UserRepository userRepository, QrCodeGeneratorService qrCodeGeneratorService) {
        this.orderRepository = orderRepository;
        this.eventRepository = eventRepository;
        this.senderService = senderService;
        this.userRepository = userRepository;
        this.qrCodeGeneratorService = qrCodeGeneratorService;
    }


    public ResponseEntity<List<Order>> getAllOrders(){
        return  ResponseEntity.ok(orderRepository.findAll());
    }


    public ResponseEntity<?> CreateNewOrder(Order order) {
        try {
            if (order.getEvent() == null || order.getEvent().getId() == null) {
                return ResponseEntity.badRequest().body("Event is required");
            }
            if (order.getUser() == null || order.getUser().getId() == null) {
                return ResponseEntity.badRequest().body("User is required");
            }

            Event event = eventRepository.findEventById(order.getEvent().getId());
            User user = userRepository.findUserById(order.getUser().getId());

            if (event == null || user == null) {
                return ResponseEntity.badRequest().body("Invalid event or user");
            }
            if (order.getQuantity() == null || order.getQuantity() < 1) {
                return ResponseEntity.badRequest().body("Invalid quantity");
            }
            if (order.getQuantity() > event.getAvailable_tickets()) {
                return ResponseEntity.badRequest().body("This quantity not available");
            }

            order.setEvent(event);
            order.setUser(user);
            order.setTotalPrice(order.getQuantity() * event.getPrice());
            order.setStatus("PENDING");

            Order saved = orderRepository.save(order);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error in the Server:" + e.getMessage());
        }
    }

}
