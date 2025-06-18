package hostel_mainanance_application.allocation_services.dto.request;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllocationRequestDTO {

    private String studentId;
    private Long roomId;
}
