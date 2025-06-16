package hostel_application.student_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

    private String studentId;
    private String studentName;
    private String studentEmail;
    private String contactNumber;
    private String department;
    private String course;
    private String academicYear;

}
