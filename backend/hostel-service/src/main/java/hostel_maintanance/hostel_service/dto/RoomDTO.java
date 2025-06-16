package hostel_maintanance.hostel_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private Integer capacity;
    private Integer occupiedSpaces;
    private Integer availableSpaces;
    private Long hostelId;

}
