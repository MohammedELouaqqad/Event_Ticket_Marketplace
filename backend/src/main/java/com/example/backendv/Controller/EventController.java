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

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;


    @GetMapping("/AllEvents")
    public List<Event> getAllTickets(){
        return eventService.getAllTickets();
    }


    @PostMapping("/AddEvent")
    public ResponseEntity<?> CreateEvent(@RequestBody Event event){
        return eventService.CreateEvent(event);
    }

    @PutMapping("/EditEvent/{id}")
    public ResponseEntity<?> EditingEvent(@RequestBody Event newEvent, @PathVariable Long id){
        return eventService.EditingEvent(newEvent, id);
    }


    @DeleteMapping("/DeleteEvent/{id}")
    public ResponseEntity<?> DeleteEvent(@PathVariable Long id){
        return eventService.DeleteEvent(id);
    }


}
