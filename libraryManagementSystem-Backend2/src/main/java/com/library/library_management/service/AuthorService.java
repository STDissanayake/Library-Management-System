package com.library.library_management.service;

import com.library.library_management.model.Author;
import com.library.library_management.repository.AuthorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Optional<Author> getAuthorById(Long id) {
        return authorRepository.findById(id);
    }

    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    public Optional<Author> updateAuthor(Long id, Author authorDetails) {
        return authorRepository.findById(id).map(author -> {
            author.setName(authorDetails.getName());
            author.setBio(authorDetails.getBio());
            author.setNationality(authorDetails.getNationality());
            return authorRepository.save(author);
        });
    }

    public boolean deleteAuthor(Long id) {
        return authorRepository.findById(id).map(author -> {
            authorRepository.delete(author);
            return true;
        }).orElse(false);
    }

    public List<Author> searchAuthors(String query) {
        return authorRepository.searchAuthors(query);
    }

    public Long getAuthorsCount() {
        return authorRepository.countTotalAuthors();
    }
}
