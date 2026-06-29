package com.example.backendv.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



import static org.apache.catalina.webresources.TomcatURLStreamHandlerFactory.disable;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import org.hibernate.sql.Delete;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {


    private final JwtAuthentificationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req

                               .requestMatchers("/api/v1/auth/**").permitAll()
                               .requestMatchers("/api/webhooks/stripe").permitAll()

                                .requestMatchers(GET, "/api/events/**").authenticated()

                               .requestMatchers(POST, "/api/events/**").hasAuthority("ADMIN")
                                .requestMatchers(DELETE, "/api/events/**").hasAuthority("ADMIN")
                                .requestMatchers(PUT, "/api/events/**").hasAuthority("ADMIN")

                               .requestMatchers(GET, "/api/orders/**").hasAuthority("ADMIN")
                               .requestMatchers(POST, "/api/orders/**").authenticated()
                               .requestMatchers(POST, "/api/addingPayment").authenticated()
                               
                               .requestMatchers("/api/cloudinary/**").authenticated()
                               .anyRequest().authenticated()
                )

                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
