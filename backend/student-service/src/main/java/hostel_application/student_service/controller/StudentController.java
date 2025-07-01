package hostel_application.student_service.controller;

import hostel_application.student_service.dto.StudentDto;
import hostel_application.student_service.services.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<StudentDto> registerStudent(@RequestBody StudentDto studentDto) {
        return new ResponseEntity<>(studentService.registerStudent(studentDto), HttpStatus.CREATED);
    }

    @PutMapping("/{studentId}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable String studentId,
            @RequestBody StudentDto studentDto) {
        return ResponseEntity.ok(studentService.updateStudent(studentId, studentDto));
    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<StudentDto> deleteStudent(@PathVariable String studentId) {
        studentService.deleteStudent(studentId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentById(studentId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
}
