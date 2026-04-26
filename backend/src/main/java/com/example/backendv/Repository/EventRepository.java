package com.example.backendv.Repository;

import com.example.backendv.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Event findEventById(Long id);
}

