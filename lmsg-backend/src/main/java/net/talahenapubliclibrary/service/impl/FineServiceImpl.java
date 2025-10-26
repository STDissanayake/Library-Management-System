package net.talahenapubliclibrary.service.impl;
import lombok.AllArgsConstructor;
import net.talahenapubliclibrary.dto.FineDto;
import net.talahenapubliclibrary.entity.Fine;
import net.talahenapubliclibrary.exception.ResourceNotFoundException;
import net.talahenapubliclibrary.mapper.FineMapper;
import net.talahenapubliclibrary.repository.FineRepository;
import net.talahenapubliclibrary.service.FineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;

    @Override
    public FineDto createFine(FineDto dto) {
        Fine fine = FineMapper.toEntity(dto);
        Fine saved = fineRepository.save(fine);
        return FineMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FineDto getFineById(Long id) {
        Fine f = fineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found with id: " + id));
        return FineMapper.toDto(f);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineDto> getAllFines() {
        return fineRepository.findAll().stream().map(FineMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public FineDto updateFine(Long id, FineDto dto) {
        Fine existing = fineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found with id: " + id));

        // overwrite fields
        existing.setIssueId(dto.getIssueId());
        existing.setAmount(dto.getAmount());
        existing.setReason(dto.getReason());
        existing.setStatus(dto.getStatus());
        existing.setGeneratedDate(dto.getGeneratedDate());
        existing.setPaymentDate(dto.getPaymentDate());

        Fine updated = fineRepository.save(existing);
        return FineMapper.toDto(updated);
    }

    @Override
    public void deleteFine(Long id) {
        Fine existing = fineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found with id: " + id));
        fineRepository.delete(existing);
    }
}
