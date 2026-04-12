package com.example.backendv.Controller;


import com.example.backendv.Entity.Order;
import com.example.backendv.Entity.OrderItem;
import com.example.backendv.Repository.OrderItemRepository;
import com.example.backendv.Repository.OrderRepository;
import com.example.backendv.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderService orderService;



    @GetMapping("/AllOrders")
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }


    @PostMapping("/AddOrder")
    public ResponseEntity<?> CreateNewOrder(@RequestBody Order order){
        return orderService.CreateNewOrder(order);
    }
}
