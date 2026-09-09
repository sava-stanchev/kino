package com.sava.kino.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional(readOnly = true)
    public List<UserResponse> findAllUsers(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(authority ->
                authority.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin)
            throw new UserForbiddenException();

        List<User> users = userRepo.findAllByOrderByUsernameAsc();
        List<UserResponse> res = new ArrayList<>();

        for (User u : users) {
            UserResponse uRes = new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole());
            res.add(uRes);
        }

        return res;
    }

    @Transactional
    public void deleteUser(Long targetId, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(authority ->
                authority.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin)
            throw new UserForbiddenException();

        String name = auth.getName();
        User caller = userRepo.findByUsernameIgnoreCase(name)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + name));
        User target = userRepo.findById(targetId).orElseThrow(UserNotFoundException::new);
        if (caller.getId().equals(target.getId()))
            throw new UserForbiddenException();

        userRepo.delete(target);
    }
}
