package net.talahenapubliclibrary.lmsh.entity;

//public class LibrarySummary {
//package net.talahenapubliclibrary.lmsf_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

    @Entity
    @Getter
    @Setter
    @Table(name = "library_summary")
    public class LibrarySummary {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id; // Not used. Just required by JPA

        private Long totalMembers;
        private Long totalBooks;
        private Long totalIssued;
        private Long totalReturned;
        private Long totalBorrowed;
        private Double totalFines;
    }


//}
