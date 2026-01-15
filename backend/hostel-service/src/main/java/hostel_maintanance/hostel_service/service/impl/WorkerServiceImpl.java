package hostel_maintanance.hostel_service.service.impl;

import hostel_maintanance.hostel_service.dto.WorkerRequestDto;
import hostel_maintanance.hostel_service.dto.WorkerResponseDto;
import hostel_maintanance.hostel_service.service.WorkerService;

import java.util.List;

public class WorkerServiceImpl implements WorkerService {
    @Override
    public WorkerResponseDto createWorker(WorkerRequestDto workerDetails) {
        return null;
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
