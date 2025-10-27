package lk.library.library_management_system.books.controller;

import lk.library.library_management_system.books.dto.PublisherDTO.Publisherresponsedto;
import lk.library.library_management_system.books.dto.PublisherDTO.Publishersavedto;
import lk.library.library_management_system.books.dto.PublisherDTO.Publisherupdatedto;
import lk.library.library_management_system.books.service.Publisherservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/publishers")
public class Publishercon {

    @Autowired
    private Publisherservice publisherService;

    @GetMapping("/count")
    public ResponseEntity<Long> getPublishersCount() {
        Long count = publisherService.getPublishersCount();
        return ResponseEntity.ok(count);
    }

    // TODO: Remove or comment out this endpoint until we fix the repository
    /*
    @GetMapping("/{id}/books/count")
    public ResponseEntity<Long> getBooksCountByPublisher(@PathVariable Long id) {
        Long count = publisherService.getBooksCountByPublisher(id);
        return ResponseEntity.ok(count);
    }
    */

    @Controller
    public class PublisherViewController {

        @GetMapping("/publishers")
        public String showPublishersPage(Model model) {
            model.addAttribute("pageTitle", "Publishers");
            return "publishers"; // This should match your HTML file name
        }
    }

    @GetMapping
    public ResponseEntity<List<Publisherresponsedto>> getAllPublishers() {
        List<Publisherresponsedto> publishers = publisherService.getAllPublishers();
        return ResponseEntity.ok(publishers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publisherresponsedto> getPublisherById(@PathVariable Long id) {
        Publisherresponsedto publisher = publisherService.getPublisherById(id);
        return ResponseEntity.ok(publisher);
    }

    @PostMapping
    public ResponseEntity<Publisherresponsedto> createPublisher(@RequestBody Publishersavedto publisherSaveDTO) {
        Publisherresponsedto createdPublisher = publisherService.createPublisher(publisherSaveDTO);
        return new ResponseEntity<>(createdPublisher, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publisherresponsedto> updatePublisher(@PathVariable Long id, @RequestBody Publisherupdatedto publisherUpdateDTO) {
        Publisherresponsedto updatedPublisher = publisherService.updatePublisher(id, publisherUpdateDTO);
        return ResponseEntity.ok(updatedPublisher);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublisher(@PathVariable Long id) {
        publisherService.deletePublisher(id);
        return ResponseEntity.noContent().build();
    }
}