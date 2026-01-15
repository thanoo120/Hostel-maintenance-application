package hostel_maintanance.hostel_service.repository;

import hostel_maintanance.hostel_service.model.Workers;

import org.springframework.data.jpa.repository.JpaRepository;


public interface WorkerRepository extends JpaRepository<Workers,Long> {

}
