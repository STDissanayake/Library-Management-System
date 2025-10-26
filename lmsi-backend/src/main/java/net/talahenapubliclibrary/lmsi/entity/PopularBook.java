package net.talahenapubliclibrary.lmsi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Popular_Book")
@Data
public class PopularBook {

    @Id
    @Column(name = "book_id")
    private Long bookId;

    private String title;
    private Long borrowCount;
}
