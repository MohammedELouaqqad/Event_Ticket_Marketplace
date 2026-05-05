package com.example.backendv.Controller;


import com.example.backendv.Entity.Event;

import com.example.backendv.Repository.EventRepository;
import com.example.backendv.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins ="http://localhost:5173")
@RestController
@RequestMapping("/api")
public class EventController {


    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }


    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents(){
        return eventService.getAllEvents();
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id){
        return eventService.getEventById(id);
    }


    @PostMapping("/events")
    public ResponseEntity<String> CreateEvent(@RequestBody Event event){
        return eventService.CreateEvent(event);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<String> EditingEvent(@RequestBody Event newEvent, @PathVariable Long id){
        return eventService.EditingEvent(newEvent, id);
    }


    @DeleteMapping("/events/{id}")
    public ResponseEntity<String> DeleteEvent(@PathVariable Long id){
        return eventService.DeleteEvent(id);
    }


}
