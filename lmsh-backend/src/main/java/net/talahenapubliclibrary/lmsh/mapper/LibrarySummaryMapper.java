package net.talahenapubliclibrary.lmsh.mapper;

//public class LibrarySummaryMapper {
//}
//package net.talahenapubliclibrary.lmsf_backend.mapper;

import net.talahenapubliclibrary.lmsh.dto.LibrarySummaryDto;
import net.talahenapubliclibrary.lmsh.entity.LibrarySummary;

public class LibrarySummaryMapper {

    public static LibrarySummaryDto mapToDto(LibrarySummary summary) {
        LibrarySummaryDto dto = new LibrarySummaryDto();
        dto.setTotalMembers(summary.getTotalMembers());
        dto.setTotalBooks(summary.getTotalBooks());
        dto.setTotalIssued(summary.getTotalIssued());
        dto.setTotalReturned(summary.getTotalReturned());
        dto.setTotalBorrowed(summary.getTotalBorrowed());
        dto.setTotalFines(summary.getTotalFines());
        return dto;
    }
}
