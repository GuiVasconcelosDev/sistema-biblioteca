package br.com.projetofaculdade.sistema_biblioteca.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LivroResumidoDto {

    private Integer id;
    private String nome;
    private String editora;
    private int anoPublicacao;
    private String genero;
}
