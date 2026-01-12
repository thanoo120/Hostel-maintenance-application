package hostel_mainanance_application.allocation_services.controller;

import hostel_mainanance_application.allocation_services.dto.AllocationDTO;
import hostel_mainanance_application.allocation_services.dto.ApiResponse;
import hostel_mainanance_application.allocation_services.dto.request.AllocationRequestDTO;
import hostel_mainanance_application.allocation_services.services.AllocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Allocation Management", description = "APIs for managing room allocations")
public class AllocationController {

    private final AllocationService allocationService;

    @PostMapping
    @Operation(summary = "Allocate a room to a student", description = "Creates a new room allocation for a student")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Room allocated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data or room not available"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Student or room not found")
    })
    public ResponseEntity<ApiResponse<AllocationDTO>> allocateRoom(@Valid @RequestBody AllocationRequestDTO requestDTO) {
        AllocationDTO allocation = allocationService.allocateRoom(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(allocation, "Room allocated successfully"));
    }

    @PutMapping("/{id}/deallocate")
    @Operation(summary = "Deallocate a room", description = "Deallocates a room from a student")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Room deallocated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation not found")
    })
    public ResponseEntity<ApiResponse<AllocationDTO>> deallocateRoom(
            @Parameter(description = "Allocation ID") @PathVariable Long id,
            @Parameter(description = "Deallocation remarks") @RequestParam(required = false) String remarks) {
        AllocationDTO allocation = allocationService.deallocateRoom(id, remarks);
        return ResponseEntity.ok(ApiResponse.success(allocation, "Room deallocated successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get allocation by ID", description = "Retrieves an allocation by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Allocation found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Allocation not found")
    })
    public ResponseEntity<ApiResponse<AllocationDTO>> getAllocationById(
            @Parameter(description = "Allocation ID") @PathVariable Long id) {
        AllocationDTO allocation = allocationService.getAllocationById(id);
        return ResponseEntity.ok(ApiResponse.success(allocation, "Allocation retrieved successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all allocations", description = "Retrieves all room allocations")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Allocations retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<AllocationDTO>>> getAllAllocations() {
        List<AllocationDTO> allocations = allocationService.gatAllAllocations();
        return ResponseEntity.ok(ApiResponse.success(allocations, "Allocations retrieved successfully"));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active allocations", description = "Retrieves all currently active room allocations")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active allocations retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<AllocationDTO>>> getAllActiveAllocations() {
        List<AllocationDTO> allocations = allocationService.getAllActiveAllocations();
        return ResponseEntity.ok(ApiResponse.success(allocations, "Active allocations retrieved successfully"));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get allocations by student ID", description = "Retrieves all allocations for a specific student")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Student allocations retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<AllocationDTO>>> getAllocationsByStudentId(
            @Parameter(description = "Student ID") @PathVariable String studentId) {
        List<AllocationDTO> allocations = allocationService.getAllocationByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success(allocations, "Student allocations retrieved successfully"));
    }

    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get allocations by room ID", description = "Retrieves all allocations for a specific room")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Room allocations retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<AllocationDTO>>> getAllocationsByRoomId(
            @Parameter(description = "Room ID") @PathVariable Long roomId) {
        List<AllocationDTO> allocations = allocationService.getAllocationsByHostelId(roomId);
        return ResponseEntity.ok(ApiResponse.success(allocations, "Room allocations retrieved successfully"));
    }

    @GetMapping("/hostel/{hostelId}")
    @Operation(summary = "Get allocations by hostel ID", description = "Retrieves all allocations for a specific hostel")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hostel allocations retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<AllocationDTO>>> getAllocationsByHostelId(
            @Parameter(description = "Hostel ID") @PathVariable Long hostelId) {
        List<AllocationDTO> allocations = allocationService.getAllocationsByHostelId(hostelId);
        return ResponseEntity.ok(ApiResponse.success(allocations, "Hostel allocations retrieved successfully"));
    }
}
