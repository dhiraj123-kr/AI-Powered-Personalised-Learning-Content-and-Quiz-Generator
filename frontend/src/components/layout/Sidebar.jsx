import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  BarChart3,
  Sparkles,
  MessageSquare,
  User,
  Settings,
  ShieldCheck,
  Users,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'AI Notes Gen', path: '/content', icon: FileText },
    { name: 'AI Quiz Gen', path: '/quiz', icon: HelpCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldCheck },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Manage Subjects', path: '/admin/subjects', icon: BookOpen },
  ];

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm'
        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                LearnAI Studio
              </h1>
              <p className="text-[11px] font-medium text-gray-400">Personalized Learning</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Menu
            </p>
            {studentLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={navClass}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-purple-600 mb-2">
                Admin Area
              </p>
              {adminLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={navClass}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'Learner'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
