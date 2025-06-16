package hostel_maintanance.hostel_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private Integer floorNumber;

    private Integer capacity;

    private Integer occupiedSpaces;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id",nullable = false)
    private Hostel hostel;

    public Integer getAvailableSpaces(){
        return capacity -(occupiedSpaces == null ? 0: occupiedSpaces);
    }


}
