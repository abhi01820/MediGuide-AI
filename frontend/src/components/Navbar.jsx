import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-primary" />
              <span className="ml-2 font-bold text-xl text-slate-800">MediGuide<span className="text-primary">AI</span></span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md font-medium">Dashboard</Link>
                <Link to="/upload" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md font-medium">Upload Report</Link>
                <Link to="/history" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md font-medium">History</Link>
                <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md font-medium">Login</Link>
                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
