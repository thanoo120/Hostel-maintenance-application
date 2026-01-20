package hostel_maintanance.hostel_service.service;

import hostel_maintanance.hostel_service.dto.WorkerRequestDto;
import hostel_maintanance.hostel_service.dto.WorkerResponseDto;

import java.util.List;

 public interface WorkerService {
     WorkerResponseDto createWorker(WorkerRequestDto workerDetails);
     WorkerResponseDto deleteWorker(Long workerId);
     WorkerResponseDto updateWorker(Long workerId,WorkerRequestDto workerRequestDto);
     List<WorkerResponseDto> getAllWorkers();
     WorkerResponseDto getWorkerById(Long workerId);
     List<WorkerResponseDto> getWorkersByWorkType(String type);
    
}
