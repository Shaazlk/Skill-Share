package com.skillshare.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();
        
        // Debug log - print request URI and auth header (partially obscured for security)
        System.out.println("Request URI: " + requestURI);
        if (authorizationHeader != null) {
            System.out.println("Auth header present: " + authorizationHeader.substring(0, Math.min(20, authorizationHeader.length())) + "...");
        } else {
            System.out.println("No auth header found in request");
        }
        
        String username = null;
        String jwt = null;
        
        // Extract the JWT token if present in the Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("Extracted username from token: " + username);
            } catch (Exception e) {
                // Log the exception - invalid token
                System.out.println("Invalid JWT token: " + e.getMessage());
            }
        }
        
        // Always allow auth endpoints without authentication
        if (requestURI.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Validate the token and set up Spring Security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Validate the token
            if (jwtUtil.validateToken(jwt)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                // Debug log
                System.out.println("✅ Authentication successful for user: " + username);
            } else {
                System.out.println("❌ Token validation failed for user: " + username);
            }
        } else if (username == null && !requestURI.startsWith("/auth/")) {
            System.out.println("⚠️ No username found in token for protected endpoint: " + requestURI);
        }
        
        filterChain.doFilter(request, response);
    }
}
