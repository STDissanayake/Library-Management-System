package com.library_management_system.Library.Management.System.repo;

import com.library_management_system.Library.Management.System.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRepo extends JpaRepository<Borrow, Integer> {

    List<Borrow> findByMember_IdAndStatus(Long memberId, String status);
    List<Borrow> findByReturnDateIsNull();

    @Query("SELECT b FROM Borrow b WHERE b.dueDate < :currentDate AND b.returnDate IS NULL")
    List<Borrow> findOverdueBooks(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT b FROM Borrow b WHERE b.member.id = :memberId AND b.book.id = :bookId AND b.returnDate IS NULL")
    Optional<Borrow> findActiveMemberBookBorrow(@Param("memberId") Long memberId, @Param("bookId") int bookId);

    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.member.id = :memberId AND b.returnDate IS NULL")
    int countActiveBorrowsByMemberId(@Param("memberId") Long memberId);

    List<Borrow> findByMember_Id(Long memberId);
}