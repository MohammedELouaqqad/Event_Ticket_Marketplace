package com.example.backendv.Controller;


import com.example.backendv.Entity.Order;
import com.example.backendv.Service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins ="http://localhost:5173")
@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/addingPayment")
    public ResponseEntity<String> CreatePayment(@RequestBody Order order) throws StripeException {
        ResponseEntity<String> addingPayment = paymentService.checkoutOrders(order);
        if(addingPayment.getStatusCode().is2xxSuccessful()){
            return ResponseEntity.ok(addingPayment.getBody());
        }else{
            return ResponseEntity.internalServerError().body("Error in the payment");
        }
    }

    @PostMapping("/webhooks/stripe")
    public ResponseEntity<String> handleWebhookEvent(@RequestBody String payload,
                                                     @RequestHeader("Stripe-Signature") String header) throws MessagingException {
        return paymentService.handleWebhookEvent(payload,header);
    }
}
