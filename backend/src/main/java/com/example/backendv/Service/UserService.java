package com.example.backendv.Service;

import com.example.backendv.Entity.User;
import com.example.backendv.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;


    public List<User> getAllUsers(){
        return userRepository.findAll();
    }


    public ResponseEntity<?> loginNewUser( User entity){
        try{

            User user = userRepository.findUserByEmail(entity.getEmail());

            if(user == null){
                return ResponseEntity.notFound().build();
            }

            if(!user.getPassword().equals(entity.getPassword())){
                return ResponseEntity.badRequest().body("Error in the email or the password");
            }

            return ResponseEntity.ok(user);


        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the server");
        }
    }


    public ResponseEntity<?> signUpNewUser( User entity){
        try{
            System.out.println(userRepository.existsUserByEmail(entity.getEmail()));
            if(userRepository.existsUserByEmail(entity.getEmail())){
                return ResponseEntity.badRequest().body("This Email already exist");
            }

            User newUser = new User(entity.getUsername(),entity.getPassword(),entity.getEmail());

            userRepository.save(newUser);

            return ResponseEntity.ok(newUser);

        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error in the server:"+e);
        }
    }
}
