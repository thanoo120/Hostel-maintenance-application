package hostel_application.student_service.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="students")
public class Student {

    @Id
    @Column(nullable = false, unique = true)
    private String studentId;
    @Column(nullable = false)
    private String studentName;
    private String studentEmail;
    private String contactNumber;
    private String department;
    private String course;
    private String academicYear;

}
