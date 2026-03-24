package com.yourname.library.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourname.library.model.Book;
import com.yourname.library.model.User;
import com.yourname.library.repository.BookRepository;
import com.yourname.library.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public UserController(UserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUserProfile() {
        return ResponseEntity.ok(getCurrentUser());
    }

    @GetMapping("/wishlist")
    public ResponseEntity<Set<Book>> getWishlist() {
        return ResponseEntity.ok(getCurrentUser().getWishlist());
    }

    @PostMapping("/wishlist/{bookId}")
    public ResponseEntity<Set<Book>> addToWishlist(@PathVariable Long bookId) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId.intValue()).orElseThrow(() -> new RuntimeException("Book not found"));
        user.getWishlist().add(book);
        userRepository.save(user);
        return ResponseEntity.ok(user.getWishlist());
    }

    @DeleteMapping("/wishlist/{bookId}")
    public ResponseEntity<Set<Book>> removeFromWishlist(@PathVariable Long bookId) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId.intValue()).orElseThrow(() -> new RuntimeException("Book not found"));
        user.getWishlist().remove(book);
        userRepository.save(user);
        return ResponseEntity.ok(user.getWishlist());
    }
}
