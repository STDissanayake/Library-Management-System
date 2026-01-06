package com.library_management_system.Library.Management.System.controller;

import com.library_management_system.Library.Management.System.dto.*;
import com.library_management_system.Library.Management.System.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/v1/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping(path = "/save")
    public String saveBorrow(@RequestBody BorrowSaveDTO borrowSaveDTO) {
        String borrowBooks = borrowService.addBorrow(borrowSaveDTO);
        return borrowBooks;
    }

    @GetMapping(path = "/getAllBorrow")
    public List<BorrowDTO> getAllBorrow() {
        List<BorrowDTO> allborrow = borrowService.getAllBorrow();
        return allborrow;
    }

    @PutMapping(path = "/update")
    public String updateBorrow(@RequestBody BorrowUpdateDTO borrowUpdateDTO) {
        String borrow = borrowService.updateBorrow(borrowUpdateDTO);
        return borrow;
    }

    @PostMapping(path = "/return")
    public String returnBook(@RequestBody ReturnDTO returnBookDTO) {
        String result = borrowService.returnBook(returnBookDTO);
        return result;
    }

    @GetMapping(path = "/overdue")
    public List<BorrowDTO> getOverdueBooks() {
        return borrowService.getOverdueBooks();
    }

    @GetMapping(path = "/member/{memberId}")
    public List<BorrowDTO> getMemberBorrows(@PathVariable Long memberId) {
        return borrowService.getMemberBorrows(memberId);
    }

    @GetMapping(path = "/active")
    public List<BorrowDTO> getActiveBorrows() {
        return borrowService.getActiveBorrows();
    }

    @PostMapping(path = "/updateOverdue")
    public String updateOverdueStatus() {
        return borrowService.updateOverdueStatus();
    }

    @GetMapping(path = "/canBorrow/{memberId}")
    public boolean canMemberBorrow(@PathVariable Long memberId) {
        return borrowService.canMemberBorrow(memberId);
    }

    @GetMapping(path = "/maxBooks")
    public int getMaxBooksAllowed() {
        return borrowService.getMaxBooksAllowed();
    }
}