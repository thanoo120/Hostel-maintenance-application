package hostel_maintanance.hostel_service.mapper;

import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.model.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomDTO toDto(Room room) {
        if (room == null) return null;

        RoomDTO dto = new RoomDTO();
        dto.setId(room.getRoomId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setCapacity(room.getCapacity());
        dto.setOccupiedSpaces(room.getOccupiedSpaces());
        dto.setAvailableSpaces(room.getAvailableSpaces());
        dto.setHostelId(room.getHostel().getId());
        return dto;
    }

    public Room toEntity(RoomDTO dto) {
        if (dto == null) return null;

        Room room = new Room();
        room.setRoomId(dto.getId());
        room.setRoomNumber(dto.getRoomNumber());
        room.setCapacity(dto.getCapacity());
        room.setOccupiedSpaces(dto.getOccupiedSpaces());
        // Note: Hostel should be set separately in the service layer
        return room;
    }

    public void updateRoomFromDto(RoomDTO dto, Room room) {
        if (dto == null || room == null) return;

        room.setRoomNumber(dto.getRoomNumber());
        room.setCapacity(dto.getCapacity());
        room.setOccupiedSpaces(dto.getOccupiedSpaces());
    }
}
