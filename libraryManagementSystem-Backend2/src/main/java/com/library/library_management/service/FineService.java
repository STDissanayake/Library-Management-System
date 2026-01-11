package com.library.library_management.service;

import com.library.library_management.model.Borrow;
import com.library.library_management.model.Fine;
import com.library.library_management.repository.BorrowRepository;
import com.library.library_management.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class FineService {

    private final FineRepository fineRepository;
    private final BorrowRepository borrowRepository;

    @Autowired
    public FineService(FineRepository fineRepository, BorrowRepository borrowRepository) {
        this.fineRepository = fineRepository;
        this.borrowRepository = borrowRepository;
    }

    private static final double DAILY_RATE_RS = 20.0;

    private void normalizePendingFines() {
        List<Fine> pendingFines = fineRepository.findByStatusWithDetails("PENDING");
        LocalDate today = LocalDate.now();

        Map<Long, Fine> pendingByBorrowId = new HashMap<>();

        for (Fine fine : pendingFines) {
            if (fine == null) continue;
            Borrow borrow = fine.getBorrow();
            if (borrow == null || borrow.getId() == null) continue;

            Long borrowId = borrow.getId();
            Fine existing = pendingByBorrowId.get(borrowId);
            if (existing == null) {
                pendingByBorrowId.put(borrowId, fine);
            } else {
                // Keep the lowest id for determinism; delete the other.
                if (existing.getId() != null && fine.getId() != null && fine.getId() < existing.getId()) {
                    fineRepository.delete(existing);
                    pendingByBorrowId.put(borrowId, fine);
                } else {
                    fineRepository.delete(fine);
                }
                continue;
            }

            if (borrow.getDueDate() == null) continue;
            LocalDate end = borrow.getReturnDate() != null ? borrow.getReturnDate() : today;
            long overdueDaysLong = ChronoUnit.DAYS.between(borrow.getDueDate(), end);
            int overdueDays = (int) Math.max(1, overdueDaysLong);

            fine.setDailyRate(DAILY_RATE_RS);
            fine.setOverdueDays(overdueDays);
            fine.setAmount(overdueDays * DAILY_RATE_RS);
            if (fine.getFineDate() == null) {
                fine.setFineDate(today);
            }
            fineRepository.save(fine);
        }

        fineRepository.flush();
    }

    private void syncOverdueFines() {
        List<Borrow> overdueBorrows = borrowRepository.findOverdueBorrows();
        LocalDate today = LocalDate.now();

        for (Borrow borrow : overdueBorrows) {
            if (borrow == null) continue;
            if (borrow.getReturnDate() != null) continue;
            if (borrow.getDueDate() == null) continue;

            long overdueDaysLong = ChronoUnit.DAYS.between(borrow.getDueDate(), today);
            int overdueDays = (int) Math.max(1, overdueDaysLong);
            double amount = overdueDays * DAILY_RATE_RS;

            List<Fine> existingFines = fineRepository.findByBorrowId(borrow.getId());
            Fine pending = null;
            for (Fine f : existingFines) {
                if (f == null) continue;
                String status = (f.getStatus() == null ? "" : f.getStatus()).toUpperCase();
                if ("PENDING".equals(status)) {
                    if (pending == null) {
                        pending = f;
                    } else {
                        // duplicate pending fine for same borrow; remove it
                        fineRepository.delete(f);
                    }
                }
            }

            if (pending == null) {
                Fine fine = new Fine();
                fine.setBorrow(borrow);
                fine.setMember(borrow.getMember());
                fine.setAmount(amount);
                fine.setFineDate(today);
                fine.setStatus("PENDING");
                fine.setOverdueDays(overdueDays);
                fine.setDailyRate(DAILY_RATE_RS);
                fine.setReason("Overdue borrow");
                fineRepository.save(fine);
            } else {
                pending.setAmount(amount);
                pending.setFineDate(today);
                pending.setOverdueDays(overdueDays);
                pending.setDailyRate(DAILY_RATE_RS);
                fineRepository.save(pending);
            }
        }

        fineRepository.flush();
    }

    // Create a fine for an overdue book
    public Fine createFine(Fine fine) {
        return fineRepository.save(fine);
    }

    // Get all fines
    public List<Fine> getAllFines() {
        syncOverdueFines();
        normalizePendingFines();
        return fineRepository.findAllWithDetails();
    }

    // Get fines by member
    public List<Fine> getFinesByMember(Long memberId) {
        syncOverdueFines();
        normalizePendingFines();
        return fineRepository.findByMemberIdWithDetails(memberId);
    }

    // Get unpaid fines
    public List<Fine> getUnpaidFines() {
        syncOverdueFines();
        normalizePendingFines();
        return fineRepository.findByStatusWithDetails("PENDING");
    }

    // Get paid fines
    public List<Fine> getPaidFines() {
        return fineRepository.findByStatusWithDetails("PAID");
    }

    // Pay a fine
    public Fine payFine(Long fineId) {
        Optional<Fine> fineOpt = fineRepository.findById(fineId);
        if (fineOpt.isPresent()) {
            Fine fine = fineOpt.get();
            fine.setStatus("PAID");
            fine.setPaymentDate(LocalDate.now());
            return fineRepository.save(fine);
        }
        return null;
    }

    // Waive a fine
    public Fine waiveFine(Long fineId) {
        Optional<Fine> fineOpt = fineRepository.findById(fineId);
        if (fineOpt.isPresent()) {
            Fine fine = fineOpt.get();
            fine.setStatus("WAIVED");
            return fineRepository.save(fine);
        }
        return null;
    }

    // Get total fine amount
    public Double getTotalFineAmount() {
        return 0.0; // Simplified for now
    }

    // Get fine statistics
    public Object getFineStatistics() {
        syncOverdueFines();
        normalizePendingFines();
        List<Fine> all = fineRepository.findAll();
        double totalAmount = all.stream()
                .map(Fine::getAmount)
                .filter(a -> a != null)
                .mapToDouble(Double::doubleValue)
                .sum();
        return java.util.Map.of(
            "totalFines", fineRepository.count(),
            "pendingFines", fineRepository.findByStatus("PENDING").size(),
            "paidFines", fineRepository.findByStatus("PAID").size(),
            "waivedFines", fineRepository.findByStatus("WAIVED").size(),
            "totalAmount", totalAmount
        );
    }
}
