import { NavLink } from "react-router-dom";

const baseUrl = import.meta.env.BASE_URL;
const navItems = [
  ["/", "总体概览"],
  ["/map", "地理路线"],
  ["/events", "八十一难"],
  ["/characters", "人物关系"],
  ["/text", "词频情感"],
];

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand" aria-label="返回总体概览">
        <span className="brand-seal">迹</span>

        <span className="brand-title-wrap">
          <img
            src={`${baseUrl}media/log.png`}
            alt="西游迹"
            className="brand-title-img"
          />
        </span>
      </NavLink>

      <nav className="nav-links" aria-label="主导航">
        {navItems.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
