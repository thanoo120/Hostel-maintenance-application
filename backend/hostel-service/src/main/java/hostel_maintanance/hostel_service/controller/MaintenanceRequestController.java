package hostel_maintanance.hostel_service.controller;

import hostel_maintanance.hostel_service.dto.ApiResponse;
import hostel_maintanance.hostel_service.dto.MaintenanceRequestDTO;
import hostel_maintanance.hostel_service.service.MaintenanceRequestService;
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
@RequestMapping("/api/maintenance-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Maintenance Request Management", description = "APIs for filing and managing room maintenance requests")
public class MaintenanceRequestController {

    private final MaintenanceRequestService requestService;

    @PostMapping
    @Operation(summary = "File a new maintenance request", description = "Creates a new room maintenance request ticket")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Request filed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<MaintenanceRequestDTO>> createRequest(@Valid @RequestBody MaintenanceRequestDTO requestDto) {
        MaintenanceRequestDTO created = requestService.createRequest(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(created, "Maintenance request filed successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all maintenance requests", description = "Retrieves a list of all filed maintenance tickets")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDTO>>> getAllRequests() {
        List<MaintenanceRequestDTO> requests = requestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.success(requests, "Maintenance requests retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request by ID", description = "Retrieves details of a maintenance request by its ID")
    public ResponseEntity<ApiResponse<MaintenanceRequestDTO>> getRequestById(
            @Parameter(description = "Request ID") @PathVariable Long id) {
        MaintenanceRequestDTO request = requestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.success(request, "Maintenance request retrieved successfully"));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign request to a worker", description = "Assigns the maintenance request to a worker and updates status to ASSIGNED")
    public ResponseEntity<ApiResponse<MaintenanceRequestDTO>> assignWorker(
            @Parameter(description = "Request ID") @PathVariable Long id,
            @Parameter(description = "Worker ID") @RequestParam Long workerId) {
        MaintenanceRequestDTO updated = requestService.assignWorker(id, workerId);
        return ResponseEntity.ok(ApiResponse.success(updated, "Worker assigned successfully"));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Resolve a maintenance request", description = "Marks a maintenance request as RESOLVED and records resolution remarks")
    public ResponseEntity<ApiResponse<MaintenanceRequestDTO>> resolveRequest(
            @Parameter(description = "Request ID") @PathVariable Long id,
            @Parameter(description = "Resolution remarks") @RequestParam(required = false) String remarks) {
        MaintenanceRequestDTO updated = requestService.resolveRequest(id, remarks);
        return ResponseEntity.ok(ApiResponse.success(updated, "Maintenance request resolved successfully"));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get requests by student ID", description = "Retrieves all requests submitted by a specific student")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDTO>>> getRequestsByStudentId(
            @Parameter(description = "Student ID") @PathVariable String studentId) {
        List<MaintenanceRequestDTO> requests = requestService.getRequestsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success(requests, "Student requests retrieved successfully"));
    }

    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get requests by room ID", description = "Retrieves all requests filed for a specific room")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDTO>>> getRequestsByRoomId(
            @Parameter(description = "Room ID") @PathVariable Long roomId) {
        List<MaintenanceRequestDTO> requests = requestService.getRequestsByRoomId(roomId);
        return ResponseEntity.ok(ApiResponse.success(requests, "Room requests retrieved successfully"));
    }

    @GetMapping("/hostel/{hostelId}")
    @Operation(summary = "Get requests by hostel ID", description = "Retrieves all requests filed for a specific hostel")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDTO>>> getRequestsByHostelId(
            @Parameter(description = "Hostel ID") @PathVariable Long hostelId) {
        List<MaintenanceRequestDTO> requests = requestService.getRequestsByHostelId(hostelId);
        return ResponseEntity.ok(ApiResponse.success(requests, "Hostel requests retrieved successfully"));
    }
}
