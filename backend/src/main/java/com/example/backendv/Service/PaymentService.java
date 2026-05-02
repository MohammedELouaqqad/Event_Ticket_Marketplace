package com.example.backendv.Service;


import com.example.backendv.Entity.Order;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class PaymentService{

    @Value("${stripe.secretKey}")
    private String secretKey;

    public ResponseEntity<String> checkoutOrders(Order order) throws StripeException{
        Stripe.apiKey=secretKey;

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(order.getUser().getName())
                        .build();


        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("USD")
                        .setProductData(productData)
                .setUnitAmount((long) (order.getEvent().getPrice() * 100L))
                .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                .setQuantity(order.getQuantity())
                .setPriceData(priceData)
                .build();

        SessionCreateParams params =
                SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:8085/success")
                    .setCancelUrl("http://localhost:8085/cancel")
                    .addLineItem(lineItem)
                    .build();

        Session session=null;

        try{
            session=Session.create(params);
            return ResponseEntity.ok(session.getUrl());
        }catch(StripeException e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }

    }
}
