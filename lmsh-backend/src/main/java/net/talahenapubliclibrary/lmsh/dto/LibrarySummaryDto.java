package net.talahenapubliclibrary.lmsh.dto;

//public class LibrarySummaryDto {
//}
//package net.talahenapubliclibrary.lmsf_backend.dto;

import lombok.Data;

@Data
public class LibrarySummaryDto {
    private Long totalMembers;
    private Long totalBooks;
    private Long totalIssued;
    private Long totalReturned;
    private Long totalBorrowed;
    private Double totalFines;
}
