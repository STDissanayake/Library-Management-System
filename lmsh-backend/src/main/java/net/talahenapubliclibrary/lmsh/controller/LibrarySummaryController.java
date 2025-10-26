package net.talahenapubliclibrary.lmsh.controller;
import net.talahenapubliclibrary.lmsh.dto.LibrarySummaryDto;
import net.talahenapubliclibrary.lmsh.service.LibrarySummaryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "http://localhost:3306")
public class LibrarySummaryController {

    private final LibrarySummaryService service;

    public LibrarySummaryController(LibrarySummaryService service) {
        this.service = service;
    }

    @GetMapping
    public LibrarySummaryDto getSummary() {
        return service.getSummary();
    }
}
