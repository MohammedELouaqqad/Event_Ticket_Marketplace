package com.example.backendv.Service;


import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageService {


    private final Cloudinary cloudinary;

    public CloudinaryImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map upload(MultipartFile file){
        try{
            Map data = this.cloudinary.uploader().upload(file.getBytes(),Map.of());
            return data;
        } catch (IOException e) {
            throw new RuntimeException("Image uploading fail !!");
        }

    }

}
