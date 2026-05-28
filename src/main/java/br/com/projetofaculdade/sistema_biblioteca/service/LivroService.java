package br.com.projetofaculdade.sistema_biblioteca.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.com.projetofaculdade.sistema_biblioteca.database.model.AutorEntity;
import br.com.projetofaculdade.sistema_biblioteca.database.model.LivrosEntity;
import br.com.projetofaculdade.sistema_biblioteca.database.repository.iAutorRepository;
import br.com.projetofaculdade.sistema_biblioteca.database.repository.iLivroRepository;
import br.com.projetofaculdade.sistema_biblioteca.dto.LivroDto;
import br.com.projetofaculdade.sistema_biblioteca.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final iLivroRepository livroRepository;
    private final iAutorRepository autorRepository;

    public List<LivroDto> findAll(){
        List<LivrosEntity> livros = livroRepository.findAll();

        return livros.stream().map(livro -> {
            LivroDto dto = new LivroDto();
            dto.setNome(livro.getNome());
            dto.setEditora(livro.getEditora());
            dto.setAnoPublicacao(livro.getAnoPublicacao());
            dto.setGenero(livro.getGenero());

            if(livro.getAutor() != null){
                dto.setAutorId(livro.getAutor().getId());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public void save(LivroDto livroDto) throws NotFoundException {
        AutorEntity autor = autorRepository.findById(livroDto.getAutorId())
            .orElseThrow(() -> new NotFoundException("Autor não encontrado"));

        LivrosEntity livro = new LivrosEntity();
            livro.setNome(livroDto.getNome());
            livro.setEditora(livroDto.getEditora());
            livro.setAnoPublicacao(livroDto.getAnoPublicacao());
            livro.setGenero(livroDto.getGenero());
            

        livro.setAutor(autor);

        livroRepository.save(livro);
            
    }

    public void update(Integer id, LivroDto livroDto) throws NotFoundException {
        LivrosEntity livro = livroRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Livro não encontrado"));

        livro.setNome(livroDto.getNome());
        livro.setEditora(livroDto.getEditora());
        livro.setAnoPublicacao(livroDto.getAnoPublicacao());
        livro.setGenero(livroDto.getGenero());

        livroRepository.save(livro);
    }

    public void delete(Integer id) {
        livroRepository.deleteById(id);
    }
}
