package com.example.backendv.Controller;


import com.example.backendv.Dao.AuthenticationRequest;
import com.example.backendv.Dao.AuthenticationResponse;
import com.example.backendv.Dao.RegisterRequest;
import com.example.backendv.Entity.User;
import com.example.backendv.Repository.UserRepository;
import com.example.backendv.Service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationService service;

    @GetMapping("/AllUsers")
    public List<User> getAllUsers(){
        return service.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }
}
