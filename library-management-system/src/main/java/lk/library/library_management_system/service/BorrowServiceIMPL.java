package com.library_management_system.Library.Management.System.service;

import com.library_management_system.Library.Management.System.dto.*;
import com.library_management_system.Library.Management.System.entity.Borrow;
import com.library_management_system.Library.Management.System.entity.Book;
import com.library_management_system.Library.Management.System.entity.Member;
import com.library_management_system.Library.Management.System.repo.BookRepo;
import com.library_management_system.Library.Management.System.repo.BorrowRepo;
import com.library_management_system.Library.Management.System.repo.MemberRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowServiceIMPL implements BorrowService {

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private MemberRepo memberRepo;

    @Autowired
    private BorrowRepo borrowRepo;

    private static final int MAX_BOOKS_PER_MEMBER = 5;

    @Override
    public String addBorrow(BorrowSaveDTO borrowSaveDTO) {
        try {
            if (!canMemberBorrow(borrowSaveDTO.getMember_id())) {
                return "Member has reached maximum borrowing limit";
            }

            Optional<Borrow> existingBorrow = borrowRepo.findActiveMemberBookBorrow(
                    borrowSaveDTO.getMember_id(), borrowSaveDTO.getBook_id());
            if (existingBorrow.isPresent()) {
                return "Member already has this book borrowed";
            }

            LocalDate dueDate = borrowSaveDTO.getDueDate();
            if (dueDate == null) {
                dueDate = borrowSaveDTO.getBorrowDate().plusDays(borrowSaveDTO.getBorrowDays());
            }

            Book book = bookRepo.findById(borrowSaveDTO.getBook_id())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            Member member = memberRepo.findById(borrowSaveDTO.getMember_id())
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            Borrow borrow = new Borrow(book, member, borrowSaveDTO.getBorrowDate(), dueDate);
            borrowRepo.save(borrow);
            return "Book borrowed successfully";
        } catch (Exception e) {
            return "Error borrowing book: " + e.getMessage();
        }
    }

    @Override
    public List<BorrowDTO> getAllBorrow() {
        List<Borrow> getBorrow = borrowRepo.findAll();
        List<BorrowDTO> borrowDTOList = new ArrayList<>();

        for(Borrow borrow : getBorrow) {
            BorrowDTO.BookSimpleDTO bookDTO = new BorrowDTO.BookSimpleDTO(
                    borrow.getBook().getBookId(),
                    borrow.getBook().getTitle(),
                    borrow.getBook().getIsbn()
            );

            BorrowDTO.MemberSimpleDTO memberDTO = new BorrowDTO.MemberSimpleDTO(
                    borrow.getMember().getId(),
                    borrow.getMember().getFirstName(),
                    borrow.getMember().getLastName(),
                    borrow.getMember().getEmail()
            );

            BorrowDTO borrowDTO = new BorrowDTO(
                    borrow.getId(),
                    bookDTO,
                    memberDTO,
                    borrow.getBorrowDate(),
                    borrow.getDueDate(),
                    borrow.getReturnDate(),
                    borrow.getStatus()
            );
            borrowDTOList.add(borrowDTO);
        }
        return borrowDTOList;
    }

    @Override
    public String updateBorrow(BorrowUpdateDTO borrowUpdateDTO) {
        try {
            if(borrowRepo.existsById(borrowUpdateDTO.getId())) {
                Borrow borrow = borrowRepo.findById(borrowUpdateDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Borrow not found"));

                Book book = bookRepo.findById(borrowUpdateDTO.getBook_id())
                        .orElseThrow(() -> new RuntimeException("Book not found"));
                Member member = memberRepo.findById(borrowUpdateDTO.getMember_id())
                        .orElseThrow(() -> new RuntimeException("Member not found"));

                borrow.setBook(book);
                borrow.setMember(member);
                borrow.setBorrowDate(borrowUpdateDTO.getBorrowDate());
                borrow.setDueDate(borrowUpdateDTO.getDueDate());
                borrow.setReturnDate(borrowUpdateDTO.getReturnDate());
                borrow.setStatus(borrowUpdateDTO.getStatus());

                borrowRepo.save(borrow);
                return "Borrow updated successfully.";
            } else {
                return "Borrow ID Not Found";
            }
        } catch (Exception ex) {
            return "Error updating borrow: " + ex.getMessage();
        }
    }

    @Override
    public String returnBook(ReturnDTO returnBookDTO) {
        try {
            Optional<Borrow> borrowOptional = borrowRepo.findById(returnBookDTO.getBorrowId());
            if (borrowOptional.isPresent()) {
                Borrow borrow = borrowOptional.get();

                if (borrow.getReturnDate() != null) {
                    return "Book is already returned";
                }

                borrow.setReturnDate(returnBookDTO.getActualReturnDate());
                borrow.setStatus("RETURNED");

                borrowRepo.save(borrow);
                return "Book returned successfully";
            }
            return "Borrow record not found";
        } catch (Exception ex) {
            return "Error returning book: " + ex.getMessage();
        }
    }

    @Override
    public List<BorrowDTO> getOverdueBooks() {
        List<Borrow> overdueBorrows = borrowRepo.findOverdueBooks(LocalDate.now());
        List<BorrowDTO> borrowDTOList = new ArrayList<>();

        for (Borrow borrow : overdueBorrows) {
            BorrowDTO.BookSimpleDTO bookDTO = new BorrowDTO.BookSimpleDTO(
                    borrow.getBook().getBookId(),
                    borrow.getBook().getTitle(),
                    borrow.getBook().getIsbn()
            );

            BorrowDTO.MemberSimpleDTO memberDTO = new BorrowDTO.MemberSimpleDTO(
                    borrow.getMember().getId(),
                    borrow.getMember().getFirstName(),
                    borrow.getMember().getLastName(),
                    borrow.getMember().getEmail()
            );

            BorrowDTO borrowDTO = new BorrowDTO(
                    borrow.getId(),
                    bookDTO,
                    memberDTO,
                    borrow.getBorrowDate(),
                    borrow.getDueDate(),
                    borrow.getReturnDate(),
                    "OVERDUE"
            );
            borrowDTOList.add(borrowDTO);
        }
        return borrowDTOList;
    }

    @Override
    public List<BorrowDTO> getMemberBorrows(Long memberId) {
        List<Borrow> memberBorrows = borrowRepo.findByMember_Id(memberId);
        List<BorrowDTO> borrowDTOList = new ArrayList<>();

        for (Borrow borrow : memberBorrows) {
            BorrowDTO.BookSimpleDTO bookDTO = new BorrowDTO.BookSimpleDTO(
                    borrow.getBook().getBookId(),
                    borrow.getBook().getTitle(),
                    borrow.getBook().getIsbn()
            );

            BorrowDTO.MemberSimpleDTO memberDTO = new BorrowDTO.MemberSimpleDTO(
                    borrow.getMember().getId(),
                    borrow.getMember().getFirstName(),
                    borrow.getMember().getLastName(),
                    borrow.getMember().getEmail()
            );

            BorrowDTO borrowDTO = new BorrowDTO(
                    borrow.getId(),
                    bookDTO,
                    memberDTO,
                    borrow.getBorrowDate(),
                    borrow.getDueDate(),
                    borrow.getReturnDate(),
                    borrow.getStatus()
            );
            borrowDTOList.add(borrowDTO);
        }
        return borrowDTOList;
    }

    @Override
    public List<BorrowDTO> getActiveBorrows() {
        List<Borrow> activeBorrows = borrowRepo.findByReturnDateIsNull();
        List<BorrowDTO> borrowDTOList = new ArrayList<>();

        for (Borrow borrow : activeBorrows) {
            String status = borrow.getStatus();
            if (borrow.getDueDate() != null && borrow.getDueDate().isBefore(LocalDate.now())) {
                status = "OVERDUE";
            }

            BorrowDTO.BookSimpleDTO bookDTO = new BorrowDTO.BookSimpleDTO(
                    borrow.getBook().getBookId(),
                    borrow.getBook().getTitle(),
                    borrow.getBook().getIsbn()
            );

            BorrowDTO.MemberSimpleDTO memberDTO = new BorrowDTO.MemberSimpleDTO(
                    borrow.getMember().getId(),
                    borrow.getMember().getFirstName(),
                    borrow.getMember().getLastName(),
                    borrow.getMember().getEmail()
            );

            BorrowDTO borrowDTO = new BorrowDTO(
                    borrow.getId(),
                    bookDTO,
                    memberDTO,
                    borrow.getBorrowDate(),
                    borrow.getDueDate(),
                    borrow.getReturnDate(),
                    status
            );
            borrowDTOList.add(borrowDTO);
        }
        return borrowDTOList;
    }

    @Override
    public String updateOverdueStatus() {
        try {
            List<Borrow> overdueBorrows = borrowRepo.findOverdueBooks(LocalDate.now());
            int updateCount = 0;

            for (Borrow borrow : overdueBorrows) {
                if (!"OVERDUE".equals(borrow.getStatus())) {
                    borrow.setStatus("OVERDUE");
                    borrowRepo.save(borrow);
                    updateCount++;
                }
            }

            return "Updated " + updateCount + " overdue books";
        } catch (Exception e) {
            return "Error updating overdue status: " + e.getMessage();
        }
    }

    @Override
    public boolean canMemberBorrow(Long memberId) {
        try {
            int activeCount = borrowRepo.countActiveBorrowsByMemberId(memberId);
            if (activeCount >= MAX_BOOKS_PER_MEMBER) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public int getMaxBooksAllowed() {
        return MAX_BOOKS_PER_MEMBER;
    }
}