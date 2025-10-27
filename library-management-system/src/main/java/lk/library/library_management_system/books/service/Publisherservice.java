package lk.library.library_management_system.books.service;

import lk.library.library_management_system.books.dto.PublisherDTO.Publisherresponsedto;
import lk.library.library_management_system.books.dto.PublisherDTO.Publishersavedto;
import lk.library.library_management_system.books.dto.PublisherDTO.Publisherupdatedto;
import lk.library.library_management_system.books.entities.Publisher;
import lk.library.library_management_system.books.exception.PublisherNotFoundException;
import lk.library.library_management_system.books.repository.Publisherrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class Publisherservice {

    @Autowired
    private Publisherrepo publisherRepository;

    @Transactional(readOnly = true)
    public List<Publisherresponsedto> getAllPublishers() {
        return publisherRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Publisherresponsedto getPublisherById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new PublisherNotFoundException("Publisher not found with id: " + id));
        return convertToResponseDTO(publisher);
    }

    @Transactional
    public Publisherresponsedto createPublisher(Publishersavedto publisherSaveDTO) {
        Publisher publisher = new Publisher();
        publisher.setName(publisherSaveDTO.getName());
        publisher.setPublishedYear(publisherSaveDTO.getPublishedYear());

        Publisher savedPublisher = publisherRepository.save(publisher);
        return convertToResponseDTO(savedPublisher);
    }

    @Transactional
    public Publisherresponsedto updatePublisher(Long id, Publisherupdatedto publisherUpdateDTO) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new PublisherNotFoundException("Publisher not found with id: " + id));

        publisher.setName(publisherUpdateDTO.getName());
        publisher.setPublishedYear(publisherUpdateDTO.getPublishedYear());

        Publisher updatedPublisher = publisherRepository.save(publisher);
        return convertToResponseDTO(updatedPublisher);
    }

    @Transactional
    public void deletePublisher(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new PublisherNotFoundException("Publisher not found with id: " + id));
        publisherRepository.delete(publisher);
    }

    @Transactional(readOnly = true)
    public Long getPublishersCount() {
        return publisherRepository.count();
    }

    private Publisherresponsedto convertToResponseDTO(Publisher publisher) {
        Publisherresponsedto dto = new Publisherresponsedto();
        dto.setPublisherID(publisher.getPublisherID());
        dto.setName(publisher.getName());
        dto.setPublishedYear(publisher.getPublishedYear());
        return dto;
    }
}