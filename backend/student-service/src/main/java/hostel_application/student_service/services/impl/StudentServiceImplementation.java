package hostel_application.student_service.services.impl;

import hostel_application.student_service.dto.StudentDto;
import hostel_application.student_service.exception.ResourceNotFoundException;
import hostel_application.student_service.mapper.StudentMapper;
import hostel_application.student_service.model.Student;
import hostel_application.student_service.repository.StudentRepository;
import hostel_application.student_service.services.StudentService;
import hostel_application.student_service.services.constants.StudentConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentServiceImplementation implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    @Override
    public void deleteStudent(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(StudentConstants.STUDENT_NOT_FOUND + studentId));
        studentRepository.delete(student);
    }

    @Override
    public StudentDto getStudentById(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(StudentConstants.STUDENT_NOT_FOUND + studentId));
        return studentMapper.toDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toDto)
                .toList();
    }

    @Override
    public String askFacilities(String message) {
        return "";
    }

    @Override
    public String sendComplaints(String issue) {
        return "";
    }

    @Override
    public void selectAWorkerForTheIssue(String issueType) {



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
        Student savedStudent=studentRepository.save(student);
        return studentMapper.toDto(savedStudent);
    }
}
