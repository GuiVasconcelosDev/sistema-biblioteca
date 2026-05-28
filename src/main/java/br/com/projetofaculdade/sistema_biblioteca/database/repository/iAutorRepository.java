package br.com.projetofaculdade.sistema_biblioteca.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetofaculdade.sistema_biblioteca.database.model.AutorEntity;

public interface iAutorRepository extends JpaRepository<AutorEntity, Integer> {

}
