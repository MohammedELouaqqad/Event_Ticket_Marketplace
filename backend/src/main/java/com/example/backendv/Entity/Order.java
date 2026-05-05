package com.example.backendv.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Setter
@Getter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalPrice;

    private Long quantity;

    private String status;


    @ToString.Exclude
    @ManyToOne
    private User user;



    @ToString.Exclude
    @ManyToOne
    private Event event;

    public Order(Long id){
        this.id = id;
    }



}
