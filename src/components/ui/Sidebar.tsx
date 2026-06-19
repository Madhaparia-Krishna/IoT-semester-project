import React from 'react';
import { Logo } from '../logo/Logo';
import {
  Zap,
  Box,
  Cpu,
  Layers,
  LayoutDashboard,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPage: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard';
  onNavigate: (page: 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard') => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isAuthenticated = false,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { id: 'schematic', label: 'Schematic', icon: Zap },
    { id: 'pcb', label: 'PCB Design', icon: Box },
    { id: 'wokwi', label: 'Simulation', icon: Cpu },
    { id: 'physical', label: 'Physical', icon: Layers },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page as 'home' | 'schematic' | 'pcb' | 'wokwi' | 'physical' | 'dashboard');
    setIsOpen(false);
  };

  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar Backdrop (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-bg-space to-[#0a0c12] border-r border-white/10 backdrop-blur-md z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Logo size="md" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer - Logout Button */}
        {isAuthenticated && onLogout && (
          <div className="border-t border-white/5 p-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 font-medium border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Shift */}
      <div className="lg:ml-64" />
    </>
  );
};

export default Sidebar;
