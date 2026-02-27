import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/axios';
import { normalizeDashboard } from '../utils/normalizers';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash } from 'react-icons/hi';

const COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [categories, setCategories] = useState([]);
    const [risk, setRisk] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await dashboardAPI.get();
            const rawData = response.data.data ? response.data.data : response.data;
            const normalized = normalizeDashboard(rawData);

            if (!normalized) return;

            setSummary({
                totalIncome: normalized.summary.totalIncome,
                totalExpenses: normalized.summary.totalExpense,
                savings: normalized.summary.netBalance,
                savingsRatio: normalized.summary.totalIncome > 0 ? ((normalized.summary.netBalance / normalized.summary.totalIncome) * 100).toFixed(1) : 0,
                expenseRatio: normalized.summary.totalIncome > 0 ? ((normalized.summary.totalExpense / normalized.summary.totalIncome) * 100).toFixed(1) : 0,
            });

            setMonthlyTrend(Object.values(normalized.transactions.reduce((acc, tx) => {
                if (tx.date) {
                    const d = new Date(tx.date);
                    const month = d.toLocaleString('default', { month: 'short' });
                    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
                    if (tx.type === 'CREDIT') acc[month].income += tx.amount;
                    else acc[month].expense += tx.amount;
                }
                return acc;
            }, {})));

            setCategories(Object.entries(normalized.categoryBreakdown).map(
                ([category, amount]) => ({ category, amount })
            ));

            const emiAlert = normalized.alerts.find(a => a.type === 'HIGH_EMI_BURDEN' || a.message?.toLowerCase().includes('emi'));
            setRisk({
                alerts: normalized.alerts,
                emiBurden: emiAlert ? 50 : 15,
            });

        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-dark-200 dark:bg-dark-700 rounded-lg w-48"></div>
                <div className="grid lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="h-96 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                    <div className="h-96 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    // Compute savings trend
    const savingsTrend = monthlyTrend.map(m => ({
        month: m.month,
        savings: (m.income || 0) - (m.expense || 0),
        income: m.income || 0,
        expense: m.expense || 0,
    }));

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="page-header">Analytics</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Detailed financial behavior analysis</p>
            </div>

            {/* Key Ratios */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="stat-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                            <HiOutlineTrendingUp className="text-primary-600 dark:text-primary-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">Savings Ratio</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {summary?.savingsRatio ?? 0}%
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-full h-2 transition-all duration-1000"
                            style={{ width: `${Math.min(Math.max(summary?.savingsRatio ?? 0, 0), 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-danger-50 dark:bg-danger-500/10 rounded-xl">
                            <HiOutlineTrendingDown className="text-danger-600 dark:text-danger-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">Expense Ratio</p>
                            <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                                {summary?.expenseRatio ?? 0}%
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-danger-400 to-danger-600 rounded-full h-2 transition-all duration-1000"
                            style={{ width: `${Math.min(Math.max(summary?.expenseRatio ?? 0, 0), 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-warning-50 dark:bg-warning-500/10 rounded-xl">
                            <HiOutlineCash className="text-warning-600 dark:text-warning-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">EMI Burden</p>
                            <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                                {risk?.emiBurden ?? 0}%
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-warning-400 to-warning-600 rounded-full h-2 transition-all duration-1000"
                            style={{ width: `${Math.min(Math.max(risk?.emiBurden ?? 0, 0), 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Savings Trend Area Chart */}
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Savings Trend</h3>
                    {savingsTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={savingsTrend}>
                                <defs>
                                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                <Area type="monotone" dataKey="savings" stroke="#6366f1" fill="url(#savingsGrad)" strokeWidth={2} name="Savings" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-72 text-dark-400">
                            <p>Upload documents to see savings trends</p>
                        </div>
                    )}
                </div>

                {/* Income vs Expense Comparison */}
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Income vs Expenses</h3>
                    {monthlyTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                <Legend />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-72 text-dark-400">
                            <p>Upload documents to see comparison</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Spending by Category</h3>
                    {categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={categories}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    innerRadius={60}
                                    paddingAngle={3}
                                >
                                    {categories.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-80 text-dark-400">
                            <p>No spending data available</p>
                        </div>
                    )}
                </div>

                {/* Category List */}
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Category Details</h3>
                    {categories.length > 0 ? (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto">
                            {categories
                                .sort((a, b) => (b.amount || 0) - (a.amount || 0))
                                .map((cat, i) => {
                                    const total = categories.reduce((sum, c) => sum + (c.amount || 0), 0);
                                    const percent = total > 0 ? ((cat.amount / total) * 100).toFixed(1) : 0;
                                    return (
                                        <div key={i} className="flex items-center gap-4">
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium text-dark-900 dark:text-white text-sm">{cat.category}</span>
                                                    <span className="text-sm font-bold text-dark-700 dark:text-dark-300">{formatCurrency(cat.amount)}</span>
                                                </div>
                                                <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-1.5">
                                                    <div
                                                        className="rounded-full h-1.5 transition-all duration-700"
                                                        style={{ width: `${percent}%`, backgroundColor: COLORS[i % COLORS.length] }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-dark-400 mt-1">{percent}% of total</p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-80 text-dark-400">
                            <p>No category data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
