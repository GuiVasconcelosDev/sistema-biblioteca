package br.com.projetofaculdade.sistema_biblioteca.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.projetofaculdade.sistema_biblioteca.database.model.LivrosEntity;
import br.com.projetofaculdade.sistema_biblioteca.database.repository.iLivroRepository;
import br.com.projetofaculdade.sistema_biblioteca.dto.LivroDto;
import br.com.projetofaculdade.sistema_biblioteca.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final iLivroRepository livroRepository;

    public List<LivrosEntity> findAll(){
        return livroRepository.findAll();
    }

    public void save(LivroDto livroDto) {
        LivrosEntity livro = LivrosEntity.builder()
            .nome(livroDto.getNome())
            .editora(livroDto.getEditora())
            .anoPublicacao(livroDto.getAnoPublicacao())
            .genero(livroDto.getGenero())
            .build();
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
