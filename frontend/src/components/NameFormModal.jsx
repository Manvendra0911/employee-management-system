import { useEffect, useState } from 'react';

export default function NameFormModal({ open, title, nameLabel, initialValues, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialValues?.name || '');
      setDescription(initialValues?.description || '');
      setError('');
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(`${nameLabel} is required`);
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-title">{title}</div>
        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>
              {nameLabel} <span className="required">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={error ? 'has-error' : ''}
              autoFocus
            />
            {error && <div className="field-error">{error}</div>}
          </div>
          <div className="field" style={{ marginBottom: 6 }}>
            <label>Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          </div>
          <div className="modal-actions" style={{ marginTop: 18 }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
