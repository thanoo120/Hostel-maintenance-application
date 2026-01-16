package hostel_maintanance.hostel_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkerRequestDto {
    @NotNull(message = "Name should not be null")
    String name;

    @NotNull(message = "Phone Number should not be null")
    String phoneNumber;

    @NotNull(message = "job should not be null")
    String job;

    boolean isAvailable;
}
