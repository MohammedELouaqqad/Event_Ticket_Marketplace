package com.example.backendv.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

//@Setter
//@Getter
//@ToString
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalPrice;

    private Integer quantity;

    @ManyToOne
    private User user;



//    //@JsonIgnore
    @ManyToOne
    private Event event;

    public Order(Long id){
        this.id = id;
    }



}
