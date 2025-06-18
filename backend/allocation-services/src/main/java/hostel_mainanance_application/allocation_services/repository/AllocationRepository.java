package hostel_mainanance_application.allocation_services.repository;

import hostel_mainanance_application.allocation_services.model.AllocationDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AllocationRepository extends JpaRepository<AllocationDetails,Long> {
    List<AllocationDetails> findByStudentIdAndActiveTrue(String studentId);

    List<AllocationDetails> findByRoomIdAndActiveTrue(Long roomId);

    List<AllocationDetails> findByHostelIdAndActiveTrue(Long hostelId);

    Optional<AllocationDetails> findByStudentIdAndActiveTrueAndRoomId(String studentId, Long roomId);

    boolean existsByStudentIdAndActiveTrue(String studentId);
}
