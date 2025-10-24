package com.library_management_system.Library.Management.System.dto;

import java.time.LocalDate;

public class BorrowUpdateDTO {
    private int id;
    private int book_id;
    private Long member_id;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;

    public BorrowUpdateDTO() {}

    public BorrowUpdateDTO(int id, int book_id, Long member_id, LocalDate borrowDate,
                           LocalDate dueDate, LocalDate returnDate, String status) {
        this.id = id;
        this.book_id = book_id;
        this.member_id = member_id;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getBook_id() { return book_id; }
    public void setBook_id(int book_id) { this.book_id = book_id; }

    public Long getMember_id() { return member_id; }
    public void setMember_id(Long member_id) { this.member_id = member_id; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}