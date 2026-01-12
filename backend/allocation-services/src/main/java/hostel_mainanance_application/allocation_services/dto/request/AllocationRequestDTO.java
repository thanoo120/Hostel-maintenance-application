package hostel_mainanance_application.allocation_services.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllocationRequestDTO {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotNull(message = "Room ID is required")
    private Long roomId;
}
