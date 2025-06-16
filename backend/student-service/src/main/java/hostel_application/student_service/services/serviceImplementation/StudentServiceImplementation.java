package hostel_application.student_service.services.serviceImplementation;

import hostel_application.student_service.dto.StudentDto;
import hostel_application.student_service.exception.ResourceNotFoundException;
import hostel_application.student_service.mapper.StudentMapper;
import hostel_application.student_service.model.Student;
import hostel_application.student_service.repository.StudentRepository;
import hostel_application.student_service.services.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class StudentServiceImplementation implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    @Override
    public void deleteStudent(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        studentRepository.delete(student);
    }

    @Override
    public StudentDto getStudentById(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        return studentMapper.toDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto updateStudent(String studentId,StudentDto studentDto){
        Student existingStudent=studentRepository.findById(studentId)
                .orElseThrow(() ->new ResourceNotFoundException("Student not found with ID: " + studentId));

        studentMapper.updateStudentFromDto(studentDto,existingStudent);
        Student updatedStudent =studentRepository.save(existingStudent);
        return studentMapper.toDto(updatedStudent);

    }

    @Override
    public StudentDto registerStudent(StudentDto studentDto){
        Student student =studentMapper.toEntity(studentDto);
        System.out.println("Student mapped: " + student);
        Student savedStudent=studentRepository.save(student);
        return studentMapper.toDto(savedStudent);
    }
}
