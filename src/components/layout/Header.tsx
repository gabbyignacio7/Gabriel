import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const navItems = [
    { name: 'Executive Summary', path: '/' },
    { name: 'Sales Pipeline', path: '/sales' },
    { name: 'Engineering', path: '/engineering' },
    { name: 'Product Roadmap', path: '/roadmap' },
    { name: 'Upload Data', path: '/upload' },
  ];

  return (
    <header className="bg-deepsee-primary h-16 px-6 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center">
          {/* DeepSee Logo - using SVG placeholder */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#2563EB"/>
            <path d="M12 20 Q12 14, 20 14 T28 20 Q28 26, 20 26 T12 20" fill="white" fillOpacity="0.9"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
          </svg>
          <span className="ml-3 text-white text-xl font-bold">DeepSee</span>
        </div>
      </Link>

      <nav className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'text-white border-b-2 border-white pb-1'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
