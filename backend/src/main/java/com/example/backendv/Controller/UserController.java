package com.example.backendv.Controller;


import com.example.backendv.Entity.User;
import com.example.backendv.Repository.UserRepository;
import com.example.backendv.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/AllUsers")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> loginNewUser(@RequestBody User newUser){
        return userService.loginNewUser(newUser);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUpNewUser(@RequestBody User user){
        return userService.signUpNewUser(user);
    }
}
