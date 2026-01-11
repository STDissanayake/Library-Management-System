package com.library.library_management.controller;

import com.library.library_management.model.Fine;
import com.library.library_management.service.FineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = "http://localhost:3000")
public class FineController {

    private final FineService fineService;

    @Autowired
    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    // Get all fines
    @GetMapping
    public ResponseEntity<List<Fine>> getAllFines() {
        List<Fine> fines = fineService.getAllFines();
        return ResponseEntity.ok(fines);
    }

    // Get fines by member
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Fine>> getFinesByMember(@PathVariable Long memberId) {
        List<Fine> fines = fineService.getFinesByMember(memberId);
        return ResponseEntity.ok(fines);
    }

    // Get unpaid fines
    @GetMapping("/unpaid")
    public ResponseEntity<List<Fine>> getUnpaidFines() {
        List<Fine> fines = fineService.getUnpaidFines();
        return ResponseEntity.ok(fines);
    }

    // Get paid fines
    @GetMapping("/paid")
    public ResponseEntity<List<Fine>> getPaidFines() {
        List<Fine> fines = fineService.getPaidFines();
        return ResponseEntity.ok(fines);
    }

    // Create a fine
    @PostMapping
    public ResponseEntity<Fine> createFine(@RequestBody Fine fine) {
        Fine savedFine = fineService.createFine(fine);
        return ResponseEntity.ok(savedFine);
    }

    // Pay a fine
    @PutMapping("/pay/{fineId}")
    public ResponseEntity<Fine> payFine(@PathVariable Long fineId) {
        Fine paidFine = fineService.payFine(fineId);
        return ResponseEntity.ok(paidFine);
    }

    // Waive a fine
    @PutMapping("/waive/{fineId}")
    public ResponseEntity<Fine> waiveFine(@PathVariable Long fineId) {
        Fine waivedFine = fineService.waiveFine(fineId);
        return ResponseEntity.ok(waivedFine);
    }

    // Get fine statistics
    @GetMapping("/statistics")
    public ResponseEntity<Object> getFineStatistics() {
        return ResponseEntity.ok(fineService.getFineStatistics());
    }
}
