package net.talahenapubliclibrary.service;

import net.talahenapubliclibrary.dto.FineDto;

import java.util.List;

public interface FineService {
    FineDto createFine(FineDto dto);
    FineDto getFineById(Long id);
    List<FineDto> getAllFines();
    FineDto updateFine(Long id, FineDto dto);
    void deleteFine(Long id);
}
