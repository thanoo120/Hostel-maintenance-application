package hostel_application.student_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

    private String studentId;

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    private String studentName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String studentEmail;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    @NotBlank(message = "Department is required")
    @Size(min = 2, max = 100, message = "Department must be between 2 and 100 characters")
    private String department;

    @NotBlank(message = "Course is required")
    @Size(min = 2, max = 100, message = "Course must be between 2 and 100 characters")
    private String course;

    @NotBlank(message = "Academic year is required")
    @Pattern(regexp = "^[0-9]{4}-[0-9]{4}$", message = "Academic year must be in format YYYY-YYYY")
    private String academicYear;

}
