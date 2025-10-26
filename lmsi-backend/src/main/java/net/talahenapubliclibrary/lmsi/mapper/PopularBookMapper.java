package net.talahenapubliclibrary.lmsi.mapper;
import net.talahenapubliclibrary.lmsi.dto.PopularBookDto;
import net.talahenapubliclibrary.lmsi.entity.PopularBook;
import org.springframework.stereotype.Component;

@Component
public class PopularBookMapper {

    public PopularBookDto toDto(PopularBook entity) {
        PopularBookDto dto = new PopularBookDto();
        dto.setBookId(entity.getBookId());
        dto.setTitle(entity.getTitle());
        dto.setBorrowCount(entity.getBorrowCount());
        return dto;
    }
}
