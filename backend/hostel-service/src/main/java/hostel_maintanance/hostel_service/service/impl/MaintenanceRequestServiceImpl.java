package hostel_maintanance.hostel_service.service.impl;

import hostel_maintanance.hostel_service.dto.MaintenanceRequestDTO;
import hostel_maintanance.hostel_service.model.MaintenanceRequest;
import hostel_maintanance.hostel_service.model.Workers;
import hostel_maintanance.hostel_service.repository.MaintenanceRequestRepository;
import hostel_maintanance.hostel_service.repository.WorkerRepository;
import hostel_maintanance.hostel_service.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final WorkerRepository workerRepository;

    @Override
    @Transactional
    public MaintenanceRequestDTO createRequest(MaintenanceRequestDTO dto) {
        MaintenanceRequest request = new MaintenanceRequest();
        request.setStudentId(dto.getStudentId());
        request.setStudentName(dto.getStudentName());
        request.setRoomId(dto.getRoomId());
        request.setHostelId(dto.getHostelId());
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setCategory(dto.getCategory());
        request.setPriority(dto.getPriority());
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        
        MaintenanceRequest saved = requestRepository.save(request);
        return convertToDTO(saved);
    }

    @Override
    public MaintenanceRequestDTO getRequestById(Long id) {
        MaintenanceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found with id: " + id));
        return convertToDTO(request);
    }

    @Override
    public List<MaintenanceRequestDTO> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MaintenanceRequestDTO assignWorker(Long id, Long workerId) {
        MaintenanceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found with id: " + id));
        
        Workers worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found with id: " + workerId));
        
        // Mark worker as busy (not available)
        worker.setAvailable(false);
        workerRepository.save(worker);

        request.setStatus("ASSIGNED");
        request.setAssignedWorkerId(workerId);
        request.setAssignedWorkerName(worker.getName());
        
        MaintenanceRequest saved = requestRepository.save(request);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public MaintenanceRequestDTO resolveRequest(Long id, String remarks) {
        MaintenanceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found with id: " + id));
        
        request.setStatus("RESOLVED");
        request.setResolvedAt(LocalDateTime.now());
        request.setRemarks(remarks);

        // Free the assigned worker if they exist
        if (request.getAssignedWorkerId() != null) {
            workerRepository.findById(request.getAssignedWorkerId()).ifPresent(worker -> {
                worker.setAvailable(true);
                workerRepository.save(worker);
            });
        }

        MaintenanceRequest saved = requestRepository.save(request);
        return convertToDTO(saved);
    }

    @Override
    public List<MaintenanceRequestDTO> getRequestsByStudentId(String studentId) {
        return requestRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> getRequestsByRoomId(Long roomId) {
        return requestRepository.findByRoomId(roomId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> getRequestsByHostelId(Long hostelId) {
        return requestRepository.findByHostelId(hostelId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDTO> getRequestsByWorkerId(Long workerId) {
        return requestRepository.findByAssignedWorkerId(workerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MaintenanceRequestDTO convertToDTO(MaintenanceRequest entity) {
        return MaintenanceRequestDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudentId())
                .studentName(entity.getStudentName())
                .roomId(entity.getRoomId())
                .hostelId(entity.getHostelId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .resolvedAt(entity.getResolvedAt())
                .remarks(entity.getRemarks())
                .assignedWorkerId(entity.getAssignedWorkerId())
                .assignedWorkerName(entity.getAssignedWorkerName())
                .build();
    }
}
