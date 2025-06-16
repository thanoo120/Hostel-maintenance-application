package hostel_maintanance.hostel_service.controller;


import hostel_maintanance.hostel_service.dto.HostelDTO;
import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.service.HostelService;
import hostel_maintanance.hostel_service.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostels")
@RequiredArgsConstructor
public class HostelController {

    private final HostelService hostelService;
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<HostelDTO> createHostel( @RequestBody HostelDTO hostelDTO) {
        return new ResponseEntity<>(hostelService.createHostel(hostelDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelDTO> updateHostel(@PathVariable Long id, @RequestBody HostelDTO hostelDTO) {
        return ResponseEntity.ok(hostelService.updateHostel(id, hostelDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHostel(@PathVariable Long id) {
        hostelService.deleteHostel(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelDTO> getHostelById(@PathVariable Long id) {
        return ResponseEntity.ok(hostelService.getHostelById(id));
    }

    @GetMapping
    public ResponseEntity<List<HostelDTO>> getAllHostels() {
        return ResponseEntity.ok(hostelService.getAllHostels());
    }

    @PostMapping("/{hostelId}/rooms")
    public ResponseEntity<RoomDTO> addRoom(@PathVariable Long hostelId,  @RequestBody RoomDTO roomDTO) {
        return new ResponseEntity<>(roomService.addRoom(hostelId, roomDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{hostelId}/rooms")
    public ResponseEntity<List<RoomDTO>> getRoomsByHostelId(@PathVariable Long hostelId) {
        return ResponseEntity.ok(roomService.getRoomsByHostelId(hostelId));
    }

    @GetMapping("/rooms/available")
    public ResponseEntity<List<RoomDTO>> getAllAvailableRooms() {
        return ResponseEntity.ok(roomService.getAllAvailableRooms());
    }

}
