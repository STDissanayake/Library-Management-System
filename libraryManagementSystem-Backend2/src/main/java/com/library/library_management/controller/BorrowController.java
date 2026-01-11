package com.library.library_management.controller;

import com.library.library_management.dto.BorrowDTO;
import com.library.library_management.dto.BookDTO;
import com.library.library_management.dto.MemberDTO;
import com.library.library_management.model.Borrow;
import com.library.library_management.service.BorrowService;
import com.library.library_management.mapper.BookMapper;
import com.library.library_management.mapper.MemberMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/borrows")
@CrossOrigin(origins = "http://localhost:3000")
public class BorrowController {

    private final BorrowService borrowService;
    private final BookMapper bookMapper;
    private final MemberMapper memberMapper;

    public BorrowController(BorrowService borrowService, BookMapper bookMapper, MemberMapper memberMapper) {
        this.borrowService = borrowService;
        this.bookMapper = bookMapper;
        this.memberMapper = memberMapper;
    }

    @GetMapping
    public ResponseEntity<List<BorrowDTO>> getAllBorrows() {
        List<Borrow> borrows = borrowService.getAllBorrows();
        List<BorrowDTO> borrowDTOs = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(borrowDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowDTO> getBorrowById(@PathVariable Long id) {
        Optional<Borrow> borrow = borrowService.getBorrowById(id);
        return borrow.map(b -> ResponseEntity.ok(convertToDTO(b)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BorrowDTO> createBorrow(@RequestBody BorrowDTO borrowDTO) {
        Borrow borrow = convertToEntity(borrowDTO);
        Borrow savedBorrow = borrowService.createBorrow(borrow);
        return ResponseEntity.ok(convertToDTO(savedBorrow));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowDTO> updateBorrow(@PathVariable Long id, @RequestBody BorrowDTO borrowDTO) {
        Borrow borrow = convertToEntity(borrowDTO);
        Optional<Borrow> updatedBorrow = borrowService.updateBorrow(id, borrow);
        return updatedBorrow.map(b -> ResponseEntity.ok(convertToDTO(b)))
                             .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrow(@PathVariable Long id) {
        if (borrowService.deleteBorrow(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/return/{borrowId}")
    public ResponseEntity<BorrowDTO> returnBook(@PathVariable Long borrowId) {
        Borrow returnedBorrow = borrowService.returnBook(borrowId);
        return ResponseEntity.ok(convertToDTO(returnedBorrow));
    }

    @GetMapping("/active")
    public ResponseEntity<List<BorrowDTO>> getActiveBorrows() {
        List<Borrow> borrows = borrowService.getActiveBorrows();
        List<BorrowDTO> borrowDTOs = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(borrowDTOs);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowDTO>> getOverdueBorrows() {
        List<Borrow> borrows = borrowService.getOverdueBorrows();
        List<BorrowDTO> borrowDTOs = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(borrowDTOs);
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<BorrowDTO>> getMemberBorrows(@PathVariable Long memberId) {
        List<Borrow> borrows = borrowService.getMemberBorrows(memberId);
        List<BorrowDTO> borrowDTOs = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(borrowDTOs);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BorrowDTO>> getBookBorrows(@PathVariable Long bookId) {
        List<Borrow> borrows = borrowService.getBookBorrows(bookId);
        List<BorrowDTO> borrowDTOs = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(borrowDTOs);
    }

    @GetMapping("/canBorrow/{memberId}")
    public ResponseEntity<Boolean> canMemberBorrow(@PathVariable Long memberId) {
        boolean canBorrow = borrowService.canMemberBorrow(memberId);
        return ResponseEntity.ok(canBorrow);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BorrowDTO>> getBorrowsByStatus(@PathVariable String status) {
        List<Borrow> borrows = borrowService.getBorrowsByStatus(status);
        List<BorrowDTO> borrowDTOs = borrows.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(borrowDTOs);
    }

    private BorrowDTO convertToDTO(Borrow borrow) {
        BorrowDTO dto = new BorrowDTO();
        dto.setId(borrow.getId());
        dto.setBorrowDate(borrow.getBorrowDate());
        dto.setDueDate(borrow.getDueDate());
        dto.setReturnDate(borrow.getReturnDate());
        dto.setStatus(borrow.getStatus());
        dto.setBorrowDays(borrow.getBorrowDays());
        dto.setFineAmount(borrow.getFineAmount());
        
        if (borrow.getBook() != null) {
            dto.setBook(bookMapper.toDTO(borrow.getBook()));
        }
        
        if (borrow.getMember() != null) {
            dto.setMember(convertMemberToDTO(borrow.getMember()));
        }
        
        return dto;
    }

    private Borrow convertToEntity(BorrowDTO dto) {
        Borrow borrow = new Borrow();
        borrow.setId(dto.getId());
        borrow.setBorrowDate(dto.getBorrowDate());
        borrow.setDueDate(dto.getDueDate());
        borrow.setReturnDate(dto.getReturnDate());
        borrow.setStatus(dto.getStatus());
        borrow.setBorrowDays(dto.getBorrowDays());
        borrow.setFineAmount(dto.getFineAmount());
        
        if (dto.getBook() != null) {
            borrow.setBook(bookMapper.toEntity(dto.getBook()));
        }
        
        if (dto.getMember() != null) {
            borrow.setMember(convertMemberToEntity(dto.getMember()));
        }
        
        return borrow;
    }

    private MemberDTO convertMemberToDTO(com.library.library_management.model.Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setEmail(member.getEmail());
        dto.setPhone(member.getPhone());
        dto.setAddress(member.getAddress());
        dto.setStatus(member.getStatus());
        return dto;
    }

    private com.library.library_management.model.Member convertMemberToEntity(MemberDTO dto) {
        com.library.library_management.model.Member member = new com.library.library_management.model.Member();
        member.setId(dto.getId());
        member.setFirstName(dto.getFirstName());
        member.setLastName(dto.getLastName());
        member.setEmail(dto.getEmail());
        member.setPhone(dto.getPhone());
        member.setAddress(dto.getAddress());
        member.setStatus(dto.getStatus());
        return member;
    }
}
