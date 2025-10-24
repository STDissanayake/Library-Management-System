package com.library_management_system.Library.Management.System.dto;

import java.time.LocalDate;

public class BorrowSaveDTO {
    private int book_id;
    private Long member_id;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private int borrowDays = 14;

    public BorrowSaveDTO() {}

    public BorrowSaveDTO(int book_id, Long member_id, LocalDate borrowDate, LocalDate dueDate, int borrowDays) {
        this.book_id = book_id;
        this.member_id = member_id;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.borrowDays = borrowDays;
    }

    public int getBook_id() { return book_id; }
    public void setBook_id(int book_id) { this.book_id = book_id; }

    public Long getMember_id() { return member_id; }
    public void setMember_id(Long member_id) { this.member_id = member_id; }  // Changed from setUser_id()

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public int getBorrowDays() { return borrowDays; }
    public void setBorrowDays(int borrowDays) { this.borrowDays = borrowDays; }
}