package com.yourname.library.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yourname.library.model.Book;
import com.yourname.library.repository.BookRepository;

@Service
public class BookService {

    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    public List<Book> getAllBooks() {
        return repository.findAll();
    }

    public Book getBookById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public Book saveBook(Book book) {
        return repository.save(book);
    }

    public void deleteBook(Integer id) {
        repository.deleteById(id);
    }

    public Book toggleAvailability(Integer id) {
        Book book = getBookById(id);
        book.setAvailable(!book.isAvailable());
        return repository.save(book);
    }

    public Book incrementInterest(Integer id) {
        Book book = getBookById(id);
        int currentCount = book.getInterestedCount() == null ? 0 : book.getInterestedCount();
        book.setInterestedCount(currentCount + 1);
        return repository.save(book);
    }
}
