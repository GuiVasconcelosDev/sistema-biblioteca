function App() {
  const [activeTab, setActiveTab] = React.useState('livros');
  const [authors, setAuthors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [dark, setDark] = React.useState(false);
  const [emerald, setEmerald] = React.useState(false);
  const toastTimer = React.useRef(null);

  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', dark);
    html.classList.toggle('theme-emerald', emerald);
  }, [dark, emerald]);

  const showToast = React.useCallback((msg, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const fetchAuthors = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/v1/autores`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Erro ${res.status}`);
      }
      setAuthors(await res.json());
    } catch (e) {
      setError(e.message || 'Não foi possível conectar à API.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  const tabs = [
    { key: 'livros',   label: 'Livros',   Icon: BookOpen },
    { key: 'autores',  label: 'Autores',  Icon: Users },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Header ── */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="logo-glow p-2 rounded-xl flex-shrink-0"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}>
              <BookOpen size={21} />
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg leading-tight" style={{ color: 'var(--text)' }}>
                Biblioteca
              </h1>
              <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                Sistema de Acervo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setEmerald(e => !e)}
              title={emerald ? 'Tema âmbar' : 'Tema esmeralda'}
              className="icon-btn"
              style={{ color: emerald ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              <Palette />
            </button>
            <button
              onClick={() => setDark(d => !d)}
              title={dark ? 'Modo claro' : 'Modo escuro'}
              className="icon-btn"
            >
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Tab nav ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {tabs.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  color: activeTab === key ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === key
                    ? '2px solid var(--primary)'
                    : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'livros' ? (
          <BooksSection
            authors={authors}
            loading={loading}
            error={error}
            onRefresh={fetchAuthors}
            showToast={showToast}
          />
        ) : (
          <AuthorsSection
            authors={authors}
            loading={loading}
            error={error}
            onRefresh={fetchAuthors}
            showToast={showToast}
          />
        )}
      </main>

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
