package hostel_maintanance.hostel_service.controller;

import hostel_maintanance.hostel_service.dto.ApiResponse;
import hostel_maintanance.hostel_service.dto.HostelDTO;
import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.service.HostelService;
import hostel_maintanance.hostel_service.service.RoomService;
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
@RequestMapping("/api/hostels")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Hostel Management", description = "APIs for managing hostels and rooms")
public class HostelController {

    private final HostelService hostelService;
    private final RoomService roomService;

    @PostMapping
    @Operation(summary = "Create a new hostel", description = "Creates a new hostel with specified details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Hostel created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<HostelDTO>> createHostel(@Valid @RequestBody HostelDTO hostelDTO) {
        HostelDTO createdHostel = hostelService.createHostel(hostelDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(createdHostel, "Hostel created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update hostel information", description = "Updates an existing hostel's information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hostel updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Hostel not found")
    })
    public ResponseEntity<ApiResponse<HostelDTO>> updateHostel(
            @Parameter(description = "Hostel ID") @PathVariable Long id,
            @Valid @RequestBody HostelDTO hostelDTO) {
        HostelDTO updatedHostel = hostelService.updateHostel(id, hostelDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedHostel, "Hostel updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a hostel", description = "Deletes a hostel and all its rooms")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hostel deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Hostel not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteHostel(
            @Parameter(description = "Hostel ID") @PathVariable Long id) {
        hostelService.deleteHostel(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Hostel deleted successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hostel by ID", description = "Retrieves a hostel by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hostel found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Hostel not found")
    })
    public ResponseEntity<ApiResponse<HostelDTO>> getHostelById(
            @Parameter(description = "Hostel ID") @PathVariable Long id) {
        HostelDTO hostel = hostelService.getHostelById(id);
        return ResponseEntity.ok(ApiResponse.success(hostel, "Hostel retrieved successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all hostels", description = "Retrieves a list of all hostels")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hostels retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<HostelDTO>>> getAllHostels() {
        List<HostelDTO> hostels = hostelService.getAllHostels();
        return ResponseEntity.ok(ApiResponse.success(hostels, "Hostels retrieved successfully"));
    }

    @PostMapping("/{hostelId}/rooms")
    @Operation(summary = "Add a room to hostel", description = "Creates a new room in the specified hostel")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Room created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Hostel not found")
    })
    public ResponseEntity<ApiResponse<RoomDTO>> addRoom(
            @Parameter(description = "Hostel ID") @PathVariable Long hostelId,
            @Valid @RequestBody RoomDTO roomDTO) {
        RoomDTO createdRoom = roomService.addRoom(hostelId, roomDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(createdRoom, "Room created successfully"));
    }

    @GetMapping("/{hostelId}/rooms")
    @Operation(summary = "Get rooms by hostel ID", description = "Retrieves all rooms for a specific hostel")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Rooms retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Hostel not found")
    })
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getRoomsByHostelId(
            @Parameter(description = "Hostel ID") @PathVariable Long hostelId) {
        List<RoomDTO> rooms = roomService.getRoomsByHostelId(hostelId);
        return ResponseEntity.ok(ApiResponse.success(rooms, "Rooms retrieved successfully"));
    }

    @GetMapping("/rooms/available")
    @Operation(summary = "Get all available rooms", description = "Retrieves all available rooms across all hostels")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Available rooms retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getAllAvailableRooms() {
        List<RoomDTO> rooms = roomService.getAllAvailableRooms();
        return ResponseEntity.ok(ApiResponse.success(rooms, "Available rooms retrieved successfully"));
    }

}
