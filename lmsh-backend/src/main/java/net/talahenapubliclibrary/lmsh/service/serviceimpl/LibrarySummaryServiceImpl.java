package net.talahenapubliclibrary.lmsh.service.serviceimpl;

//public class LibrarySummaryServiceImpl {
//}
//package net.talahenapubliclibrary.lmsh_backend.service.impl;

import net.talahenapubliclibrary.lmsh.dto.LibrarySummaryDto;
import net.talahenapubliclibrary.lmsh.mapper.LibrarySummaryMapper;
import net.talahenapubliclibrary.lmsh.repository.LibrarySummaryRepository;
import net.talahenapubliclibrary.lmsh.service.LibrarySummaryService;
import org.springframework.stereotype.Service;

@Service
public class LibrarySummaryServiceImpl implements LibrarySummaryService {

    private final LibrarySummaryRepository repository;

    public LibrarySummaryServiceImpl(LibrarySummaryRepository repository) {
        this.repository = repository;
    }

    @Override
    public LibrarySummaryDto getSummary() {
        return repository.findAll().stream()
                .findFirst()
                .map(LibrarySummaryMapper::mapToDto)
                .orElse(new LibrarySummaryDto());
    }
}
