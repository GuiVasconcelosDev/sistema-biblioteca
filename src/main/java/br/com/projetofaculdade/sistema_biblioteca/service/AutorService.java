package br.com.projetofaculdade.sistema_biblioteca.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.projetofaculdade.sistema_biblioteca.database.model.AutorEntity;
import br.com.projetofaculdade.sistema_biblioteca.database.repository.iAutorRepository;
import br.com.projetofaculdade.sistema_biblioteca.dto.AutorDto;
import br.com.projetofaculdade.sistema_biblioteca.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final iAutorRepository autorRepository;

    public List<AutorEntity> findAll(){
        return autorRepository.findAll();
    }

    public void save(AutorDto autorDto){
        AutorEntity autor = AutorEntity.builder()
            .nome(autorDto.getNome())
            .build();
        autorRepository.save(autor);
    }

    public void update(Integer id, AutorDto autorDto) throws NotFoundException {
        AutorEntity autor = autorRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Autor não encontrado"));
            
        autor.setNome(autorDto.getNome());
        autorRepository.save(autor);
    }

    public void delete(Integer id){
        autorRepository.deleteById(id);
    }
}
