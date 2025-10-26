package net.talahenapubliclibrary.dto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FineDto {
    private Long fineId;
    private Long issueId;
    private BigDecimal amount;
    private String reason;
    private String status;
    private LocalDate generatedDate;
    private LocalDate paymentDate;
}
