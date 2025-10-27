package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.dto.AuthorDTO.Authorresponsedto;
import lk.library.library_management_system.books.dto.AuthorDTO.Authorsavedto;
import lk.library.library_management_system.books.dto.AuthorDTO.Authorupdatedto;
import lk.library.library_management_system.books.entities.Author;
import lk.library.library_management_system.books.exception.AuthorNotFoundException;
import lk.library.library_management_system.books.repository.Authorrepo;
import lk.library.library_management_system.books.repository.Booksrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class Authorservice {

    @Autowired
    private Authorrepo authorRepository;

    @Autowired
    private Booksrepo booksRepository;

    // DTO methods for REST API
    @Transactional(readOnly = true)
    public List<Authorresponsedto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Authorresponsedto getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException("Author not found with id: " + id));
        return convertToResponseDTO(author);
    }

    @Transactional
    public Authorresponsedto createAuthor(Authorsavedto authorSaveDTO) {
        Author author = new Author();
        author.setAuthorName(authorSaveDTO.getAuthorName());
        author.setBio(authorSaveDTO.getBio());

        Author savedAuthor = authorRepository.save(author);
        return convertToResponseDTO(savedAuthor);
    }

    @Transactional
    public Authorresponsedto updateAuthor(Long id, Authorupdatedto authorUpdateDTO) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException("Author not found with id: " + id));

        author.setAuthorName(authorUpdateDTO.getAuthorName());
        author.setBio(authorUpdateDTO.getBio());

        Author updatedAuthor = authorRepository.save(author);
        return convertToResponseDTO(updatedAuthor);
    }

    @Transactional
    public void deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException("Author not found with id: " + id));

        // TODO: Add book count check later when repository is fixed
        // Long bookCount = booksRepository.countByAuthorId(author.getAuthorID());
        // if (bookCount > 0) {
        //     throw new RuntimeException("Cannot delete author. There are " + bookCount + " books associated with this author.");
        // }

        authorRepository.delete(author);
    }

    @Transactional(readOnly = true)
    public Long getAuthorsCount() {
        return authorRepository.count();
    }

    // Entity methods for Thymeleaf views
    @Transactional(readOnly = true)
    public List<Author> getAllAuthorsForView() {
        return authorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Author getAuthorByIdForView(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException("Author not found with id: " + id));
    }

    // Helper method to convert Entity to Response DTO
    private Authorresponsedto convertToResponseDTO(Author author) {
        Authorresponsedto dto = new Authorresponsedto();
        dto.setAuthorID(author.getAuthorID());
        dto.setAuthorName(author.getAuthorName());
        dto.setBio(author.getBio());
        return dto;
    }
}