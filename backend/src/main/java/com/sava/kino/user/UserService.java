package com.sava.kino.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder pwEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder pwEncoder) {
        this.userRepo = userRepo;
        this.pwEncoder = pwEncoder;
    }

    public UserResponse registerUser(UserRegistrationRequest req) {
        if (userRepo.existsByUsernameIgnoreCase(req.username()))
            throw new UserAlreadyExistsException();
        if (userRepo.existsByEmailIgnoreCase(req.email()))
            throw new UserAlreadyExistsException();

        String pwHash = pwEncoder.encode(req.password());
        Instant now = Instant.now();
        User user = new User(req.username(), req.email(), pwHash, now, now);
        user = userRepo.save(user);

        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}
