package hostel_maintanance.hostel_service.repository;

import hostel_maintanance.hostel_service.model.Hostel;
import hostel_maintanance.hostel_service.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room,Long> {
List<Room> findByHostelId(Long hostelId);

@Query("SELECT r FROM Room r WHERE r.capacity > r.occupiedSpaces")
List<Room> findAllAvailableRooms();

boolean existsByHostelIdAndRoomNumber(Long hostelId,String roomNumber);
}
