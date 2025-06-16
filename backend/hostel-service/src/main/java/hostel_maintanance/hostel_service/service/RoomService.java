package hostel_maintanance.hostel_service.service;

import hostel_maintanance.hostel_service.dto.RoomDTO;

import java.util.List;


public interface RoomService {
    public RoomDTO updateRoom(Long roomId,RoomDTO roomDTO);
    public RoomDTO addRoom(Long hostelId,RoomDTO roomDTO);
    public void deleteRoom(Long roomId);
    public RoomDTO getRoomById(Long roomId);
    public List<RoomDTO> getRoomsByHostelId(Long hostelId);
    public List<RoomDTO> getAllAvailableRooms();
    public void updateRoomOccupancy(Long roomId,boolean increase);

}
