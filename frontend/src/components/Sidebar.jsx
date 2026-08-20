import { NavLink } from 'react-router-dom';
import { IconDashboard, IconUsers, IconBuilding, IconBadge } from './icons';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/employees', label: 'Employees', icon: IconUsers },
  { to: '/departments', label: 'Departments', icon: IconBuilding },
  { to: '/roles', label: 'Roles', icon: IconBadge },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">PD</div>
          <div className="sidebar-brand-text">
            <strong>PeopleDesk</strong>
            <span>Employee Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Workspace</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">Internal HR Tool · v1.0</div>
      </aside>
    </>
  );
}
