// Shared UI components

function Modal({ title, onClose, children, size = 'md' }) {
  const widthMap = { sm: '400px', md: '480px', lg: '560px' };

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="anim-pop w-full rounded-2xl shadow-2xl flex flex-col"
        style={{
          maxWidth: widthMap[size],
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-serif font-semibold text-base" style={{ color: 'var(--text)' }}>
            {title}
          </h2>
          <button onClick={onClose} className="icon-btn" aria-label="Fechar">
            <XIcon size={17} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  const isError = toast.type === 'error';
  return (
    <div className="fixed bottom-6 right-6 z-[60] anim-toast">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
        style={{
          background: isError ? '#fee2e2' : 'var(--primary-soft)',
          border: `1.5px solid ${isError ? '#fca5a5' : 'var(--primary)'}`,
          color: isError ? '#991b1b' : 'var(--primary-strong)',
          minWidth: '240px',
          maxWidth: '380px',
        }}
      >
        {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
        <span className="flex-1 text-sm font-medium">{toast.msg}</span>
        <button onClick={onClose} style={{ opacity: 0.6 }}>
          <XIcon size={14} />
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Excluir', danger = true }) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium">
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: danger ? '#dc2626' : 'var(--primary)',
            color: '#fff',
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}{required && <span style={{ color: 'var(--primary)' }}> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 flex items-center gap-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="skeleton rounded-lg flex-shrink-0" style={{ width: 36, height: 36 }} />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-3.5 rounded" style={{ width: '55%' }} />
        <div className="skeleton h-3 rounded" style={{ width: '40%' }} />
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center anim-fade">
      <div className="mb-4" style={{ color: 'var(--border)' }}>{icon}</div>
      <h3 className="font-serif font-semibold text-lg mb-1" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      {action}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center anim-fade">
      <div className="mb-3" style={{ color: '#dc2626' }}>
        <AlertCircle size={40} />
      </div>
      <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>
        Falha ao carregar dados
      </h3>
      <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--text-muted)' }}>{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-primary"
        style={{ color: 'var(--primary-fg)' }}
      >
        <RefreshCw size={14} /> Tentar novamente
      </button>
    </div>
  );
}
