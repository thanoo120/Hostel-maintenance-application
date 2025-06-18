package hostel_mainanance_application.allocation_services.services.serviceClient;

import hostel_mainanance_application.allocation_services.dto.external.RoomDTO;
import hostel_mainanance_application.allocation_services.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class RoomServiceClient {
    private final RestTemplate restTemplate;
    private final String roomServiceUrl;

    @Autowired
    public RoomServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.roomServiceUrl = "http://localhost:8091/api/rooms/";
    }

    public RoomDTO getRoom(Long roomId) {
        try {
            return restTemplate.getForObject(roomServiceUrl + roomId, RoomDTO.class);
        } catch (RestClientException e) {
            throw new ResourceNotFoundException("Room not found with ID: " + roomId);
        }
    }

    public void updateRoomOccupancy(Long roomId, boolean increase) {
        String url = roomServiceUrl + roomId + "/occupancy?increase=" + increase;
        restTemplate.patchForObject(url, null, Void.class);
    }
}
