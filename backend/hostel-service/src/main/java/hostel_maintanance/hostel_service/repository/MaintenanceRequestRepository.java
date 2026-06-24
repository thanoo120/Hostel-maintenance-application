package hostel_maintanance.hostel_service.repository;

import hostel_maintanance.hostel_service.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStudentId(String studentId);
    List<MaintenanceRequest> findByRoomId(Long roomId);
    List<MaintenanceRequest> findByHostelId(Long hostelId);
    List<MaintenanceRequest> findByAssignedWorkerId(Long workerId);
}
