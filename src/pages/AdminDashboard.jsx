import { useState, useEffect } from 'react';
import { adminAPI } from '../api/axios';
import { HiOutlineUsers, HiOutlineDatabase, HiOutlineChip, HiOutlineShieldCheck, HiOutlineTrendingUp } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAPI.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
                toast.error('Failed to load system statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-dark-200 dark:bg-dark-700 rounded-lg w-64"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: HiOutlineUsers,
            color: 'text-primary-500',
            bg: 'bg-primary-50 dark:bg-primary-900/20'
        },
        {
            title: 'Transactions',
            value: stats?.totalTransactions || 0,
            icon: HiOutlineDatabase,
            color: 'text-success-500',
            bg: 'bg-success-50 dark:bg-success-900/20'
        },
        {
            title: 'System Logs',
            value: stats?.totalLogs || 0,
            icon: HiOutlineChip,
            color: 'text-warning-500',
            bg: 'bg-warning-50 dark:bg-warning-900/20'
        },
        {
            title: 'System Health',
            value: `${((stats?.systemHealth || 0) * 100).toFixed(1)}%`,
            icon: HiOutlineShieldCheck,
            color: 'text-info-500',
            bg: 'bg-info-50 dark:bg-info-900/20'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="page-header flex items-center gap-3">
                    <HiOutlineChip className="text-primary-500" />
                    System Overview
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-2">
                    Monitor system performance and user activity in real-time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="glass-card-solid p-6 space-y-4 hover:border-primary-500/50 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                            <HiOutlineTrendingUp className="text-success-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-dark-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mt-1 group-hover:text-primary-500 transition-colors">
                                {card.value.toLocaleString()}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card-solid p-6">
                    <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Server Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-200 dark:border-dark-800">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-success-500 animate-pulse"></div>
                                <span className="font-medium">API Server</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-success-500/10 text-success-500 font-bold uppercase tracking-wider">Online</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-200 dark:border-dark-800">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-success-500 animate-pulse"></div>
                                <span className="font-medium">PostgreSQL Database</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-success-500/10 text-success-500 font-bold uppercase tracking-wider">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-200 dark:border-dark-800">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
                                <span className="font-medium">Vite Dev Server</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-primary-500/10 text-primary-500 font-bold uppercase tracking-wider">Active</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card-solid p-6">
                    <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Environment Values</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-dark-500">Node Environment</span>
                            <span className="font-mono text-dark-900 dark:text-white">development</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-dark-500">OS Platform</span>
                            <span className="font-mono text-dark-900 dark:text-white">Windows</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-dark-500">Database Engine</span>
                            <span className="font-mono text-dark-900 dark:text-white">Hibernate / JPA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
