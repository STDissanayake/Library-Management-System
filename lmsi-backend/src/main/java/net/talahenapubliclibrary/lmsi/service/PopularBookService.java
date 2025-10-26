package net.talahenapubliclibrary.lmsi.service;
import net.talahenapubliclibrary.lmsi.dto.PopularBookDto;
import java.util.List;

public interface PopularBookService {
    List<PopularBookDto> getTopPopularBooks();
}
