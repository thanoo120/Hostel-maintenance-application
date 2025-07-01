package hostel_mainanance_application.allocation_services.services;

import hostel_mainanance_application.allocation_services.dto.AllocationDTO;
import hostel_mainanance_application.allocation_services.dto.request.AllocationRequestDTO;

import java.util.List;

public interface AllocationService {

    public AllocationDTO allocateRoom(AllocationRequestDTO requestDTO);

    public AllocationDTO deallocateRoom(Long allocationId, String remarks);

    public AllocationDTO getAllocationById(Long id);

    public List<AllocationDTO> gatAllAllocations();

    public List<AllocationDTO> getAllocationByStudentId(String studentId);

    public List<AllocationDTO> getAllocationsByRoomId(Long roomId);

    public List<AllocationDTO> getAllocationsByHostelId(Long hostelId);

    public List<AllocationDTO> getAllActiveAllocations();
}
