package hostel_maintanance.hostel_service.controller;


import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class HostelController {

    private final RoomService roomService;

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id,@RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.updateRoom(id,roomDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping()
    public ResponseEntity<List<RoomDTO>> getAllAvailableRooms(){
        return ResponseEntity.ok(roomService.getAllAvailableRooms());
    }

}
