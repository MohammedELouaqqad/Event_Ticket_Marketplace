package com.example.backendv.Service;

import com.example.backendv.Entity.Order;
import com.example.backendv.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OrderService {


    @Autowired
    private OrderRepository orderRepository;





    public List<Order> getAllOrders(){
        return  orderRepository.findAll();
    }



    public ResponseEntity<?> CreateNewOrder( Order order){
        try{

            orderRepository.save(order);

            return ResponseEntity.ok(order);

        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }
}
