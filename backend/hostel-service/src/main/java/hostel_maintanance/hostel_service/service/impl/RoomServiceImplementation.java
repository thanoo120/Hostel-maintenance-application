package hostel_maintanance.hostel_service.service.impl;

import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.exception.DuplicateResourceException;
import hostel_maintanance.hostel_service.exception.InvalidOperationException;
import hostel_maintanance.hostel_service.exception.ResourceNotFoundException;
import hostel_maintanance.hostel_service.mapper.RoomMapper;
import hostel_maintanance.hostel_service.model.Hostel;
import hostel_maintanance.hostel_service.model.Room;
import hostel_maintanance.hostel_service.repository.HostelRepository;
import hostel_maintanance.hostel_service.repository.RoomRepository;
import hostel_maintanance.hostel_service.service.RoomService;
import hostel_maintanance.hostel_service.service.utill.Constants;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImplementation implements RoomService {
    private final RoomRepository roomRepository;
    private final HostelRepository hostelRepository;
    private final RoomMapper roomMapper;

    @Override
    @Transactional
    public RoomDTO addRoom(Long hostelId, RoomDTO roomDTO) {
        // Check if the hostel exists
        Hostel hostel = hostelRepository.findById(hostelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hostel not found with ID: " + hostelId));

        // Check if room with same number exists in the hostel
        if (roomRepository.existsByHostelIdAndRoomNumber(hostelId, roomDTO.getRoomNumber())) {
            throw new DuplicateResourceException("Room with number " + roomDTO.getRoomNumber() +
                    " already exists in this hostel");
        }

        Room room = roomMapper.toEntity(roomDTO);
        room.setHostel(hostel);
        room.setOccupiedSpaces(0); // Initially empty

        Room savedRoom = roomRepository.save(room);
        return roomMapper.toDto(savedRoom);
    }

    @Override
    @Transactional
    public RoomDTO updateRoom(Long roomId, RoomDTO roomDTO) {
        Room existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.ROOM_NOT_FOUND + roomId));


        if (!existingRoom.getRoomNumber().equals(roomDTO.getRoomNumber()) &&
                roomRepository.existsByHostelIdAndRoomNumber(existingRoom.getHostel().getId(), roomDTO.getRoomNumber())) {
            throw new DuplicateResourceException("Room with number " + roomDTO.getRoomNumber() +
                    " already exists in this hostel");
        }

        // Prevent decreasing capacity below current occupancy
        if (roomDTO.getCapacity() < existingRoom.getOccupiedSpaces()) {
            throw new InvalidOperationException("Cannot reduce room capacity below current occupancy");
        }

        roomMapper.updateRoomFromDto(roomDTO, existingRoom);
        Room updatedRoom = roomRepository.save(existingRoom);
        return roomMapper.toDto(updatedRoom);
    }

    @Override
    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.ROOM_NOT_FOUND + roomId));

        // Check if room is occupied
        if (room.getOccupiedSpaces() != null && room.getOccupiedSpaces() > 0) {
            throw new InvalidOperationException("Cannot delete room that is currently occupied");
        }

        roomRepository.delete(room);
    }

    @Override
    @Transactional
    public RoomDTO getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.ROOM_NOT_FOUND + roomId));
        return roomMapper.toDto(room);
    }

    @Override
    @Transactional
    public List<RoomDTO> getRoomsByHostelId(Long hostelId) {
        // Check if the hostel exists
        if (!hostelRepository.existsById(hostelId)) {
            throw new ResourceNotFoundException("Hostel not found with ID: " + hostelId);
        }

        return roomRepository.findByHostelId(hostelId).stream()
                .map(roomMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public List<RoomDTO> getAllAvailableRooms() {
        return roomRepository.findAllAvailableRooms().stream()
                .map(roomMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void updateRoomOccupancy(Long roomId, boolean increase) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        int occupiedSpaces = room.getOccupiedSpaces() == null ? 0 : room.getOccupiedSpaces();

        if (increase) {
            if (occupiedSpaces >= room.getCapacity()) {
                throw new InvalidOperationException("Room is already at full capacity");
            }
            room.setOccupiedSpaces(occupiedSpaces + 1);
        } else {
            if (occupiedSpaces <= 0) {
                throw new InvalidOperationException("Room is already empty");
            }
            room.setOccupiedSpaces(occupiedSpaces - 1);
        }

        roomRepository.save(room);
    }
}
