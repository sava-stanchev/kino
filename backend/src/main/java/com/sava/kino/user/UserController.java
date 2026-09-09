package com.sava.kino.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private final UserService userSvc;

    public UserController(UserService userSvc) {
        this.userSvc = userSvc;
    }

    @PostMapping("/api/users")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRegistrationRequest req) {
        return userSvc.registerUser(req);
    }

    @GetMapping("/api/users")
    public List<UserResponse> getUsers(Authentication auth) {
        return userSvc.findAllUsers(auth);
    }

    @DeleteMapping("/api/users/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long userId, Authentication auth) {
        userSvc.deleteUser(userId, auth);
    }
}
