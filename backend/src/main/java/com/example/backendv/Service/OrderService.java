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


    public ResponseEntity<String> CreateNewOrder( Order order){
        try{
            if( order.getQuantity() > order.getEvent().getAvailable_tickets() ){
                return ResponseEntity.badRequest().body("This quantity not available");
            }
            Event event = eventRepository.findEventById(order.getEvent().getId());

            order.setTotalPrice(order.getQuantity()*order.getEvent().getPrice());
            order.setStatus("PENDING");



            orderRepository.save(order);


            return ResponseEntity.ok("Order Pending added with success");

        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }

}
