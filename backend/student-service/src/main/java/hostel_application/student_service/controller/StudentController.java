package hostel_application.student_service.controller;

import hostel_application.student_service.dto.ApiResponse;
import hostel_application.student_service.dto.StudentDto;
import hostel_application.student_service.services.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Student Management", description = "APIs for managing students")
public class StudentController {
    private final StudentService studentService;

    @PostMapping("/register")
    @Operation(summary = "Register a new student", description = "Creates a new student record")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Student registered successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<StudentDto>> registerStudent(@Valid @RequestBody StudentDto studentDto) {
        StudentDto createdStudent = studentService.registerStudent(studentDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(createdStudent, "Student registered successfully"));
    }

    @PutMapping("/{studentId}")
    @Operation(summary = "Update student information", description = "Updates an existing student's information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Student updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Student not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(
            @Parameter(description = "Student ID") @PathVariable String studentId,
            @Valid @RequestBody StudentDto studentDto) {
        StudentDto updatedStudent = studentService.updateStudent(studentId, studentDto);
        return ResponseEntity.ok(ApiResponse.success(updatedStudent, "Student updated successfully"));
    }

    @DeleteMapping("/{studentId}")
    @Operation(summary = "Delete a student", description = "Deletes a student record")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Student deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteStudent(
            @Parameter(description = "Student ID") @PathVariable String studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success(null, "Student deleted successfully"));
    }

    @GetMapping("/{studentId}")
    @Operation(summary = "Get student by ID", description = "Retrieves a student by their ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Student found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(
            @Parameter(description = "Student ID") @PathVariable String studentId) {
        StudentDto student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(ApiResponse.success(student, "Student retrieved successfully"));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all students", description = "Retrieves a list of all registered students")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Students retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents() {
        List<StudentDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success(students, "Students retrieved successfully"));
    }
}
