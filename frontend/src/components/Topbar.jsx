import { IconMenu } from './icons';

export default function Topbar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle navigation">
          <IconMenu />
        </button>
        <div className="topbar-title">{title}</div>
      </div>

      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-user-avatar">HR</div>
          <div className="topbar-user-info">
            <strong>HR Admin</strong>
            <span>Infosys Demo Workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
}
