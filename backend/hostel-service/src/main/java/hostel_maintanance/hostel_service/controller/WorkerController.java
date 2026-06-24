package hostel_maintanance.hostel_service.controller;

import hostel_maintanance.hostel_service.dto.ApiResponse;
import hostel_maintanance.hostel_service.dto.WorkerRequestDto;
import hostel_maintanance.hostel_service.dto.WorkerResponseDto;
import hostel_maintanance.hostel_service.service.WorkerService;
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
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Worker Management", description = "APIs for managing hostel workers")
public class WorkerController {

    private final WorkerService workerService;

    @PostMapping
    @Operation(summary = "Create a new worker", description = "Creates a new worker record")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Worker created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<WorkerResponseDto>> createWorker(@Valid @RequestBody WorkerRequestDto requestDto) {
        WorkerResponseDto created = workerService.createWorker(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(created, "Worker created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all workers", description = "Retrieves all registered workers")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Workers retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<WorkerResponseDto>>> getAllWorkers() {
        List<WorkerResponseDto> workers = workerService.getAllWorkers();
        return ResponseEntity.ok(ApiResponse.success(workers, "Workers retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get worker by ID", description = "Retrieves a worker by their ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Worker found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Worker not found")
    })
    public ResponseEntity<ApiResponse<WorkerResponseDto>> getWorkerById(
            @Parameter(description = "Worker ID") @PathVariable Long id) {
        WorkerResponseDto worker = workerService.getWorkerById(id);
        return ResponseEntity.ok(ApiResponse.success(worker, "Worker retrieved successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update worker details", description = "Updates an existing worker's details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Worker updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Worker not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<WorkerResponseDto>> updateWorker(
            @Parameter(description = "Worker ID") @PathVariable Long id,
            @Valid @RequestBody WorkerRequestDto requestDto) {
        WorkerResponseDto updated = workerService.updateWorker(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Worker updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a worker", description = "Deletes a worker record")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Worker deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Worker not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteWorker(
            @Parameter(description = "Worker ID") @PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Worker deleted successfully"));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get workers by work type/job", description = "Retrieves all workers with a specific job profile")
    public ResponseEntity<ApiResponse<List<WorkerResponseDto>>> getWorkersByWorkType(
            @Parameter(description = "Job type (e.g. Electrician)") @PathVariable String type) {
        List<WorkerResponseDto> workers = workerService.getWorkersByWorkType(type);
        return ResponseEntity.ok(ApiResponse.success(workers, "Workers retrieved successfully"));
    }
}
