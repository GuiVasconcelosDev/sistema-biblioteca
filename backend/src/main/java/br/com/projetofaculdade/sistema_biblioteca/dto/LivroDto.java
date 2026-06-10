package br.com.projetofaculdade.sistema_biblioteca.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LivroDto {

    @NotBlank
    private String nome;

    @NotBlank
    private String editora;

    @NotNull
    private int anoPublicacao;

    @NotBlank
    private String genero;

    @NotNull
    private Integer autorId;
}
