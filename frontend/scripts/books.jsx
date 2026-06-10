// Books section — CRUD connected to /v1/livros

function BookModal({ mode, book, authors, saving, onSave, onClose }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = React.useState({
    nome:         book?.nome ?? '',
    editora:      book?.editora ?? '',
    anoPublicacao: book?.anoPublicacao != null ? String(book.anoPublicacao) : '',
    genero:       book?.genero ?? '',
    autorId:      book?.autorId != null ? String(book.autorId) : '',
  });
  const [fieldError, setFieldError] = React.useState(null);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateBook(form);
    if (err) { setFieldError(err); return; }
    setFieldError(null);
    onSave(form);
  };

  return (
    <Modal title={isEdit ? 'Editar Livro' : 'Novo Livro'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Nome do livro" required>
          <input type="text" value={form.nome} onChange={set('nome')}
            placeholder="Ex: Dom Casmurro" className="form-input" autoFocus />
        </FormField>

        <FormField label="Autor" required>
          <select value={form.autorId} onChange={set('autorId')} className="form-input">
            <option value="">Selecione um autor…</option>
            {authors.map(a => (
              <option key={a.id} value={String(a.id)}>{a.nome}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Editora" required>
          <input type="text" value={form.editora} onChange={set('editora')}
            placeholder="Ex: Companhia das Letras" className="form-input" />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Ano de publicação" required>
            <input type="number" value={form.anoPublicacao} onChange={set('anoPublicacao')}
              placeholder={String(CURRENT_YEAR)} min="1400" max={CURRENT_YEAR}
              className="form-input" />
          </FormField>
          <FormField label="Gênero" required>
            <input type="text" value={form.genero} onChange={set('genero')}
              placeholder="Ex: Romance" className="form-input" />
          </FormField>
        </div>

        {fieldError && (
          <p className="text-xs font-medium flex items-center gap-1.5"
            style={{ color: '#dc2626' }}>
            <AlertCircle size={13} /> {fieldError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={saving}
            className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ color: 'var(--primary-fg)' }}>
            {saving && <Loader size={14} />}
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function BookCard({ book, deleting, onEdit, onDelete }) {
  return (
    <div
      className="glow-hover rounded-xl px-4 py-3.5 flex items-start justify-between gap-4 anim-fade"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        opacity: deleting ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex-shrink-0 p-2 rounded-lg mt-0.5"
          style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
          <BookOpen size={17} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-snug truncate" style={{ color: 'var(--text)' }}>
            {book.nome}
          </p>
          <p className="text-xs mt-0.5 flex flex-wrap items-center gap-x-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>{book.autorNome}</span>
            <span aria-hidden>·</span>
            <span>{book.editora}</span>
            <span aria-hidden>·</span>
            <span>{book.anoPublicacao}</span>
            <span aria-hidden>·</span>
            <span>{book.genero}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {deleting ? (
          <Loader size={15} />
        ) : (
          <>
            <button className="icon-btn" title="Editar livro" onClick={onEdit}>
              <Pencil />
            </button>
            <button className="icon-btn danger" title="Excluir livro" onClick={onDelete}>
              <Trash />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function BooksSection({ authors, loading, error, onRefresh, showToast }) {
  const [search, setSearch] = React.useState('');
  const [modal, setModal] = React.useState(null);   // null | { mode, book }
  const [confirm, setConfirm] = React.useState(null); // null | { id, name }
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);

  const allBooks = React.useMemo(() =>
    authors.flatMap(a =>
      (a.livros || []).map(l => ({ ...l, autorId: a.id, autorNome: a.nome }))
    ),
    [authors]
  );

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allBooks;
    return allBooks.filter(b =>
      b.nome.toLowerCase().includes(q) ||
      b.autorNome.toLowerCase().includes(q) ||
      b.editora.toLowerCase().includes(q) ||
      b.genero.toLowerCase().includes(q)
    );
  }, [allBooks, search]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const isEdit = modal.mode === 'edit';
      const url = isEdit
        ? `${API_URL}/v1/livros/${modal.book.id}`
        : `${API_URL}/v1/livros`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:          formData.nome.trim(),
          editora:       formData.editora.trim(),
          anoPublicacao: parseInt(formData.anoPublicacao, 10),
          genero:        formData.genero.trim(),
          autorId:       parseInt(formData.autorId, 10),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao salvar livro.');
      }
      setModal(null);
      await onRefresh();
      showToast(isEdit ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    const { id, name } = confirm;
    setConfirm(null);
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/v1/livros/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao excluir livro.');
      }
      await onRefresh();
      showToast('Livro excluído com sucesso!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="anim-fade">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por título, autor, editora ou gênero…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-8"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn"
              style={{ padding: 2 }}>
              <XIcon size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setModal({ mode: 'create', book: null })}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0"
          style={{ color: 'var(--primary-fg)' }}
        >
          <Plus size={15} /> Novo Livro
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : allBooks.length === 0 ? (
        <EmptyState
          icon={<BookDashed />}
          title="Nenhum livro no acervo"
          subtitle="Comece adicionando o primeiro livro."
          action={
            <button
              onClick={() => setModal({ mode: 'create', book: null })}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: 'var(--primary-fg)' }}>
              <Plus size={14} /> Novo Livro
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={44} />}
          title="Nenhum resultado"
          subtitle={`Nada encontrado para "${search}".`}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} livro{filtered.length !== 1 ? 's' : ''}
            {search ? ` encontrado${filtered.length !== 1 ? 's' : ''}` : ' no acervo'}
          </p>
          {filtered.map(book => (
            <BookCard
              key={book.id}
              book={book}
              deleting={deleting === book.id}
              onEdit={() => setModal({ mode: 'edit', book })}
              onDelete={() => setConfirm({ id: book.id, name: book.nome })}
            />
          ))}
        </div>
      )}

      {modal && (
        <BookModal
          mode={modal.mode}
          book={modal.book}
          authors={authors}
          saving={saving}
          onSave={handleSave}
          onClose={() => !saving && setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Excluir livro"
          message={`Tem certeza que deseja excluir "${confirm.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
