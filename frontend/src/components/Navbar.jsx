import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, UploadCloud, LayoutDashboard, History as HistoryIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload', path: '/upload', icon: UploadCloud },
    { name: 'History', path: '/history', icon: HistoryIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-xl mr-3 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                MediGuide<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">AI</span>
              </span>
            </Link>
          </motion.div>

          {/* Nav Links */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex space-x-1 mr-4">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (
                      <Link 
                        key={link.name}
                        to={link.path} 
                        className={`relative px-4 py-2 rounded-xl text-sm font-semibold flex items-center group transition-colors ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        {link.name}
                        {isActive && (
                          <motion.div 
                            layoutId="navbar-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
                
                {/* User Avatar & Logout */}
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">Patient Portal</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 flex items-center justify-center border border-indigo-100/50 shadow-inner">
                    <span className="text-primary font-bold text-sm tracking-widest">{user.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <Link to="/login" className="text-slate-600 hover:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-primary transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
