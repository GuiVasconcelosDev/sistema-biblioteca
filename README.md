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

## Explicação do código

- **Pacote principal:** contém a classe de inicialização `SistemaBibliotecaApplication.java`.
- **Controllers:** `controller/AutorController.java` e `controller/LivroController.java` expõem os endpoints REST (`/v1/autores`, `/v1/livros`).
- **Services:** `service/AutorService.java` e `service/LivroService.java` contêm a lógica de negócio e orquestram chamadas para os repositórios.
- **Repositories:** `database/repository/iAutorRepository.java` e `database/repository/iLivroRepository.java` usam Spring Data JPA para acesso a dados.
- **Entities:** `database/model/AutorEntity.java` e `database/model/LivrosEntity.java` representam as tabelas do banco.
- **DTOs:** `dto/AutorDto.java` e `dto/LivroDto.java` são usados para transferência de dados entre API e serviço.
- **Tratamento de erros:** `exception/NotFoundException.java` e `exception/ErrorResponse.java` juntos com `handler/GlobalExceptionHandler.java` centralizam o tratamento de exceções e respostas de erro.
- **Configuração:** `resources/application.yaml` contém as propriedades do Spring e do H2.

## Observações

- O Spring Boot expõe o console H2 em `/h2-console` se habilitado.
- O diretório `target/` é ignorado no controle de versão.
