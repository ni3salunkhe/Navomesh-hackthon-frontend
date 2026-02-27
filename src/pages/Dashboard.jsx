import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../api/axios';
import { normalizeDashboard } from '../utils/normalizers';
import {
    HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash,
    HiOutlineShieldCheck, HiOutlineExclamation, HiOutlineRefresh
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CATEGORY_COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recurring, setRecurring] = useState([]);
    const [risk, setRisk] = useState(null);
    const [loading, setLoading] = useState(true);

    const calculateRiskScore = (data) => {
        const income = data.summary.totalIncome;
        const expense = data.summary.totalExpense;

        if (income === 0) return 50;

        const savingsRatio = (income - expense) / income;

        if (savingsRatio >= 0.4) return 90;
        if (savingsRatio >= 0.25) return 75;
        if (savingsRatio >= 0.1) return 60;
        return 40;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await dashboardAPI.get();
            console.log("Raw Backend Response:", response.data);

            // Check if backend wraps response in { success: true, data: {...} } or returns DTO directly
            const rawData = response.data.data ? response.data.data : response.data;
            const normalized = normalizeDashboard(rawData);

            if (!normalized) return;

            setSummary({
                totalIncome: normalized.summary.totalIncome,
                totalExpenses: normalized.summary.totalExpense,
                savings: normalized.summary.netBalance,
                riskScore: calculateRiskScore(normalized)
            });

            setCategories(
                Object.entries(normalized.categoryBreakdown).map(
                    ([category, amount]) => ({ category, amount })
                )
            );

            setRecurring(normalized.recurring);
            setRisk({ alerts: normalized.alerts });

            // Build monthly trend from normalized transactions
            const trendMap = {};
            normalized.transactions.forEach(tx => {
                if (tx.date) {
                    const d = new Date(tx.date);
                    const month = d.toLocaleString('default', { month: 'short' });
                    if (!trendMap[month]) trendMap[month] = { month, income: 0, expense: 0 };

                    if (tx.type === 'CREDIT') trendMap[month].income += tx.amount;
                    else trendMap[month].expense += tx.amount;
                }
            });

            setMonthlyTrend(Object.values(trendMap));

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (val) => {
        if (val == null) return '₹0';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const getRiskColor = (score) => {
        if (score >= 80) return 'text-accent-500';
        if (score >= 60) return 'text-warning-500';
        return 'text-danger-500';
    };

    const getRiskLabel = (score) => {
        if (score >= 80) return 'Healthy';
        if (score >= 60) return 'Moderate';
        return 'At Risk';
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-dark-200 dark:bg-dark-700 rounded-lg w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-36 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                    <div className="h-80 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Income',
            value: formatCurrency(summary?.totalIncome),
            icon: HiOutlineTrendingUp,
            gradient: 'from-accent-500 to-emerald-600',
            bg: 'bg-accent-50 dark:bg-accent-900/20',
            textColor: 'text-accent-600 dark:text-accent-400',
        },
        {
            title: 'Total Expenses',
            value: formatCurrency(summary?.totalExpenses),
            icon: HiOutlineTrendingDown,
            gradient: 'from-danger-500 to-rose-600',
            bg: 'bg-danger-50 dark:bg-danger-500/10',
            textColor: 'text-danger-600 dark:text-danger-400',
        },
        {
            title: 'Savings',
            value: formatCurrency(summary?.savings),
            icon: HiOutlineCash,
            gradient: 'from-primary-500 to-indigo-600',
            bg: 'bg-primary-50 dark:bg-primary-900/20',
            textColor: 'text-primary-600 dark:text-primary-400',
        },
        {
            title: 'Financial Health',
            value: `${summary?.riskScore ?? 0}/100`,
            subtitle: getRiskLabel(summary?.riskScore ?? 0),
            icon: HiOutlineShieldCheck,
            gradient: 'from-amber-500 to-orange-600',
            bg: 'bg-warning-50 dark:bg-warning-500/10',
            textColor: getRiskColor(summary?.riskScore ?? 0),
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Dashboard</h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">Your financial overview at a glance</p>
                </div>
                <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
                    <HiOutlineRefresh size={18} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={card.textColor} size={24} />
                            </div>
                            <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl opacity-20`}></div>
                        </div>
                        <p className="text-sm font-medium text-dark-500 dark:text-dark-400">{card.title}</p>
                        <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>{card.value}</p>
                        {card.subtitle && (
                            <p className={`text-sm font-medium mt-1 ${card.textColor}`}>{card.subtitle}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Monthly Trend Bar Chart */}
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Monthly Income vs Expenses</h3>
                    {monthlyTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255,255,255,0.95)',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-72 text-dark-400">
                            <p>Upload documents to see monthly trends</p>
                        </div>
                    )}
                </div>

                {/* Category Pie Chart */}
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Category-wise Spending</h3>
                    {categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categories}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    paddingAngle={3}
                                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {categories.map((_, i) => (
                                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-72 text-dark-400">
                            <p>Upload documents to see category breakdown</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recurring Expenses Preview */}
                <div className="glass-card-solid p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-dark-900 dark:text-white">Recurring Expenses</h3>
                        <button
                            onClick={() => navigate('/recurring')}
                            className="text-xs font-bold text-primary-500 hover:underline"
                        >
                            View Analysis
                        </button>
                    </div>
                    {recurring.length > 0 ? (
                        <div className="space-y-3">
                            {recurring.slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-xl border border-transparent hover:border-primary-500/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-100/50 dark:bg-primary-900/30 rounded-lg">
                                            <HiOutlineRefresh className="text-primary-600 dark:text-primary-400" size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-dark-900 dark:text-white truncate max-w-[150px] text-sm">{item.merchant}</p>
                                            <p className="text-[10px] text-dark-400">Every {item.intervalDays} days</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-dark-900 dark:text-white text-sm">{formatCurrency(item.averageAmount)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32 text-dark-400">
                            <p>No recurring expenses detected</p>
                        </div>
                    )}
                </div>

                {/* Enhanced Actionable Alerts */}
                <div className="glass-card-solid p-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Risk Alerts</h3>
                    <div className="space-y-4">
                        {risk?.alerts && risk.alerts.length > 0 ? (
                            risk.alerts
                                .sort((a, b) => {
                                    const priority = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                                    return priority[a.severity] - priority[b.severity];
                                })
                                .map((alert, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            if (alert.relatedCategory) {
                                                navigate(`/transactions?category=${alert.relatedCategory}`);
                                            } else {
                                                navigate('/transactions');
                                            }
                                        }}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:border-primary-500/20 ${alert.severity === 'HIGH'
                                            ? 'bg-danger-50 dark:bg-danger-500/10 border-danger-100 dark:border-danger-500/20'
                                            : 'bg-warning-50 dark:bg-warning-500/5 border-warning-100 dark:border-warning-500/20'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg mt-0.5 ${alert.severity === 'HIGH' ? 'bg-danger-100 text-danger-600' : 'bg-warning-100 text-warning-600'
                                            }`}>
                                            <HiOutlineExclamation size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`font-bold text-sm ${alert.severity === 'HIGH' ? 'text-danger-700 dark:text-danger-400' : 'text-warning-700 dark:text-warning-400'
                                                    }`}>
                                                    {alert.type || 'Alert'}
                                                </p>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${alert.severity === 'HIGH' ? 'bg-danger-200 text-danger-800' : 'bg-warning-200 text-warning-800'
                                                    }`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed mb-1">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-dark-400 text-center">
                                <HiOutlineShieldCheck size={48} className="mb-4 opacity-20 text-success-500" />
                                <p className="text-sm font-medium">Financial health is stable</p>
                                <p className="text-xs">No critical alerts detected at this time.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
