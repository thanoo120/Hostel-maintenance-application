package hostel_maintanance.hostel_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostelDTO {
    private Long id;
    private String name;
    private String location;
    private Integer totalCapacity;
    private Integer availableCapacity;
    private List<RoomDTO> rooms;
}
