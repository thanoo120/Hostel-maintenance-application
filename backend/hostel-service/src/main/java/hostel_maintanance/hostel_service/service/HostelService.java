package hostel_maintanance.hostel_service.service;

import hostel_maintanance.hostel_service.dto.HostelDTO;

import java.util.List;

public interface HostelService {

    public HostelDTO createHostel(HostelDTO hostelDTO);
    public HostelDTO updateHostel(Long id,HostelDTO hostelDTO);
    public void deleteHostel(Long id);
    public HostelDTO getHostelById(Long id);
    public List<HostelDTO> getAllHostels();
}
