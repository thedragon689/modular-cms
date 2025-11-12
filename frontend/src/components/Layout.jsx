import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  ShoppingBag,
  UserCircle,
  User,
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/blog', icon: BookOpen, label: 'Blog' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/pages', icon: FileText, label: 'Pagine' },
    { path: '/media', icon: Image, label: 'Media' },
    { path: '/clients', icon: UserCircle, label: 'Clienti' },
    { path: '/settings', icon: Settings, label: 'Impostazioni' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-64 glass-strong p-6 fixed h-screen z-40"
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            Modular CMS
          </h1>
          <ThemeToggle />
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-accent/20 text-accent border-l-4 border-accent'
                      : 'hover:bg-white/10 text-gray-300'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-accent font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <NavLink
            to="/profile"
            className="w-full btn-glass flex items-center gap-3 justify-center mb-2"
          >
            <User size={18} />
            <span>Profilo</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full btn-glass flex items-center gap-3 justify-center"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="flex flex-col w-64 glass-strong p-6 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Modular CMS
              </h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-accent/20 text-accent border-l-4 border-accent'
                          : 'hover:bg-white/10 text-gray-300'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/20">
              <NavLink
                to="/profile"
                onClick={() => setSidebarOpen(false)}
                className="w-full btn-glass flex items-center gap-3 justify-center mb-2"
              >
                <User size={18} />
                <span>Profilo</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full btn-glass flex items-center gap-3 justify-center"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden glass p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            Modular CMS
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-accent font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 pb-24">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="glass-strong border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} Modular CMS. Tutti i diritti riservati.</p>
              </div>
              <div className="flex gap-6 text-sm">
                <a 
                  href="/privacy-policy" 
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms-of-service" 
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  Termini di Servizio
                </a>
                <a 
                  href="https://github.com/thedragon689/modular-cms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;

