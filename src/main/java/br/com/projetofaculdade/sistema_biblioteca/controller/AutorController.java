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

import br.com.projetofaculdade.sistema_biblioteca.dto.AutorDto;
import br.com.projetofaculdade.sistema_biblioteca.exception.NotFoundException;
import br.com.projetofaculdade.sistema_biblioteca.service.AutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/autores")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @GetMapping
    public List<AutorDto> findAll(){
        return autorService.findAll();
    }

    @PostMapping
    public void criarAutor(@Valid @RequestBody AutorDto autorDto) {
        autorService.save(autorDto);
    }

    @PutMapping("/{id}")
    public void atualizarAutor(@PathVariable Integer id, @Valid @RequestBody AutorDto autorDto) throws NotFoundException {
        autorService.update(id, autorDto);
    }

    @DeleteMapping("/{id}")
    public void deletarAutor(@PathVariable Integer id) {
        autorService.delete(id);
    }
}
