package hostel_mainanance_application.allocation_services.services.implementation;

import hostel_mainanance_application.allocation_services.dto.AllocationDTO;
import hostel_mainanance_application.allocation_services.dto.external.RoomDTO;
import hostel_mainanance_application.allocation_services.dto.external.StudentDTO;
import hostel_mainanance_application.allocation_services.dto.request.AllocationRequestDTO;
import hostel_mainanance_application.allocation_services.exception.InvalidOperationException;
import hostel_mainanance_application.allocation_services.exception.ResourceNotFoundException;
import hostel_mainanance_application.allocation_services.mapper.AllocationMapper;
import hostel_mainanance_application.allocation_services.model.AllocationDetails;
import hostel_mainanance_application.allocation_services.repository.AllocationRepository;
import hostel_mainanance_application.allocation_services.services.AllocationService;
import hostel_mainanance_application.allocation_services.services.serviceClient.RoomServiceClient;
import hostel_mainanance_application.allocation_services.services.serviceClient.StudentServiceClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AllocationServiceImplementation implements AllocationService {
    private final AllocationRepository allocationRepository;
    private final AllocationMapper allocationMapper;
    private final StudentServiceClient studentServiceClient;
    private final RoomServiceClient roomServiceClient;

    @Override
    @Transactional
    public AllocationDTO allocateRoom(AllocationRequestDTO requestDTO) {

        StudentDTO student = studentServiceClient.getStudent(requestDTO.getStudentId());

        // Check if student is already allocated a room
        if (allocationRepository.existsByStudentIdAndActiveTrue(requestDTO.getStudentId())) {
            throw new InvalidOperationException("Student is already allocated to a room. Please deallocate first.");
        }


        RoomDTO room = roomServiceClient.getRoom(requestDTO.getRoomId());
        if (room.getAvailableSpaces() <= 0) {
            throw new InvalidOperationException("Room is already at full capacity");
        }

        // Create allocation
        AllocationDetails allocation = new AllocationDetails();
        allocation.setStudentId(requestDTO.getStudentId());
        allocation.setRoomId(requestDTO.getRoomId());
        allocation.setHostelId(room.getHostelId());
        allocation.setAllocationDate(LocalDateTime.now());
        allocation.setActive(true);


        AllocationDetails savedAllocation = allocationRepository.save(allocation);

        // Update room occupancy
        roomServiceClient.updateRoomOccupancy(requestDTO.getRoomId(), true);

        AllocationDTO allocationDTO = allocationMapper.toDto(savedAllocation);
        allocationDTO.setStudentName(student.getStudentName());
        allocationDTO.setRoomNumber(room.getRoomNumber());
        // Normally would set hostel name here, but keeping it simple for this example

        return allocationDTO;
    }

    @Override
    @Transactional
    public AllocationDTO deallocateRoom(Long allocationId, String remarks) {
        AllocationDetails allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with ID: " + allocationId));

        if (!allocation.isActive()) {
            throw new InvalidOperationException("This allocation is already deactivated");
        }

        // Update allocation
        allocation.setDeAllocationDate(LocalDateTime.now());
        allocation.setActive(false);

        AllocationDetails updatedAllocation = allocationRepository.save(allocation);

        // Update room occupancy
        roomServiceClient.updateRoomOccupancy(allocation.getRoomId(), false);

        return allocationMapper.toDto(updatedAllocation);
    }

    @Override
    @Transactional
    public AllocationDTO getAllocationById(Long id) {
        AllocationDetails allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with ID: " + id));

        AllocationDTO allocationDTO = allocationMapper.toDto(allocation);

        // Fetch additional information
        try {
            StudentDTO student = studentServiceClient.getStudent(allocation.getStudentId());
            allocationDTO.setStudentName(student.getStudentName());

            RoomDTO room = roomServiceClient.getRoom(allocation.getRoomId());
            allocationDTO.setRoomNumber(room.getRoomNumber());
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Error fetching additional allocation data: " + e.getMessage());
        }

        return allocationDTO;
    }

    @Override
    @Transactional
    public List<AllocationDTO> gatAllAllocations() {
        return allocationRepository.findAll().stream()
                .map(allocationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AllocationDTO> getAllocationByStudentId(String studentId) {
        return allocationRepository.findByStudentIdAndActiveTrue(studentId).stream()
                .map(allocationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AllocationDTO> getAllocationsByRoomId(Long roomId) {
        return allocationRepository.findByRoomIdAndActiveTrue(roomId).stream()
                .map(allocationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AllocationDTO> getAllocationsByHostelId(Long hostelId) {
        return allocationRepository.findByHostelIdAndActiveTrue(hostelId).stream()
                .map(allocationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AllocationDTO> getAllActiveAllocations() {
        return allocationRepository.findAll().stream()
                .filter(AllocationDetails::isActive)
                .map(allocationMapper::toDto)
                .collect(Collectors.toList());
    }
}

