package br.com.projetofaculdade.sistema_biblioteca.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetofaculdade.sistema_biblioteca.database.model.LivrosEntity;
import br.com.projetofaculdade.sistema_biblioteca.dto.LivroDto;
import br.com.projetofaculdade.sistema_biblioteca.exception.NotFoundException;
import br.com.projetofaculdade.sistema_biblioteca.service.LivroService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/livros")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @GetMapping
    public List<LivrosEntity> findAll(){
        return livroService.findAll();
    }

    @PostMapping
    public void criarLivro(@RequestBody LivroDto livroDto) {
        livroService.save(livroDto);
    }

    @PutMapping("/{id}")
    public void atualizarLivro(@PathVariable Integer id, @RequestBody LivroDto livroDto) throws NotFoundException {
        livroService.update(id, livroDto);
    }

    @DeleteMapping("/{id}")
    public void deletarLivro(@PathVariable Integer id) {
        livroService.delete(id);
    }
}
