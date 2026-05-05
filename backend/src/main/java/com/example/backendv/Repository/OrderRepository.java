package com.example.backendv.Repository;

import com.example.backendv.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order , Long> {
    Order findOrderById(Long orderId);

}
