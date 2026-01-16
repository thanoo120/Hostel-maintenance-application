package hostel_maintanance.hostel_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WorkerResponseDto {

    @NotNull(message = "name not be null")
    String name;
    @NotNull(message = "phone Number not be null")
    String phoneNumber;
    @NotNull(message = "job can not be null")
    String job;

    boolean isAvailable;
}
