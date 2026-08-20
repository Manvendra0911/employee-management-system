export function LoadingState({ rows = 5 }) {
  return (
    <div style={{ padding: '4px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="state-block">
      {icon && <div className="state-icon">{icon}</div>}
      <div className="state-title">{title}</div>
      {description && <div className="state-desc">{description}</div>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="state-block">
      <div className="state-title" style={{ color: 'var(--color-danger)' }}>
        {title}
      </div>
      {description && <div className="state-desc">{description}</div>}
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry} style={{ marginTop: 6 }}>
          Try again
        </button>
      )}
    </div>
  );
}
