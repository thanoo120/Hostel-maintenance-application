package hostel_maintanance.hostel_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    private String studentName;

    @Column(nullable = false)
    private Long roomId;

    @Column(nullable = false)
    private Long hostelId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String category; // e.g. PLUMBING, ELECTRICAL, INTERNET, FURNITURE, OTHER

    @Column(nullable = false)
    private String priority; // e.g. LOW, MEDIUM, HIGH

    @Column(nullable = false)
    private String status; // e.g. PENDING, ASSIGNED, RESOLVED

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @Column(length = 1000)
    private String remarks;

    private Long assignedWorkerId;

    private String assignedWorkerName;
}
