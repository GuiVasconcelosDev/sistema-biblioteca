package br.com.projetofaculdade.sistema_biblioteca.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LivroDto {

    
    private String nome;
    private String editora;
    private String anoPublicacao;
    private String genero;
}
