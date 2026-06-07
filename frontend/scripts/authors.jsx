// Authors section — CRUD connected to /v1/autores

function AuthorModal({ mode, author, saving, onSave, onClose }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = React.useState({ nome: author?.nome ?? '' });
  const [fieldError, setFieldError] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateAuthor(form);
    if (err) { setFieldError(err); return; }
    setFieldError(null);
    onSave(form);
  };

  return (
    <Modal title={isEdit ? 'Editar Autor' : 'Novo Autor'} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Nome completo" required>
          <input
            type="text"
            value={form.nome}
            onChange={e => setForm({ nome: e.target.value })}
            placeholder="Ex: Machado de Assis"
            className="form-input"
            autoFocus
          />
        </FormField>

        {fieldError && (
          <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#dc2626' }}>
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

function AuthorCard({ author, deleting, onEdit, onDelete }) {
  const bookCount = (author.livros || []).length;
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
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 p-2 rounded-lg"
          style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
          <Users size={17} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-snug truncate" style={{ color: 'var(--text)' }}>
            {author.nome}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {bookCount === 0
              ? 'Nenhum livro cadastrado'
              : `${bookCount} livro${bookCount !== 1 ? 's' : ''} no acervo`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {deleting ? (
          <Loader size={15} />
        ) : (
          <>
            <button className="icon-btn" title="Editar autor" onClick={onEdit}>
              <Pencil />
            </button>
            <button className="icon-btn danger" title="Excluir autor" onClick={onDelete}>
              <Trash />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AuthorsSection({ authors, loading, error, onRefresh, showToast }) {
  const [search, setSearch] = React.useState('');
  const [modal, setModal] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return authors;
    return authors.filter(a => a.nome.toLowerCase().includes(q));
  }, [authors, search]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const isEdit = modal.mode === 'edit';
      const url = isEdit
        ? `${API_URL}/v1/autores/${modal.author.id}`
        : `${API_URL}/v1/autores`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: formData.nome.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao salvar autor.');
      }
      setModal(null);
      await onRefresh();
      showToast(isEdit ? 'Autor atualizado com sucesso!' : 'Autor adicionado com sucesso!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    const { id } = confirm;
    setConfirm(null);
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/v1/autores/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao excluir autor.');
      }
      await onRefresh();
      showToast('Autor excluído com sucesso!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const totalBooks = authors.reduce((sum, a) => sum + (a.livros || []).length, 0);

  return (
    <div className="anim-fade">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar autor…"
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
          onClick={() => setModal({ mode: 'create', author: null })}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0"
          style={{ color: 'var(--primary-fg)' }}
        >
          <Plus size={15} /> Novo Autor
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : authors.length === 0 ? (
        <EmptyState
          icon={<UserDashed />}
          title="Nenhum autor cadastrado"
          subtitle="Adicione autores para começar a organizar o acervo."
          action={
            <button
              onClick={() => setModal({ mode: 'create', author: null })}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: 'var(--primary-fg)' }}>
              <Plus size={14} /> Novo Autor
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={44} />}
          title="Nenhum resultado"
          subtitle={`Nenhum autor encontrado para "${search}".`}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} autor{filtered.length !== 1 ? 'es' : ''}
            {!search && totalBooks > 0 && ` · ${totalBooks} livro${totalBooks !== 1 ? 's' : ''} no total`}
          </p>
          {filtered.map(author => (
            <AuthorCard
              key={author.id}
              author={author}
              deleting={deleting === author.id}
              onEdit={() => setModal({ mode: 'edit', author })}
              onDelete={() => {
                const bookCount = (author.livros || []).length;
                const extra = bookCount > 0
                  ? ` Os ${bookCount} livro${bookCount !== 1 ? 's' : ''} deste autor também serão excluídos.`
                  : '';
                setConfirm({ id: author.id, name: author.nome, extra });
              }}
            />
          ))}
        </div>
      )}

      {modal && (
        <AuthorModal
          mode={modal.mode}
          author={modal.author}
          saving={saving}
          onSave={handleSave}
          onClose={() => !saving && setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title="Excluir autor"
          message={`Tem certeza que deseja excluir "${confirm.name}"?${confirm.extra ? ' ' + confirm.extra : ''} Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
