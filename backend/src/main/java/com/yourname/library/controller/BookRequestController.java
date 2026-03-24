package com.yourname.library.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.yourname.library.model.BookRequest;
import com.yourname.library.service.BookRequestService;

@RestController
@RequestMapping("/api/books/requests")
public class BookRequestController {

    private final BookRequestService bookRequestService;

    public BookRequestController(BookRequestService bookRequestService) {
        this.bookRequestService = bookRequestService;
    }

    @GetMapping
    public ResponseEntity<List<BookRequest>> getAllRequests() {
        return ResponseEntity.ok(bookRequestService.getAllRequests());
    }

    @PostMapping
    public ResponseEntity<BookRequest> createRequest(@RequestBody BookRequest request) {
        return ResponseEntity.ok(bookRequestService.createRequest(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        bookRequestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookRequest> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(bookRequestService.approveRequest(id));
    }
}
