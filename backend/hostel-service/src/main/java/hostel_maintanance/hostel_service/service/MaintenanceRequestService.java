package hostel_maintanance.hostel_service.service;

import hostel_maintanance.hostel_service.dto.MaintenanceRequestDTO;

import java.util.List;

public interface MaintenanceRequestService {
    MaintenanceRequestDTO createRequest(MaintenanceRequestDTO dto);
    MaintenanceRequestDTO getRequestById(Long id);
    List<MaintenanceRequestDTO> getAllRequests();
    MaintenanceRequestDTO assignWorker(Long id, Long workerId);
    MaintenanceRequestDTO resolveRequest(Long id, String remarks);
    List<MaintenanceRequestDTO> getRequestsByStudentId(String studentId);
    List<MaintenanceRequestDTO> getRequestsByRoomId(Long roomId);
    List<MaintenanceRequestDTO> getRequestsByHostelId(Long hostelId);
    List<MaintenanceRequestDTO> getRequestsByWorkerId(Long workerId);
}
