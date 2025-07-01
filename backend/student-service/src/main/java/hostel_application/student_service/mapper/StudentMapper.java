package hostel_application.student_service.mapper;

import hostel_application.student_service.dto.StudentDto;
import hostel_application.student_service.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {
  public StudentDto toDto(Student student) {
    if (student == null)
      return null;
    StudentDto dto = new StudentDto();
    dto.setStudentId(student.getStudentId());
    dto.setStudentName(student.getStudentName());
    dto.setStudentEmail(student.getStudentEmail());
    dto.setContactNumber(student.getContactNumber());
    dto.setDepartment(student.getDepartment());
    dto.setCourse(student.getCourse());
    dto.setAcademicYear(student.getAcademicYear());
    return dto;
  }

  public Student toEntity(StudentDto dto) {
    if (dto == null)
      return null;
    Student student = new Student();
    student.setStudentId(dto.getStudentId());
    student.setStudentName(dto.getStudentName());
    student.setStudentEmail(dto.getStudentEmail());
    student.setContactNumber(dto.getContactNumber());
    student.setDepartment(dto.getDepartment());
    student.setCourse(dto.getCourse());
    student.setAcademicYear(dto.getAcademicYear());
    return student;
  }

  public void updateStudentFromDto(StudentDto dto, Student student) {
    if (dto == null || student == null)
      return;
    student.setStudentName(dto.getStudentName());
    student.setStudentEmail(dto.getStudentEmail());
    student.setContactNumber(dto.getContactNumber());
    student.setDepartment(dto.getDepartment());
    student.setCourse(dto.getCourse());
    student.setAcademicYear(dto.getAcademicYear());
  }
}
