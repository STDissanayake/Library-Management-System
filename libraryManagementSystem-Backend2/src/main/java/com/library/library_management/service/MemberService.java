package com.library.library_management.service;

import com.library.library_management.model.Member;
import com.library.library_management.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Member createMember(Member member) {
        // Check if email already exists
        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Set default status if not provided
        if (member.getStatus() == null || member.getStatus().isEmpty()) {
            member.setStatus("ACTIVE");
        }
        
        return memberRepository.save(member);
    }

    public Optional<Member> updateMember(Long id, Member memberDetails) {
        return memberRepository.findById(id).map(member -> {
            member.setFirstName(memberDetails.getFirstName());
            member.setLastName(memberDetails.getLastName());
            member.setEmail(memberDetails.getEmail());
            member.setPhone(memberDetails.getPhone());
            member.setAddress(memberDetails.getAddress());
            member.setStatus(memberDetails.getStatus());
            return memberRepository.save(member);
        });
    }

    public boolean deleteMember(Long id) {
        return memberRepository.findById(id).map(member -> {
            memberRepository.delete(member);
            return true;
        }).orElse(false);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public List<Member> searchMembers(String query) {
        return memberRepository.searchMembers(query);
    }

    public List<Member> getMembersByStatus(String status) {
        return memberRepository.findByStatus(status);
    }

    public Long getTotalMembersCount() {
        return memberRepository.countTotalMembers();
    }

    public Long getMembersCountByStatus(String status) {
        return memberRepository.countByStatus(status);
    }
}
