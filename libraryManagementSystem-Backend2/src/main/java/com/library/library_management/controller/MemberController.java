package com.library.library_management.controller;

import com.library.library_management.dto.MemberDTO;
import com.library.library_management.mapper.MemberMapper;
import com.library.library_management.model.Member;
import com.library.library_management.repository.MemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // GET all - Allow both ADMIN and STAFF
    @GetMapping
    public List<MemberDTO> getAllMembers(
            @RequestHeader(value = "X-Role", required = false) String roleHeader) {

        if (roleHeader != null &&
                (roleHeader.equalsIgnoreCase("ADMIN") || roleHeader.equalsIgnoreCase("STAFF"))) {
            return memberRepository.findAll().stream()
                    .map(MemberMapper::toDTO)
                    .toList();
        }

        return new ArrayList<>();
    }

    // GET by ID - Allow both ADMIN and STAFF
    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(
            @PathVariable Long id,
            @RequestHeader(value = "X-Role", required = false) String roleHeader) {

        if (roleHeader == null ||
                !(roleHeader.equalsIgnoreCase("ADMIN") || roleHeader.equalsIgnoreCase("STAFF"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Member> member = memberRepository.findById(id);
        return member.map(MemberMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // CREATE (POST) - Only ADMIN can create
    @PostMapping
    public ResponseEntity<MemberDTO> createMember(
            @RequestBody Member member,
            @RequestHeader(value = "X-Role", required = false) String roleHeader) {

        // ✅ Only ADMIN can add new members
        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Member saved = memberRepository.save(member);
        return ResponseEntity.ok(MemberMapper.toDTO(saved));
    }

    // UPDATE (PUT) - Only ADMIN can update
    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(
            @PathVariable Long id,
            @RequestBody Member memberDetails,
            @RequestHeader(value = "X-Role", required = false) String roleHeader) {

        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return memberRepository.findById(id)
                .map(member -> {
                    member.setFirstName(memberDetails.getFirstName());
                    member.setLastName(memberDetails.getLastName());
                    member.setEmail(memberDetails.getEmail());
                    member.setPhone(memberDetails.getPhone());
                    member.setAddress(memberDetails.getAddress());
                    Member updated = memberRepository.save(member);
                    return ResponseEntity.ok(MemberMapper.toDTO(updated));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE - Only ADMIN can delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(
            @PathVariable Long id,
            @RequestHeader(value = "X-Role", required = false) String roleHeader) {

        if (roleHeader == null || !roleHeader.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return memberRepository.findById(id)
                .map(member -> {
                    memberRepository.delete(member);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}