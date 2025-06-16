package hostel_application.student_service.repository;

import hostel_application.student_service.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student,String> {
    Optional<Student> findByStudentEmail(String studentEmail);
}
