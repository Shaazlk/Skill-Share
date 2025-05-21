package com.skillshare.service;

import com.skillshare.dto.AuthRequest;
import com.skillshare.dto.AuthResponse;
import com.skillshare.dto.RegisterRequest;
import com.skillshare.model.User;
import com.skillshare.repository.UserRepository;
import com.skillshare.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());
            
            // Check if user exists first
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));
            
            System.out.println("User found in database: " + user.getEmail());
            
            // Perform authentication
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            System.out.println("Authentication successful: " + authentication.isAuthenticated());

            // Generate token
            String token = jwtUtil.generateToken(request.getEmail());
            System.out.println("JWT token generated successfully");
            
            return new AuthResponse(token);
        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + request.getEmail());
            throw e;
        } catch (UsernameNotFoundException e) {
            System.out.println("User not found: " + request.getEmail());
            throw e;
        } catch (Exception e) {
            System.out.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }
        
        try {
            User user = new User();
            user.setFirstname(request.getFirstname());
            user.setLastname(request.getLastname());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            User savedUser = userRepository.save(user);
            System.out.println("User registered successfully: " + savedUser.getEmail());

            String token = jwtUtil.generateToken(user.getEmail());
            return new AuthResponse(token);
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            throw e;
        }
    }
}
