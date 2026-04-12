package com.example.backendv.Repository;

import com.example.backendv.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository extends JpaRepository<User , Long> {
    User findUserByEmail(String email);
    boolean existsUserByEmail(String email);

}

