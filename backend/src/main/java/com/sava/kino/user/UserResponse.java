package com.sava.kino.user;

public record UserResponse(Long id, String username, String email, UserRole role) {
}
