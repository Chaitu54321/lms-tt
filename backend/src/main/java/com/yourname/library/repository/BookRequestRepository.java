package com.yourname.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yourname.library.model.BookRequest;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
}
