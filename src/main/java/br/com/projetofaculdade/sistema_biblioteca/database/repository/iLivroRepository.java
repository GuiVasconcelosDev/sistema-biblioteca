package br.com.projetofaculdade.sistema_biblioteca.database.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetofaculdade.sistema_biblioteca.database.model.LivrosEntity;

public interface iLivroRepository extends JpaRepository<LivrosEntity, Integer> {

    //Busca livros ignorando maiúsculas e minúsculas e pegando partes da palavra
    List<LivrosEntity> findByNomeContainingIgnoreCase(String nome);

    List<LivrosEntity> findByAutorId(Integer autorId);
    

}
