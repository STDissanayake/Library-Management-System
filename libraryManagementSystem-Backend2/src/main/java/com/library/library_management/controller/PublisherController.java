package com.library.library_management.controller;

import com.library.library_management.model.Publisher;
import com.library.library_management.service.PublisherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/publishers")
@CrossOrigin(origins = "http://localhost:3000")
public class PublisherController {

    private final PublisherService publisherService;

    public PublisherController(PublisherService publisherService) {
        this.publisherService = publisherService;
    }

    @GetMapping
    public ResponseEntity<List<Publisher>> getAllPublishers() {
        List<Publisher> publishers = publisherService.getAllPublishers();
        return ResponseEntity.ok(publishers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publisher> getPublisherById(@PathVariable Long id) {
        Optional<Publisher> publisher = publisherService.getPublisherById(id);
        return publisher.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Publisher> createPublisher(@RequestBody Publisher publisher) {
        Publisher savedPublisher = publisherService.createPublisher(publisher);
        return ResponseEntity.ok(savedPublisher);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publisher> updatePublisher(@PathVariable Long id, @RequestBody Publisher publisher) {
        Optional<Publisher> updatedPublisher = publisherService.updatePublisher(id, publisher);
        return updatedPublisher.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublisher(@PathVariable Long id) {
        if (publisherService.deletePublisher(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Publisher>> searchPublishers(@RequestParam String query) {
        List<Publisher> publishers = publisherService.searchPublishers(query);
        return ResponseEntity.ok(publishers);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getPublishersCount() {
        Long count = publisherService.getPublishersCount();
        return ResponseEntity.ok(count);
    }
}
