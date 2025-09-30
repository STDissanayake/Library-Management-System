package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.entities.Categories;
import lk.library.library_management_system.books.service.Categoriesservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class Categoriescon{

    private final Categoriesservice categoriesService;

    public Categoriescon(Categoriesservice categoriesService) {
        this.categoriesService = categoriesService;
    }

    @GetMapping
    public List<Categories> getAllCategories() {
        return categoriesService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Optional<Categories> getCategoryById(@PathVariable Long id) {
        return categoriesService.getCategoryById(id);
    }

    @PostMapping
    public Categories addCategory(@RequestBody Categories category) {
        return categoriesService.addCategory(category);
    }

    @PutMapping("/{id}")
    public Categories updateCategory(@PathVariable Long id, @RequestBody Categories category) {
        category.setId(id);
        return categoriesService.updateCategory(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoriesService.deleteCategory(id);
    }
}
