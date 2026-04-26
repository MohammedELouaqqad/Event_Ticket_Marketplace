package com.example.backendv.Controller;


import com.example.backendv.Service.QrCodeGeneratorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class QRCodeController {


    @Autowired
    QrCodeGeneratorService qrCodeGeneratorService;


    @PostMapping("/qrcode")
    public ResponseEntity<String> addCustomer(@RequestBody String message){
        qrCodeGeneratorService.generateQRCode(message);
        return ResponseEntity.ok("Created QR Code with Success");
    }
}
