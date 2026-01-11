package com.library.library_management.controller;

import com.library.library_management.dto.MemberDTO;
import com.library.library_management.model.Member;
import com.library.library_management.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        List<MemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        Optional<Member> member = memberService.getMemberById(id);
        return member.map(m -> ResponseEntity.ok(convertToDTO(m)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@RequestBody MemberDTO memberDTO) {
        Member member = convertToEntity(memberDTO);
        Member savedMember = memberService.createMember(member);
        return ResponseEntity.ok(convertToDTO(savedMember));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @RequestBody MemberDTO memberDTO) {
        Member member = convertToEntity(memberDTO);
        Optional<Member> updatedMember = memberService.updateMember(id, member);
        return updatedMember.map(m -> ResponseEntity.ok(convertToDTO(m)))
                             .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (memberService.deleteMember(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<MemberDTO>> searchMembers(@RequestParam String query) {
        List<Member> members = memberService.searchMembers(query);
        List<MemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MemberDTO>> getMembersByStatus(@PathVariable String status) {
        List<Member> members = memberService.getMembersByStatus(status);
        List<MemberDTO> memberDTOs = members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalMembersCount() {
        Long count = memberService.getTotalMembersCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/{status}")
    public ResponseEntity<Long> getMembersCountByStatus(@PathVariable String status) {
        Long count = memberService.getMembersCountByStatus(status);
        return ResponseEntity.ok(count);
    }

    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setEmail(member.getEmail());
        dto.setPhone(member.getPhone());
        dto.setAddress(member.getAddress());
        dto.setStatus(member.getStatus());
        dto.setRegistrationDate(member.getRegistrationDate() != null ? member.getRegistrationDate().toString() : null);
        return dto;
    }

    private Member convertToEntity(MemberDTO dto) {
        Member member = new Member();
        member.setId(dto.getId());
        member.setFirstName(dto.getFirstName());
        member.setLastName(dto.getLastName());
        member.setEmail(dto.getEmail());
        member.setPhone(dto.getPhone());
        member.setAddress(dto.getAddress());
        member.setStatus(dto.getStatus());
        if (dto.getRegistrationDate() != null && !dto.getRegistrationDate().isEmpty()) {
            try {
                member.setRegistrationDate(LocalDateTime.parse(dto.getRegistrationDate()));
            } catch (Exception ignored) {
                // keep null; will be set by @PrePersist
            }
        }
        return member;
    }
}