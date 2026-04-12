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


    public List<Event> getAllTickets(){
        return eventRepository.findAll();
    }



    public ResponseEntity<?> CreateEvent( Event event){
        try{
            System.out.println("Hello:"+event);
            eventRepository.save(event);

            return ResponseEntity.ok(event);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }


    public ResponseEntity<?> EditingEvent( Event newEvent, Long id){
        try{
            Event event = eventRepository.findEventById(id);
            System.out.println(event);
            event.setDate(newEvent.getDate());
            event.setName(newEvent.getName());
            event.setPrice(newEvent.getPrice());
            event.setDescription(newEvent.getDescription());
            event.setAvailable_tickets(newEvent.getAvailable_tickets());
            event.setFileName(newEvent.getFileName());

            eventRepository.save(event);

            System.out.println(event);

            return ResponseEntity.ok(event);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }



    public ResponseEntity<?> DeleteEvent( Long id){
        try{
            eventRepository.deleteById(id);
            return ResponseEntity.ok("The Event deleted with Success");
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the Server:"+e);
        }
    }

}
