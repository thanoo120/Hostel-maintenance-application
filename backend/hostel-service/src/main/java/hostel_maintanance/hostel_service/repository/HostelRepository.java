package hostel_maintanance.hostel_service.repository;

import hostel_maintanance.hostel_service.model.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HostelRepository extends JpaRepository<Hostel,Long> {
    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END FROM Hostel h WHERE h.hostelName = :name")
    boolean existsByHostelName(@Param("name") String name);

}
