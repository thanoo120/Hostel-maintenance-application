package hostel_application.student_service.services;

import hostel_application.student_service.dto.StudentDto;

import java.util.List;

public interface StudentService {

    public StudentDto registerStudent(StudentDto studentDto);
    public StudentDto updateStudent(String studentId,StudentDto studentDto);
    public void deleteStudent(String studentId);
    public StudentDto getStudentById(String studentId);
    public List<StudentDto> getAllStudents();
    public String askFacilities(String message);
    public String sendComplaints(String issue);
    public void selectAWorkerForTheIssue(String issueType);

}
