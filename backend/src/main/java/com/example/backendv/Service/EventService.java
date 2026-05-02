package com.example.backendv.Service;

import com.example.backendv.Entity.Event;
import com.example.backendv.Repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class EventService {


    @Autowired
    private EventRepository eventRepository;


    public ResponseEntity<List<Event>> getAllEvents(){
        return ResponseEntity.ok(eventRepository.findAll());
    }


    public ResponseEntity<Event> getEventById(Long id){
        return ResponseEntity.ok(eventRepository.findEventById(id));
    }


    public ResponseEntity<String> CreateEvent( Event event){
        try{
            eventRepository.save(event);
            return ResponseEntity.ok("Event created with success");
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }


    public ResponseEntity<String> EditingEvent( Event newEvent, Long id){
        try{
            Event event = eventRepository.findEventById(id);

            event.setDate(newEvent.getDate());
            event.setName(newEvent.getName());
            event.setPrice(newEvent.getPrice());
            event.setDescription(newEvent.getDescription());
            event.setAvailable_tickets(newEvent.getAvailable_tickets());
            event.setFileName(newEvent.getFileName());

            eventRepository.save(event);

            return ResponseEntity.ok("Event Edited with success");
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }



    public ResponseEntity<String> DeleteEvent( Long id){
        try{
            eventRepository.deleteById(id);
            return ResponseEntity.ok("The Event deleted with Success");
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }

}
