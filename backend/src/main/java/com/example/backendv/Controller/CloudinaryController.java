package com.example.backendv.Controller;


import com.example.backendv.Service.CloudinaryImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


@CrossOrigin(origins ="http://localhost:5173")
@RestController
@RequestMapping("/api/cloudinary/upload")
public class CloudinaryController {


    @Autowired
    private CloudinaryImageService cloudinaryImageService;

    @PostMapping
    public ResponseEntity<Map> uploadImage(@RequestParam("image")MultipartFile file){
        Map data = this.cloudinaryImageService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
