package com.example.backendv.Service;

import com.example.backendv.Entity.Order;
import com.example.backendv.Entity.OrderItem;
import com.example.backendv.Repository.OrderItemRepository;
import com.example.backendv.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@Service
public class OrderService {


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;




    public List<Order> getAllOrders(){
        return  orderRepository.findAll();
    }



    public ResponseEntity<?> CreateNewOrder( Order order){
        try{

            Order savedOrder = orderRepository.save(order);

            List<OrderItem> newOrderItem = order.getOrderItems();

            if(newOrderItem != null){
                for(OrderItem orderItem : newOrderItem){
                    Order newOrder = new Order(savedOrder.getId());
                    orderItem.setOrder(newOrder);
                    orderItemRepository.save(orderItem);
                }
            }

            return ResponseEntity.ok(order);

        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }
}
