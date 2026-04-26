package com.example.backendv.Service;

import com.example.backendv.Entity.Event;
import com.example.backendv.Entity.Order;
import com.example.backendv.Entity.User;
import com.example.backendv.Repository.EventRepository;
import com.example.backendv.Repository.OrderRepository;

import com.example.backendv.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OrderService {


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailSenderService senderService;

    @Autowired
    private UserRepository userRepository;





    public List<Order> getAllOrders(){
        return  orderRepository.findAll();
    }



    public ResponseEntity<String> CreateNewOrder( Order order){
        try{

            System.out.println(order.getQuantity()>order.getEvent().getAvailable_tickets());

            if( order.getQuantity() > order.getEvent().getAvailable_tickets() ){
                return ResponseEntity.badRequest().body("This quantity not available");
            }
            Event event = eventRepository.findEventById(order.getEvent().getId());

            event.setAvailable_tickets(event.getAvailable_tickets() - order.getQuantity());

            order.setTotalPrice(order.getQuantity()*order.getEvent().getPrice());

            orderRepository.save(order);

            User user=userRepository.findUserById(order.getUser().getId());

            senderService.sendEmail(user.getEmail(),
                    "Ticket of "+order.getEvent().getName()+" Event",
                    "Your Order pass successfully");



            return ResponseEntity.ok("Order added with success");

        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }
}
