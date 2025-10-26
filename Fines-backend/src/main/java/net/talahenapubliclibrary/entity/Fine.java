package net.talahenapubliclibrary.entity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Fines")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fine_id")
    private Long fineId;

    @Column(name = "issue_id", nullable = false)
    private Long issueId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "status", columnDefinition = "VARCHAR(20)")
    private String status; // "Paid" or "Unpaid" - using String for simplicity

    @Column(name = "generated_date")
    private LocalDate generatedDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;
}
