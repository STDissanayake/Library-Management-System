package net.talahenapubliclibrary.lmsi.service.serviceimpl;
import lombok.RequiredArgsConstructor;
import net.talahenapubliclibrary.lmsi.dto.PopularBookDto;
import net.talahenapubliclibrary.lmsi.mapper.PopularBookMapper;
import net.talahenapubliclibrary.lmsi.repository.PopularBookRepository;
import net.talahenapubliclibrary.lmsi.service.PopularBookService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopularBookServiceImpl implements PopularBookService {

    private final PopularBookRepository repo;
    private final PopularBookMapper mapper;

    @Override
    public List<PopularBookDto> getTopPopularBooks() {
        return repo.findAll().stream()
                .sorted((a,b) -> b.getBorrowCount().compareTo(a.getBorrowCount()))
                .limit(5)
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}
