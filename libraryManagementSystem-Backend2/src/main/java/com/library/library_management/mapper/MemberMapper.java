package com.library.library_management.mapper;

import com.library.library_management.dto.MemberDTO;
import com.library.library_management.model.Member;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {

    // Convert Member entity to MemberDTO
    public MemberDTO toDTO(Member member) {
        if (member == null) {
            return null;
        }

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

    // Convert MemberDTO to Member entity
    public Member toEntity(MemberDTO dto) {
        if (dto == null) {
            return null;
        }

        Member member = new Member();
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