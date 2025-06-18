package hostel_mainanance_application.allocation_services.mapper;

import hostel_mainanance_application.allocation_services.dto.AllocationDTO;
import hostel_mainanance_application.allocation_services.model.AllocationDetails;
import org.springframework.stereotype.Component;

@Component
public class AllocationMapper {
    public AllocationDTO toDto(AllocationDetails allocationDetails) {
        if (allocationDetails == null) {
            return null;
        }

        AllocationDTO dto = new AllocationDTO();
        dto.setId(allocationDetails.getId());
        dto.setStudentId(allocationDetails.getStudentId());
        dto.setRoomId(allocationDetails.getRoomId());
        dto.setHostelId(allocationDetails.getHostelId());
        dto.setAllocationDate(allocationDetails.getAllocationDate());
        dto.setDeAllocationDate(allocationDetails.getDeAllocationDate());
        dto.setActive(allocationDetails.isActive());


        // These fields are set in the service using external APIs
        dto.setStudentName(null);
        dto.setRoomNumber(null);
        dto.setHostelName(null);

        return dto;
    }

    // Convert DTO to entity (optional, not usually needed in your current flow)
    public AllocationDetails toEntity(AllocationDTO dto) {
        if (dto == null) {
            return null;
        }

        AllocationDetails entity = new AllocationDetails();
        entity.setId(dto.getId());
        entity.setStudentId(dto.getStudentId());
        entity.setRoomId(dto.getRoomId());
        entity.setHostelId(dto.getHostelId());
        entity.setAllocationDate(dto.getAllocationDate());
        entity.setDeAllocationDate(dto.getDeAllocationDate());
        entity.setActive(dto.isActive());
        return entity;
    }
}

