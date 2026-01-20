package hostel_maintanance.hostel_service.mapper;

import hostel_maintanance.hostel_service.dto.WorkerRequestDto;
import hostel_maintanance.hostel_service.dto.WorkerResponseDto;
import hostel_maintanance.hostel_service.model.Workers;
import org.springframework.stereotype.Component;


@Component
public class WorkMapper {
    public Workers toWorker(WorkerRequestDto workerDetails) {
      Workers newWorker=new Workers();

      newWorker.setJob(workerDetails.getJob());
      newWorker.setName(workerDetails.getName());
      newWorker.setPhoneNumber(workerDetails.getPhoneNumber());

      return newWorker;

    }

    public WorkerResponseDto toDto(Workers worker){

        return WorkerResponseDto.builder()
                .job(worker.getJob())
                .name(worker.getName())
                .isAvailable(worker.isAvailable())
                .phoneNumber(worker.getPhoneNumber())
                .build();
    }
}
