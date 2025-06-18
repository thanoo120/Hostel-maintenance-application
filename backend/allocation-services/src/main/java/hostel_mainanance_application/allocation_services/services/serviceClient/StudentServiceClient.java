package hostel_mainanance_application.allocation_services.services.serviceClient;

import hostel_mainanance_application.allocation_services.dto.external.StudentDTO;
import hostel_mainanance_application.allocation_services.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class StudentServiceClient {

    private final RestTemplate restTemplate;
    private final String studentServiceUrl;

    @Autowired
    public StudentServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.studentServiceUrl = "http://localhost:8090/api/students/";
    }

    public StudentDTO getStudent(String studentId) {
        try {
            return restTemplate.getForObject(studentServiceUrl + studentId, StudentDTO.class);
        } catch (RestClientException e) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }
    }
}
