package com.example.backendv.Service;

import com.example.backendv.Dao.AuthenticationRequest;
import com.example.backendv.Dao.AuthenticationResponse;
import com.example.backendv.Dao.RegisterRequest;
import com.example.backendv.Entity.User;
import com.example.backendv.Repository.UserRepository;
import com.example.backendv.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthenticationService {



    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public List<User> getAllUsers(){
        return repository.findAll();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

    }


    public AuthenticationResponse register( RegisterRequest request){

        var newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        repository.save(newUser);
        var jwtToken = jwtService.generateToken(newUser);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

    }
}
