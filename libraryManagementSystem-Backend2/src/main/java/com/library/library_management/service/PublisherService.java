package com.library.library_management.service;

import com.library.library_management.model.Publisher;
import com.library.library_management.repository.PublisherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PublisherService {

    private final PublisherRepository publisherRepository;

    public PublisherService(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    public List<Publisher> getAllPublishers() {
        return publisherRepository.findAll();
    }

    public Optional<Publisher> getPublisherById(Long id) {
        return publisherRepository.findById(id);
    }

    public Publisher createPublisher(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    public Optional<Publisher> updatePublisher(Long id, Publisher publisherDetails) {
        return publisherRepository.findById(id).map(publisher -> {
            publisher.setName(publisherDetails.getName());
            publisher.setAddress(publisherDetails.getAddress());
            publisher.setContactInfo(publisherDetails.getContactInfo());
            return publisherRepository.save(publisher);
        });
    }

    public boolean deletePublisher(Long id) {
        return publisherRepository.findById(id).map(publisher -> {
            publisherRepository.delete(publisher);
            return true;
        }).orElse(false);
    }

    public List<Publisher> searchPublishers(String query) {
        return publisherRepository.searchPublishers(query);
    }

    public Long getPublishersCount() {
        return publisherRepository.countTotalPublishers();
    }
}
