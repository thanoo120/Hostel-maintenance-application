package hostel_maintanance.hostel_service.repository;

import hostel_maintanance.hostel_service.model.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostelRepository extends JpaRepository<Hostel,Long> {
    boolean existsByName(String name);
}
