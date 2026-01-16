package hostel_maintanance.hostel_service.service.impl;

import hostel_maintanance.hostel_service.dto.WorkerRequestDto;
import hostel_maintanance.hostel_service.dto.WorkerResponseDto;
import hostel_maintanance.hostel_service.repository.WorkerRepository;
import hostel_maintanance.hostel_service.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class WorkerServiceImpl implements WorkerService {

    private final WorkerRepository workerRepository;

    @Override
    public WorkerResponseDto createWorker(WorkerRequestDto workerDetails) {
       workerRepository.save(workerDetails)
    }

    @Override
    public WorkerResponseDto deleteWorker(Long workerId) {
        return null;
    }

    @Override
    public WorkerResponseDto updateWorker(Long workerId) {
        return null;
    }

    @Override
    public List<WorkerResponseDto> getAllWorkers() {
        return List.of();
    }

    @Override
    public WorkerResponseDto getWorkerById(Long workerId) {
        return null;
    }

    @Override
    public List<WorkerResponseDto> getWorkersByWorkType(String type) {
        return List.of();
    }
}
