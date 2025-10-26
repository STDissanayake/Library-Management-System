package net.talahenapubliclibrary.lmsi.dto;
import lombok.Data;

@Data
public class PopularBookDto {
    private Long bookId;
    private String title;
    private Long borrowCount;
}
