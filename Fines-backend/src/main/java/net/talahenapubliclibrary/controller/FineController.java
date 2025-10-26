package net.talahenapubliclibrary.controller;

import lombok.AllArgsConstructor;
import net.talahenapubliclibrary.dto.FineDto;
import net.talahenapubliclibrary.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = "http://localhost:3306") // adjust front-end origin as needed

@AllArgsConstructor
public class FineController {

    private final FineService fineService;

    // Create
    @PostMapping
    public ResponseEntity<FineDto> createFine(@RequestBody FineDto dto) {
        // NOTE: Add authentication/authorization to allow only STAFF to create fines
        FineDto created = fineService.createFine(dto);
        return ResponseEntity.ok(created);
    }

    // Read single
    @GetMapping("/{id}")
    public ResponseEntity<FineDto> getFine(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.getFineById(id));
    }

    // Read all
    @GetMapping
    public ResponseEntity<List<FineDto>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<FineDto> updateFine(@PathVariable Long id, @RequestBody FineDto dto) {
        // NOTE: restrict to STAFF in real app
        return ResponseEntity.ok(fineService.updateFine(id, dto));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFine(@PathVariable Long id) {
        // NOTE: restrict to STAFF in real app
        fineService.deleteFine(id);
        return ResponseEntity.noContent().build();
    }
}
