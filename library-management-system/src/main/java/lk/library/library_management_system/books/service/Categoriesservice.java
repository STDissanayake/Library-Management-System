package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.entities.Categories;
import lk.library.library_management_system.books.repository.Categoriesrepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Categoriesservice {

    private final Categoriesrepo categoryRepository;

    public Categoriesservice(Categoriesrepo categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Get all categories
    public List<Categories> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Categories> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Get category by name
    public Optional<Categories> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Add new category
    public Categories addCategory(Categories category) {
        return categoryRepository.save(category);
    }

    // Update category
    public Categories updateCategory(Categories category) {
        Long id = category.getId();
        return categoryRepository.findById(id).map(existing -> {
            existing.setName(category.getName());
            existing.setDescription(category.getDescription());
            return categoryRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Category not found with id " + id));
    }

    // Delete category
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
