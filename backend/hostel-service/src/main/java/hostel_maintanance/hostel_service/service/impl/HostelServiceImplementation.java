package hostel_maintanance.hostel_service.service.impl;

import hostel_maintanance.hostel_service.dto.HostelDTO;
import hostel_maintanance.hostel_service.exception.DuplicateResourceException;
import hostel_maintanance.hostel_service.exception.ResourceNotFoundException;
import hostel_maintanance.hostel_service.mapper.HostelMapper;
import hostel_maintanance.hostel_service.model.Hostel;
import hostel_maintanance.hostel_service.repository.HostelRepository;
import hostel_maintanance.hostel_service.service.HostelService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HostelServiceImplementation implements HostelService {
    private HostelRepository hostelRepository;
    private HostelMapper hostelMapper;

    @Override
    @Transactional
    public HostelDTO createHostel(HostelDTO hostelDTO){
        if(hostelRepository.existsByHostelName(hostelDTO.getName())){
            throw new DuplicateResourceException("Hostel with name" + hostelDTO.getName() + "already exists");
        }

        Hostel hostel = hostelMapper.toEntity(hostelDTO);
        Hostel savedHostel = hostelRepository.save(hostel);
        return hostelMapper.toDto(savedHostel);

    }

    @Override
    @Transactional
    public HostelDTO updateHostel(Long id, HostelDTO hostelDTO) {
        Hostel existingHostel = hostelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hostel not found with ID: " + id));

        // Check if the updated name conflicts with another hostel
        if (!existingHostel.getHostelName().equals(hostelDTO.getName()) &&
                hostelRepository.existsByHostelName(hostelDTO.getName())) {
            throw new DuplicateResourceException("Hostel with name " + hostelDTO.getName() + " already exists");
        }

        hostelMapper.updateHostelFromDto(hostelDTO, existingHostel);
        Hostel updatedHostel = hostelRepository.save(existingHostel);
        return hostelMapper.toDto(updatedHostel);
    }

    @Override
    @Transactional
    public void deleteHostel(Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hostel not found with ID: " + id));
        hostelRepository.delete(hostel);
    }

    @Override
    @Transactional
    public HostelDTO getHostelById(Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hostel not found with ID: " + id));
        return hostelMapper.toDto(hostel);
    }

    @Override
    @Transactional
    public List<HostelDTO> getAllHostels() {
        return hostelRepository.findAll().stream()
                .map(hostelMapper::toDto)
                .toList();
    }



}
