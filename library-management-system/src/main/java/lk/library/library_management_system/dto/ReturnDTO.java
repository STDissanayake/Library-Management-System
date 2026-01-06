package com.library_management_system.Library.Management.System.dto;

import java.time.LocalDate;

public class ReturnDTO {
    private int borrowId;
    private LocalDate actualReturnDate;
    private String condition;

    public ReturnDTO() {}

    public ReturnDTO(int borrowId, LocalDate actualReturnDate, String condition) {
        this.borrowId = borrowId;
        this.actualReturnDate = actualReturnDate;
        this.condition = condition;
    }

    public int getBorrowId() { return borrowId; }
    public void setBorrowId(int borrowId) { this.borrowId = borrowId; }

    public LocalDate getActualReturnDate() { return actualReturnDate; }
    public void setActualReturnDate(LocalDate actualReturnDate) { this.actualReturnDate = actualReturnDate; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
}