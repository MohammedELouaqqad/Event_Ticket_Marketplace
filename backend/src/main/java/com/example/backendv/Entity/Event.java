package com.example.backendv.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.text.DateFormat;
import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@ToString
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

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "event")
    private List<Order> orders;
}
