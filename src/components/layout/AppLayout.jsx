import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FilterStatusBar from './FilterStatusBar';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <FilterStatusBar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>西游迹 · 《西游记》多维可视分析系统</span>
        <span>React · D3.js · Visual Analytics</span>
      </footer>
    </div>
  );
}
