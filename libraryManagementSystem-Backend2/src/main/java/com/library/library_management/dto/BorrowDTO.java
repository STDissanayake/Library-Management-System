package com.library.library_management.dto;

import java.time.LocalDate;

public class BorrowDTO {
    private Long id;
    private BookDTO book;
    private MemberDTO member;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;
    private Integer borrowDays;
    private Double fineAmount;

    // Constructors
    public BorrowDTO() {}

    public BorrowDTO(Long id, BookDTO book, MemberDTO member, LocalDate borrowDate, LocalDate dueDate, LocalDate returnDate, String status, Integer borrowDays, Double fineAmount) {
        this.id = id;
        this.book = book;
        this.member = member;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.borrowDays = borrowDays;
        this.fineAmount = fineAmount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BookDTO getBook() { return book; }
    public void setBook(BookDTO book) { this.book = book; }

    public MemberDTO getMember() { return member; }
    public void setMember(MemberDTO member) { this.member = member; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getBorrowDays() { return borrowDays; }
    public void setBorrowDays(Integer borrowDays) { this.borrowDays = borrowDays; }

    public Double getFineAmount() { return fineAmount; }
    public void setFineAmount(Double fineAmount) { this.fineAmount = fineAmount; }
}
