package com.library.library_management.service;

import com.library.library_management.model.Borrow;
import com.library.library_management.model.Book;
import com.library.library_management.model.Fine;
import com.library.library_management.model.Member;
import com.library.library_management.repository.BorrowRepository;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.FineRepository;
import com.library.library_management.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BorrowService {

    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final FineRepository fineRepository;

    public BorrowService(BorrowRepository borrowRepository, 
                        BookRepository bookRepository, 
                        MemberRepository memberRepository,
                        FineRepository fineRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.fineRepository = fineRepository;
    }

    public List<Borrow> getAllBorrows() {
        return borrowRepository.findAll();
    }

    public Optional<Borrow> getBorrowById(Long id) {
        return borrowRepository.findById(id);
    }

    public Borrow createBorrow(Borrow borrow) {
        // Validate book and member exist
        Book book = bookRepository.findById(borrow.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Member member = memberRepository.findById(borrow.getMember().getId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Check if a copy is available
        Integer available = book.getAvailableCopies();
        if (available == null) {
            available = 0;
        }
        if (available <= 0) {
            throw new RuntimeException("No copies available");
        }

        // Check member status and borrow limits
        if (!"ACTIVE".equals(member.getStatus())) {
            throw new RuntimeException("Member is not active");
        }

        Long activeBorrows = borrowRepository.countActiveBorrowsByMember(member.getId());
        if (activeBorrows >= 5) { // Max 5 books per member
            throw new RuntimeException("Member has reached maximum borrow limit");
        }

        // Set borrow details
        borrow.setBook(book);
        borrow.setMember(member);

        LocalDate borrowDate = borrow.getBorrowDate() != null ? borrow.getBorrowDate() : LocalDate.now();
        borrow.setBorrowDate(borrowDate);
        // Ensure new borrows are not accidentally created as already returned
        borrow.setReturnDate(null);
        borrow.setStatus("BORROWED");

        int borrowDays = (borrow.getBorrowDays() != null && borrow.getBorrowDays() > 0)
                ? borrow.getBorrowDays()
                : 14;
        borrow.setBorrowDays(borrowDays);

        LocalDate dueDate = borrow.getDueDate() != null ? borrow.getDueDate() : borrowDate.plusDays(borrowDays);
        borrow.setDueDate(dueDate);

        // Update book availability (decrement available copies)
        book.setAvailableCopies(available - 1);
        book.setStatus(book.getAvailableCopies() != null && book.getAvailableCopies() > 0 ? "Available" : "Borrowed");
        bookRepository.save(book);

        return borrowRepository.save(borrow);
    }

    public Optional<Borrow> updateBorrow(Long id, Borrow borrowDetails) {
        return borrowRepository.findById(id).map(borrow -> {
            borrow.setDueDate(borrowDetails.getDueDate());
            borrow.setBorrowDays(borrowDetails.getBorrowDays());
            borrow.setFineAmount(borrowDetails.getFineAmount());
            return borrowRepository.save(borrow);
        });
    }

    public Borrow returnBook(Long borrowId) {
        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if (borrow.getReturnDate() != null) {
            throw new RuntimeException("Book already returned");
        }

        borrow.setReturnDate(LocalDate.now());
        borrow.setStatus("RETURNED");

        // Make the book available again
        Book book = borrow.getBook();
        if (book != null) {
            Integer total = book.getTotalCopies() == null ? 1 : Math.max(1, book.getTotalCopies());
            Integer available = book.getAvailableCopies() == null ? 0 : Math.max(0, book.getAvailableCopies());
            Integer nextAvail = available + 1;
            if (nextAvail > total) {
                nextAvail = total;
            }
            book.setTotalCopies(total);
            book.setAvailableCopies(nextAvail);
            book.setStatus(nextAvail > 0 ? "Available" : "Borrowed");
            bookRepository.save(book);
        }

        // Calculate fine if overdue
        if (LocalDate.now().isAfter(borrow.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(borrow.getDueDate(), LocalDate.now());
            double dailyRate = 20.0;
            double fineAmount = overdueDays * dailyRate;
            borrow.setFineAmount(fineAmount);
            borrow.setStatus("RETURNED_WITH_FINE");

            Fine fine = new Fine();
            fine.setBorrow(borrow);
            fine.setMember(borrow.getMember());
            fine.setAmount(fineAmount);
            fine.setFineDate(LocalDate.now());
            fine.setStatus("PENDING");
            fine.setDailyRate(dailyRate);
            fine.setOverdueDays((int) Math.max(1, overdueDays));
            fine.setReason("Overdue return");
            fineRepository.save(fine);
        }

        return borrowRepository.save(borrow);
    }

    public boolean deleteBorrow(Long id) {
        return borrowRepository.findById(id).map(borrow -> {
            borrowRepository.delete(borrow);
            return true;
        }).orElse(false);
    }

    public List<Borrow> getActiveBorrows() {
        return borrowRepository.findActiveBorrows();
    }

    public List<Borrow> getOverdueBorrows() {
        return borrowRepository.findOverdueBorrows();
    }

    public List<Borrow> getMemberBorrows(Long memberId) {
        return borrowRepository.findBorrowsByMember(memberId);
    }

    public List<Borrow> getBookBorrows(Long bookId) {
        return borrowRepository.findBorrowsByBook(bookId);
    }

    public boolean canMemberBorrow(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!"ACTIVE".equals(member.getStatus())) {
            return false;
        }

        Long activeCount = borrowRepository.countActiveBorrowsByMember(memberId);
        return activeCount < 5;
    }

    public List<Borrow> getBorrowsByStatus(String status) {
        return borrowRepository.findByStatus(status);
    }
}
