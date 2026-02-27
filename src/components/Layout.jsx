import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import {
    HiOutlineHome, HiOutlineCloudUpload, HiOutlineCreditCard,
    HiOutlineChartBar, HiOutlineUser, HiOutlineLogout,
    HiOutlineSun, HiOutlineMoon, HiOutlineMenuAlt2, HiOutlineX,
    HiOutlineShieldCheck, HiOutlineCurrencyRupee, HiOutlineRefresh,
    HiOutlineBell
} from 'react-icons/hi';

const navItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/upload', icon: HiOutlineCloudUpload, label: 'Upload' },
    { path: '/transactions', icon: HiOutlineCreditCard, label: 'Transactions' },
    { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { path: '/budgets', icon: HiOutlineCurrencyRupee, label: 'Budgets' },
    { path: '/recurring', icon: HiOutlineRefresh, label: 'Recurring' },
    { path: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { unreadCount } = useAlerts();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 
        bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-700
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="p-6 border-b border-dark-200 dark:border-dark-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-lg font-bold">E</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-dark-900 dark:text-white">ExpenseIQ</h1>
                                <p className="text-xs text-dark-400">Smart Tracker</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                onClick={() => navigate('/dashboard')}
                                className="relative p-2 text-dark-500 hover:text-primary-500 cursor-pointer transition-colors lg:hidden"
                            >
                                <HiOutlineBell size={22} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-dark-900">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
                            >
                                <HiOutlineX size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {(() => {
                        const displayNavItems = (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')
                            ? [...navItems, { path: '/admin', icon: HiOutlineShieldCheck, label: 'Admin Logs' }]
                            : navItems;

                        return displayNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        ));
                    })()}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-dark-200 dark:border-dark-700 space-y-3">
                    {/* Notifications Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-dark-500 dark:text-dark-400
                       hover:bg-dark-100 dark:hover:bg-dark-800 transition-all duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <HiOutlineBell size={20} />
                            <span className="font-medium">Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                            <span className="bg-danger-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-500 dark:text-dark-400
                       hover:bg-dark-100 dark:hover:bg-dark-800 transition-all duration-200"
                    >
                        {darkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
                        <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    {/* User Info & Logout */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-dark-400 hover:text-danger-500 transition-colors"
                            title="Logout"
                        >
                            <HiOutlineLogout size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen bg-dark-50 dark:bg-dark-950">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-200 dark:border-dark-700 px-6 py-4 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white"
                    >
                        <HiOutlineMenuAlt2 size={24} />
                    </button>
                </header>

                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
