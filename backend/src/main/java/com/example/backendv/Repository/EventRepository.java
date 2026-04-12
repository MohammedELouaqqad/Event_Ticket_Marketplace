package com.example.backendv.Repository;

import com.example.backendv.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    Event findEventById(Long id);
}

