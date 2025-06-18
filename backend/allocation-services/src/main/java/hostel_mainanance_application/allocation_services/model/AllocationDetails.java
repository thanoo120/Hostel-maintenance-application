package hostel_mainanance_application.allocation_services.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="allocation")
public class AllocationDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private Long roomId;

    @Column(nullable = false)
    private Long hostelId;

    private LocalDateTime allocationDate;

    private LocalDateTime deAllocationDate;

    private boolean active;

}
