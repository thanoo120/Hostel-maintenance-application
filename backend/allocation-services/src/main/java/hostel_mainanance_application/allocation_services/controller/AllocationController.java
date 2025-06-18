package hostel_mainanance_application.allocation_services.controller;


import hostel_mainanance_application.allocation_services.dto.AllocationDTO;
import hostel_mainanance_application.allocation_services.dto.request.AllocationRequestDTO;
import hostel_mainanance_application.allocation_services.services.AllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
public class AllocationController {

    private final AllocationService allocationService;

    @PostMapping
    public ResponseEntity<AllocationDTO> allocateRoom( @RequestBody AllocationRequestDTO requestDTO) {
        return new ResponseEntity<>(allocationService.allocateRoom(requestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/deallocate")
    public ResponseEntity<AllocationDTO> deallocateRoom(@PathVariable Long id, @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(allocationService.deallocateRoom(id, remarks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AllocationDTO> getAllocationById(@PathVariable Long id) {
        return ResponseEntity.ok(allocationService.getAllocationById(id));
    }

    @GetMapping
    public ResponseEntity<List<AllocationDTO>> getAllAllocations() {
        return ResponseEntity.ok(allocationService.gatAllAllocations());
    }

    @GetMapping("/active")
    public ResponseEntity<List<AllocationDTO>> getAllActiveAllocations() {
        return ResponseEntity.ok(allocationService.getAllActiveAllocations());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AllocationDTO>> getAllocationsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(allocationService.getAllocationByStudentId(studentId));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<AllocationDTO>> getAllocationsByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(allocationService.getAllocationsByHostelId(roomId));
    }

    @GetMapping("/hostel/{hostelId}")
    public ResponseEntity<List<AllocationDTO>> getAllocationsByHostelId(@PathVariable Long hostelId) {
        return ResponseEntity.ok(allocationService.getAllocationsByHostelId(hostelId));
    }
}
