package com.skillshare.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            System.out.println("Error parsing JWT token: " + e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        try {
            final Date expiration = extractExpiration(token);
            boolean isExpired = expiration.before(new Date());
            if (isExpired) {
                System.out.println("Token is expired. Expiration: " + expiration + ", Current time: " + new Date());
            }
            return isExpired;
        } catch (Exception e) {
            System.out.println("Error checking token expiration: " + e.getMessage());
            return true; // Consider token expired if we can't check it
        }
    }

    public boolean validateToken(String token) {
        if (token == null) {
            System.out.println("Token is null");
            return false;
        }

        try {
            // First, try to parse the token without checking expiration
            String username = extractUsername(token);
            System.out.println("Validating token for user: " + username);
            
            // Then check if token is expired
            if (isTokenExpired(token)) {
                System.out.println("JWT token is expired for user: " + username);
                return false;
            }
            
            // If everything is fine, return true
            System.out.println("Token is valid for user: " + username);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
            return false;
        } catch (SignatureException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            System.out.println("JWT exception: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("Unexpected error validating token: " + e.getMessage());
            return false;
        }
    }
}
