package br.com.projetofaculdade.sistema_biblioteca.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.com.projetofaculdade.sistema_biblioteca.database.model.AutorEntity;
import br.com.projetofaculdade.sistema_biblioteca.database.repository.iAutorRepository;
import br.com.projetofaculdade.sistema_biblioteca.dto.AutorDto;
import br.com.projetofaculdade.sistema_biblioteca.dto.LivroResumidoDto;
import br.com.projetofaculdade.sistema_biblioteca.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final iAutorRepository autorRepository;

    public List<AutorDto> findAll() {
        List<AutorEntity> autores = autorRepository.findAll();

        return autores.stream().map(autor -> {
            AutorDto dto = new AutorDto(); 
            dto.setId(autor.getId());
            dto.setNome(autor.getNome());
            
            if(autor.getLivros() != null) {
                List<LivroResumidoDto> livrosDto = autor.getLivros().stream().map(livro -> {
                    LivroResumidoDto lDto = new LivroResumidoDto();
                    lDto.setId(livro.getId());
                    lDto.setNome(livro.getNome());
                    lDto.setEditora(livro.getEditora());
                    lDto.setAnoPublicacao(livro.getAnoPublicacao());
                    lDto.setGenero(livro.getGenero());
                    return lDto;
                }).collect(Collectors.toList());

                dto.setLivros(livrosDto); 
            }
            
            return dto; 
        }).collect(Collectors.toList()); 
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