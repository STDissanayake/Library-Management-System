package com.library.library_management.mapper;

import com.library.library_management.dto.MemberDTO;
import com.library.library_management.model.Member;

public class MemberMapper {

    // Convert Member entity to MemberDTO
    public static MemberDTO toDTO(Member member) {
        if (member == null) {
            return null;
        }

        MemberDTO dto = new MemberDTO();
        dto.setMemberId(member.getMemberId());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setEmail(member.getEmail());
        dto.setPhone(member.getPhone());
        dto.setAddress(member.getAddress());

        return dto;
    }

    // Convert MemberDTO to Member entity (optional, but useful)
    public static Member toEntity(MemberDTO dto) {
        if (dto == null) {
            return null;
        }

        Member member = new Member();
        member.setMemberId(dto.getMemberId());
        member.setFirstName(dto.getFirstName());
        member.setLastName(dto.getLastName());
        member.setEmail(dto.getEmail());
        member.setPhone(dto.getPhone());
        member.setAddress(dto.getAddress());

        return member;
    }
}