package com.example.backendv.Service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmailWithAttachment(String toEmail,
                          String subject,
                          String body,
                          byte[] qrByte) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true);

        helper.setFrom("mohammedelouaqqad55@gmail.com");
        helper.setTo(toEmail);
        helper.setText(body);
        helper.setSubject(subject);
        helper.addAttachment("QRCode.png",new ByteArrayResource(qrByte));

        mailSender.send(message);

        System.out.println("Mail Sent Successfully...");
    }
}
