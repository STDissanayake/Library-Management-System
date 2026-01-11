package com.library.library_management.mapper;

import com.library.library_management.dto.AuthorDTO;
import com.library.library_management.dto.BookDTO;
import com.library.library_management.dto.PublisherDTO;
import com.library.library_management.model.Author;
import com.library.library_management.model.Book;
import com.library.library_management.model.Publisher;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public BookDTO toDTO(Book book) {
        if (book == null) return null;
        
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setIsbn(book.getIsbn());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setCategory(book.getCategory());
        dto.setStatus(book.getStatus());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        
        if (book.getAuthor() != null) {
            AuthorDTO authorDTO = new AuthorDTO();
            authorDTO.setId(book.getAuthor().getId());
            authorDTO.setName(book.getAuthor().getName());
            authorDTO.setBio(book.getAuthor().getBio());
            authorDTO.setNationality(book.getAuthor().getNationality());
            dto.setAuthor(authorDTO);
        }
        
        if (book.getPublisher() != null) {
            PublisherDTO publisherDTO = new PublisherDTO();
            publisherDTO.setId(book.getPublisher().getId());
            publisherDTO.setName(book.getPublisher().getName());
            publisherDTO.setAddress(book.getPublisher().getAddress());
            publisherDTO.setContactInfo(book.getPublisher().getContactInfo());
            dto.setPublisher(publisherDTO);
        }
        
        return dto;
    }

    public Book toEntity(BookDTO dto) {
        if (dto == null) return null;
        
        Book book = new Book();
        book.setId(dto.getId());
        book.setTitle(dto.getTitle());
        book.setIsbn(dto.getIsbn());
        book.setPublicationDate(dto.getPublicationDate());
        book.setCategory(dto.getCategory());
        book.setStatus(dto.getStatus());
        book.setTotalCopies(dto.getTotalCopies());
        book.setAvailableCopies(dto.getAvailableCopies());
        
        if (dto.getAuthor() != null) {
            Author author = new Author();
            author.setId(dto.getAuthor().getId());
            book.setAuthor(author);
        }
        
        if (dto.getPublisher() != null) {
            Publisher publisher = new Publisher();
            publisher.setId(dto.getPublisher().getId());
            book.setPublisher(publisher);
        }
        
        return book;
    }
}
