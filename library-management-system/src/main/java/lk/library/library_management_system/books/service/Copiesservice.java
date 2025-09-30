package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.entities.Copies;
import lk.library.library_management_system.books.repository.Copiesrepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Copiesservice {

    private final Copiesrepo copiesrepo;

    public Copiesservice(Copiesrepo copiesrepo) {
        this.copiesrepo = copiesrepo;
    }

    // Create a new copy
    public Copies saveCopy(Copies copy) {
        return copiesrepo.save(copy);
    }

    // Get all copies
    public List<Copies> getAllCopies() {
        return copiesrepo.findAll();
    }

    // Get copy by ID
    public Optional<Copies> getCopyById(Long id) {
        return copiesrepo.findById(id);
    }

    public Copies updateCopy(Copies copy) {
        Long id = copy.getId();
        return copiesrepo.findById(id).map(existing -> {
            existing.setBook(copy.getBook());
            existing.setStatus(copy.getStatus());
            existing.setLocation(copy.getLocation());
            return copiesrepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Copy not found with id " + id));
    }


    // Delete copy
    public void deleteCopy(Long id) {
        copiesrepo.deleteById(id);
    }
}
