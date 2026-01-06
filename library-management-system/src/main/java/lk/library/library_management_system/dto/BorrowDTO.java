package com.library_management_system.Library.Management.System.dto;

import java.time.LocalDate;

public class BorrowDTO {
    private int id;
    private BookSimpleDTO book;
    private MemberSimpleDTO member;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;

    // Inner class for Book
    public static class BookSimpleDTO {
        private Integer bookId;
        private String title;
        private String isbn;

        public BookSimpleDTO(Integer bookId, String title, String isbn) {
            this.bookId = bookId;
            this.title = title;
            this.isbn = isbn;
        }

        public Integer getBookId() { return bookId; }
        public void setBookId(Integer bookId) { this.bookId = bookId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getIsbn() { return isbn; }
        public void setIsbn(String isbn) { this.isbn = isbn; }
    }

    // Inner class for Member
    public static class MemberSimpleDTO {
        private Long memberId;
        private String firstName;
        private String lastName;
        private String email;

        public MemberSimpleDTO(Long memberId, String firstName, String lastName, String email) {
            this.memberId = memberId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }

        public Long getMemberId() { return memberId; }
        public void setMemberId(Long memberId) { this.memberId = memberId; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // Constructors
    public BorrowDTO() {}

    public BorrowDTO(int id, BookSimpleDTO book, MemberSimpleDTO member,
                     LocalDate borrowDate, LocalDate dueDate, LocalDate returnDate, String status) {
        this.id = id;
        this.book = book;
        this.member = member;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public BookSimpleDTO getBook() { return book; }
    public void setBook(BookSimpleDTO book) { this.book = book; }

    public MemberSimpleDTO getMember() { return member; }
    public void setMember(MemberSimpleDTO member) { this.member = member; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}