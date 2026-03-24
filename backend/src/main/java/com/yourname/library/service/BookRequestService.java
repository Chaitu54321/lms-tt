package com.yourname.library.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yourname.library.model.BookRequest;
import com.yourname.library.model.Book;
import com.yourname.library.repository.BookRequestRepository;
import com.yourname.library.repository.BookRepository;

@Service
public class BookRequestService {

    private final BookRequestRepository repository;
    private final BookRepository bookRepository;

    public BookRequestService(BookRequestRepository repository, BookRepository bookRepository) {
        this.repository = repository;
        this.bookRepository = bookRepository;
    }

    public List<BookRequest> getAllRequests() {
        return repository.findAll();
    }

    public BookRequest createRequest(BookRequest request) {
        return repository.save(request);
    }

    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public BookRequest approveRequest(Long id) {
        BookRequest request = repository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("APPROVED");
        
        Book newBook = Book.builder()
            .title(request.getTitle())
            .author(request.getAuthor())
            .available(true)
            .interestedCount(0)
            .build();
            
        bookRepository.save(newBook);
        return repository.save(request);
    }
}
