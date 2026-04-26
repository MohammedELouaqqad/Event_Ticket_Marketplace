package com.example.backendv;

import com.example.backendv.Service.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class BackendvApplication {


	public static void main(String[] args) {

		SpringApplication.run(BackendvApplication.class, args);
	}

}
