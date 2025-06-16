package hostel_maintanance.hostel_service.mapper;

import hostel_maintanance.hostel_service.dto.HostelDTO;
import hostel_maintanance.hostel_service.dto.RoomDTO;
import hostel_maintanance.hostel_service.model.Hostel;
import hostel_maintanance.hostel_service.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class HostelMapper {

    private final RoomMapper roomMapper;

    @Autowired
    public HostelMapper(RoomMapper roomMapper) {
        this.roomMapper = roomMapper;
    }

    public HostelDTO toDto(Hostel hostel) {
        if (hostel == null) return null;

        HostelDTO dto = new HostelDTO();
        dto.setId(hostel.getId());
        dto.setName(hostel.getHostelName());
        dto.setLocation(hostel.getLocation());
        dto.setTotalCapacity(hostel.getTotalCapacity());
        dto.setAvailableCapacity(hostel.getAvailableCapacity());

        List<RoomDTO> roomDTOs = hostel.getRooms().stream()
                .map(roomMapper::toDto)
                .collect(Collectors.toList());
        dto.setRooms(roomDTOs);

        return dto;
    }

    public Hostel toEntity(HostelDTO dto) {
        if (dto == null) return null;

        Hostel hostel = new Hostel();
        hostel.setId(dto.getId());
        hostel.setHostelName(dto.getName());
        hostel.setLocation(dto.getLocation());
        // Room entities and total capacity are set separately if needed
        return hostel;
    }

    public void updateHostelFromDto(HostelDTO dto, Hostel hostel) {
        if (dto == null || hostel == null) return;

        hostel.setHostelName(dto.getName());
        hostel.setLocation(dto.getLocation());
        // You can choose whether to update rooms or not; normally avoid updating room list here.
    }
}
