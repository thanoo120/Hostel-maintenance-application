package hostel_mainanance_application.allocation_services.dto.external;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {

    private String studentId;
    private String studentName;
    private String studentEmail;
    private String contactNumber;
    private String department;
    private String course;
    private String academicYear;
}
