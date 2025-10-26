package net.talahenapubliclibrary.lmsi.controller;
import lombok.RequiredArgsConstructor;
import net.talahenapubliclibrary.lmsi.dto.PopularBookDto;
import net.talahenapubliclibrary.lmsi.service.PopularBookService;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/popular-books")
@CrossOrigin(origins = "http://localhost:3306")
@RequiredArgsConstructor
public class PopularBookController {

    private final PopularBookService service;

    @GetMapping
    public List<PopularBookDto> fetchPopularBooks() {
        return service.getTopPopularBooks();
    }
}
