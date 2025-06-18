package hostel_mainanance_application.allocation_services.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllocationDTO {

    private Long id;
    private String studentId;
    private Long roomId;
    private Long hostelId;
    private LocalDateTime allocationDate;
    private LocalDateTime deAllocationDate;
    private boolean active;
    private String remarks;


    private String studentName;
    private String hostelName;
    private String roomNumber;
}
