package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.entities.Copies;
import lk.library.library_management_system.books.service.Copiesservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/copies")
public class Copiescon {

    private final Copiesservice copiesService;

    public Copiescon(Copiesservice copiesService) {
        this.copiesService = copiesService;
    }

    @GetMapping
    public List<Copies> getAllCopies() {
        return copiesService.getAllCopies();
    }

    @GetMapping("/{id}")
    public Optional<Copies> getCopyById(@PathVariable Long id) {
        return copiesService.getCopyById(id);
    }

    @PostMapping
    public Copies addCopy(@RequestBody Copies copy) {
        return copiesService.saveCopy(copy);
    }

    @PutMapping("/{id}")
    public Copies updateCopy(@PathVariable Long id, @RequestBody Copies copy) {
        copy.setId(id);
        return copiesService.updateCopy(copy);
    }

    @DeleteMapping("/{id}")
    public void deleteCopy(@PathVariable Long id) {
        copiesService.deleteCopy(id);
    }
}
