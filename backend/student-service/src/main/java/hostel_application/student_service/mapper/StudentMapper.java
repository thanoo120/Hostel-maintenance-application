package hostel_application.student_service.mapper;

import hostel_application.student_service.dto.StudentDto;
import hostel_application.student_service.model.Student;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StudentMapper {
  StudentDto toDto(Student student);
  Student toEntity(StudentDto studentDto);
  void updateStudentFromDto(StudentDto studentDto, @MappingTarget Student student);
}
