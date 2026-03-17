package com.yourname.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yourname.library.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
}
