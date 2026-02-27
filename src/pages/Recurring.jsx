import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/axios';
import { normalizeDashboard } from '../utils/normalizers';
import { HiOutlineRefresh, HiOutlineTrendingDown, HiOutlineShieldCheck, HiOutlineInformationCircle } from 'react-icons/hi';

const Recurring = () => {
    const [recurring, setRecurring] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecurring = async () => {
        setLoading(true);
        try {
            const response = await dashboardAPI.get();
            const normalized = normalizeDashboard(response.data);
            setRecurring(normalized?.recurring || []);
        } catch (error) {
            console.error('Failed to fetch recurring payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecurring();
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const totalMonthlyBurden = recurring.reduce((sum, item) => sum + item.averageAmount, 0);

    if (loading) {
        return <div className="animate-pulse space-y-6">
            <div className="h-8 bg-dark-200 dark:bg-dark-700 rounded w-48"></div>
            <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>)}
            </div>
            <div className="h-96 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
        </div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="page-header">Recurring Payments</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Subscriptions and repeating expenses detected from your statements</p>
            </div>

            {/* Burden Summary */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card-solid p-6 bg-primary-500/5 border-primary-500/20">
                    <p className="text-sm text-dark-400 mb-1">Total Monthly Burden</p>
                    <p className="text-3xl font-bold text-primary-500">{formatCurrency(totalMonthlyBurden)}</p>
                    <p className="text-xs text-dark-500 mt-2 flex items-center gap-1">
                        <HiOutlineInformationCircle /> Expected billing next 30 days
                    </p>
                </div>
                <div className="glass-card-solid p-6">
                    <p className="text-sm text-dark-400 mb-1">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-dark-900 dark:text-white">{recurring.length}</p>
                </div>
                <div className="glass-card-solid p-6">
                    <p className="text-sm text-dark-400 mb-1">Avg. Confidence</p>
                    <p className="text-3xl font-bold text-accent-500">
                        {(recurring.reduce((sum, r) => sum + r.confidence, 0) / (recurring.length || 1)).toFixed(0)}%
                    </p>
                </div>
            </div>

            <div className="glass-card-solid overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-200 dark:border-dark-700">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Merchant</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Avg. Amount</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Interval</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Confidence</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                            {recurring.length > 0 ? (
                                recurring.map((item, i) => (
                                    <tr key={i} className="hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-dark-100 dark:bg-dark-700 rounded-lg">
                                                    <HiOutlineRefresh className="text-primary-500" size={18} />
                                                </div>
                                                <span className="font-medium text-dark-900 dark:text-white">{item.merchant}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-dark-900 dark:text-white">
                                            {formatCurrency(item.averageAmount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300">
                                            Every {item.intervalDays} days
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-dark-200 dark:bg-dark-700 rounded-full h-1.5 min-w-[60px]">
                                                    <div
                                                        className="bg-accent-500 h-1.5 rounded-full"
                                                        style={{ width: `${item.confidence}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-dark-400">{item.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${item.confidence > 80 ? 'badge-success' : 'bg-dark-100 text-dark-600'}`}>
                                                {item.confidence > 80 ? 'Verified' : 'Predictive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-dark-400">
                                        <HiOutlineShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No recurring payments detected yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Recurring;
