import { NavLink } from 'react-router-dom';
import { useAnalysis } from '../../context/AnalysisContext';

const navItems = [
  ['/', '总体概览'],
  ['/map', '地理路线'],
  ['/events', '八十一难'],
  ['/characters', '人物关系'],
  ['/text', '词频情感'],
];

export default function Navbar() {
  const { resetFilters } = useAnalysis();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand" aria-label="返回总体概览">
        <span className="brand-seal">迹</span>
        <span>
          <strong>西游迹</strong>
          <small>Journey to the West Visual Analytics</small>
        </span>
      </NavLink>

      <nav className="nav-links" aria-label="主导航">
        {navItems.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button className="ghost-button" type="button" onClick={resetFilters}>
        重置筛选
      </button>
    </header>
  );
}
