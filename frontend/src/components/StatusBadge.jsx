export default function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE';
  return (
    <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
      <span className="badge-dot" />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
