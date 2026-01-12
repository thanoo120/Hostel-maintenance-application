package hostel_maintanance.hostel_service.controller;

import hostel_maintanance.hostel_service.dto.ApiResponse;
import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Room Management", description = "APIs for managing rooms")
public class RoomController {
    private final RoomService roomService;

    @PutMapping("/{id}")
    @Operation(summary = "Update room information", description = "Updates an existing room's information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Room updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Room not found")
    })
    public ResponseEntity<ApiResponse<RoomDTO>> updateRoom(
            @Parameter(description = "Room ID") @PathVariable Long id,
            @Valid @RequestBody RoomDTO roomDTO) {
        RoomDTO updatedRoom = roomService.updateRoom(id, roomDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedRoom, "Room updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a room", description = "Deletes a room")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Room deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Room not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @Parameter(description = "Room ID") @PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Room deleted successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID", description = "Retrieves a room by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Room found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Room not found")
    })
    public ResponseEntity<ApiResponse<RoomDTO>> getRoomById(
            @Parameter(description = "Room ID") @PathVariable Long id) {
        RoomDTO room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success(room, "Room retrieved successfully"));
    }

    @GetMapping()
    @Operation(summary = "Get all available rooms", description = "Retrieves all available rooms")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Available rooms retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getAllAvailableRooms() {
        List<RoomDTO> rooms = roomService.getAllAvailableRooms();
        return ResponseEntity.ok(ApiResponse.success(rooms, "Available rooms retrieved successfully"));
    }
}
