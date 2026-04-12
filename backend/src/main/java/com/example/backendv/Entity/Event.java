package com.example.backendv.Entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DateFormat;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;
    @NotNull
    private String description;
    @NotNull
    private LocalDate date;
    @NotNull
    private Double price;
    @NotNull
    private Integer available_tickets;
    @NotNull
    private String location;
    
    private String fileName;

    @OneToMany(mappedBy = "event")
    private List<OrderItem> orderItems;
}
