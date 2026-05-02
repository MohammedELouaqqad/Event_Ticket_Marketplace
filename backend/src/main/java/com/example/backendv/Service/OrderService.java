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


    @Autowired
    private QrCodeGeneratorService qrCodeGeneratorService;





    public ResponseEntity<List<Order>> getAllOrders(){
        return  ResponseEntity.ok(orderRepository.findAll());
    }


    public ResponseEntity<String> CreateNewOrder( Order order){
        try{
            if( order.getQuantity() > order.getEvent().getAvailable_tickets() ){
                return ResponseEntity.badRequest().body("This quantity not available");
            }
            Event event = eventRepository.findEventById(order.getEvent().getId());
            event.setAvailable_tickets(event.getAvailable_tickets() - order.getQuantity());
            order.setTotalPrice(order.getQuantity()*order.getEvent().getPrice());

            orderRepository.save(order);

            User user=userRepository.findUserById(order.getUser().getId());

            senderService.sendEmailWithAttachment(user.getEmail(),
                    "Ticket of "+order.getEvent().getName()+" Event",
                    "Hello "+user.getName()+"\nYour order has been successfully confirmed.\nEvent: "+order.getEvent().getName()+" "+order.getEvent().getLocation()+".\nOrder ID: "+order.getId()+".\nYour ticket is attached to this email as a QR code. Please present it at the entrance for scanning.\nThank you,\nThe Events Team",
                    qrCodeGeneratorService.generateByteQRCode("This the identifier of this order "+order.getId(),400,400));



            return ResponseEntity.ok("Order added with success");

        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }

}
