import React from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../../types';

interface HeaderProps {
  currentUser: UserRole;
  onUserChange: (user: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onUserChange }) => {
  const users: UserRole[] = ['Steve', 'Ryan', 'Konnor', 'Nick'];

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold">Deep See AI</div>
            <div className="text-sm bg-blue-700 px-3 py-1 rounded">
              Unified Prioritization Dashboard
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Logged in as:</span>
              <select
                value={currentUser}
                onChange={(e) => onUserChange(e.target.value as UserRole)}
                className="bg-blue-700 text-white px-3 py-1 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
