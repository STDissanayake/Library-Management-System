package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.entities.Publisher;
import lk.library.library_management_system.books.repository.Publisherrepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Publisherservice {

    private final Publisherrepo publisherRepository;

    public Publisherservice(Publisherrepo publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    // Create
    public Publisher savePublisher(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    // Read all
    public List<Publisher> getAllPublishers() {
        return publisherRepository.findAll();
    }

    // Read by ID
    public Optional<Publisher> getPublisherById(Long id) {
        return publisherRepository.findById(id);
    }

    // Update
    public Publisher updatePublisher(Publisher publisher) {
        Long id = publisher.getId();
        return publisherRepository.findById(id).map(existing -> {
            existing.setName(publisher.getName());
            existing.setAddress(publisher.getAddress());
            return publisherRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Publisher not found with id " + id));
    }

    // Delete
    public void deletePublisher(Long id) {
        publisherRepository.deleteById(id);
    }
}
