const API_URL = 'http://localhost:8080';
const CURRENT_YEAR = new Date().getFullYear();

function validateBook(form) {
  if (!form.nome.trim()) return 'O nome do livro é obrigatório.';
  if (!form.autorId) return 'Selecione um autor.';
  if (!form.editora.trim()) return 'A editora é obrigatória.';
  const ano = parseInt(form.anoPublicacao, 10);
  if (!form.anoPublicacao || isNaN(ano)) return 'Informe o ano de publicação.';
  if (ano < 1400 || ano > CURRENT_YEAR) return `O ano deve estar entre 1400 e ${CURRENT_YEAR}.`;
  if (!form.genero.trim()) return 'O gênero é obrigatório.';
  return null;
}

function validateAuthor(form) {
  if (!form.nome.trim()) return 'O nome do autor é obrigatório.';
  return null;
}
