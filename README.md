# Sistema Biblioteca

Projeto Spring Boot REST para gerenciamento de autores e livros.

## Tecnologias

- Java 25
- Spring Boot 4.0.6
- Spring Web MVC
- Spring Data JPA
- H2 Database
- Lombok

## Como executar

1. Instale o Maven e o JDK 25.
2. Execute:

```bash
mvn clean package
mvn spring-boot:run
```

A aplicação será iniciada em `http://localhost:8080`.

## Endpoints principais

### Autores

- `GET /v1/autores`
  - Retorna todos os autores.
- `POST /v1/autores`
  - Cria um novo autor.
  - Exemplo de payload:

```json
{
  "nome": "Nome do Autor"
}
```
- `PUT /v1/autores/{id}`
  - Atualiza o autor existente.
  - Exemplo de payload:

```json
{
  "nome": "Nome atualizado"
}
```

### Livros

- `GET /v1/livros`
  - Retorna todos os livros.
- `POST /v1/livros`
  - Cria um novo livro.
  - Exemplo de payload:

```json
{
  "nome": "Título do Livro",
  "editora": "Editora",
  "anoPublicacao": "2024",
  "genero": "Ficção"
}
```
- `PUT /v1/livros/{id}`
  - Atualiza o livro existente.
- `DELETE /v1/livros/{id}`
  - Remove o livro pelo ID.

## Banco de dados

O projeto usa H2 em memória por padrão. Se necessário, configure o `application.yaml` para persistência ou outras propriedades.

## Observações

- O Spring Boot expõe o console H2 em `/h2-console` se habilitado.
- O diretório `target/` é ignorado no controle de versão.
