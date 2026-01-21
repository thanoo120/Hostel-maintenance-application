package hostel_maintanance.hostel_service.service.impl;

import hostel_maintanance.hostel_service.dto.WorkerRequestDto;
import hostel_maintanance.hostel_service.dto.WorkerResponseDto;
import hostel_maintanance.hostel_service.mapper.WorkMapper;
import hostel_maintanance.hostel_service.model.Workers;
import hostel_maintanance.hostel_service.repository.WorkerRepository;
import hostel_maintanance.hostel_service.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class WorkerServiceImpl implements WorkerService {

    private final WorkerRepository workerRepository;
    private final WorkMapper workMapper;

    @Override
    public WorkerResponseDto createWorker(WorkerRequestDto workerDetails) {
       Workers response=workerRepository.save(workMapper.toWorker(workerDetails));
       return workMapper.toDto(response);
    }

    @Override
    public WorkerResponseDto deleteWorker(Long workerId) {
        Workers existWorker=workerRepository.findById(workerId).orElseThrow();
        workerRepository.delete(existWorker);
        return workMapper.toDto(existWorker);
    }

    @Override
    public WorkerResponseDto updateWorker(Long workerId,WorkerRequestDto requestDto) {
        Workers updatableUser=workerRepository.findById(workerId).orElseThrow();
        updatableUser.setPhoneNumber(requestDto.getPhoneNumber());
        updatableUser.setName(requestDto.getName());
        updatableUser.setJob(requestDto.getJob());
        updatableUser.setAvailable(requestDto.isAvailable());
        workerRepository.save(updatableUser);
        return workMapper.toDto(updatableUser);
    }

    @Override
    public List<WorkerResponseDto> getAllWorkers() {
        List<Workers> allWorkersDetails=workerRepository.findAll();
        return allWorkersDetails.stream().map(workMapper::toDto).toList();

    }

    @Override
    public WorkerResponseDto getWorkerById(Long workerId) {
        Workers workerInfo=workerRepository.findById(workerId).orElseThrow();
        return workMapper.toDto(workerInfo);

    }

    @Override
    public List<WorkerResponseDto> getWorkersByWorkType(String type) {
        List<Workers> allWorkers=workerRepository.findAll();
        return allWorkers.stream().map(workMapper::toDto).toList();
    }
}
