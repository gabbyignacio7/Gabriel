import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', label: 'Executive Summary', icon: '📊' },
    { path: '/sales', label: 'Sales View', icon: '💼' },
    { path: '/management', label: 'Management View', icon: '📈' },
    { path: '/engineering', label: 'Engineering View', icon: '⚙️' },
    { path: '/roadmap', label: 'Product Roadmap', icon: '🗺️' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-8 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p className="mb-2">Quick Stats</p>
          <p>Total Features: 13</p>
          <p>Active Sprints: 2</p>
          <p>Team Capacity: 64 SP</p>
        </div>
      </div>
    </aside>
  );
};
