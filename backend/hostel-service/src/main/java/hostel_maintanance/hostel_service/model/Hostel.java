package hostel_maintanance.hostel_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hostels")
public class Hostel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hostelName;

    private String location;

    private Long category;

    @OneToMany(mappedBy = "hostel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Room> rooms = new ArrayList<>();

    public int getTotalCapacity() {
        return rooms.stream().mapToInt(Room::getCapacity).sum();
    }

    public int getAvailableCapacity() {
        return rooms.stream().mapToInt(Room::getAvailableSpaces).sum();
    }


}
