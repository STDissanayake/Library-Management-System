package lk.library.library_management_system.books.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import lk.library.library_management_system.books.entities.Books;
import lk.library.library_management_system.books.service.Booksservice;
import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private Booksservice bookService;

    @GetMapping("/")
    public String home(Model model) {
        List<Books> books = bookService.getAllBooksForView();
        model.addAttribute("pageTitle", "Library Management System");
        model.addAttribute("books", books);
        model.addAttribute("totalBooks", books.size());
        return "books";
    }

    @GetMapping("/books")
    public String books(Model model) {
        List<Books> books = bookService.getAllBooksForView();
        model.addAttribute("pageTitle", "Library Books");
        model.addAttribute("books", books);
        model.addAttribute("totalBooks", books.size());
        return "books";
    }
}