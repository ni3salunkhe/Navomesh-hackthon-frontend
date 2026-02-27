import { useState, useEffect } from 'react';
import { budgetAPI } from '../api/axios';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCurrencyRupee, HiOutlineExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'OTHERS'];

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBudget, setNewBudget] = useState({ category: 'FOOD', limitAmount: '' });

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const response = await budgetAPI.getAll();
            setBudgets(response.data || []);
        } catch (error) {
            console.error('Failed to fetch budgets:', error);
            toast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleCreateBudget = async (e) => {
        e.preventDefault();
        try {
            await budgetAPI.create({
                category: newBudget.category,
                limitAmount: Number(newBudget.limitAmount)
            });
            toast.success('Budget created successfully');
            setNewBudget({ category: 'FOOD', limitAmount: '' });
            fetchBudgets();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create budget');
        }
    };

    const handleDeleteBudget = async (id) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) return;
        try {
            await budgetAPI.delete(id);
            toast.success('Budget deleted');
            fetchBudgets();
        } catch (error) {
            toast.error('Failed to delete budget');
        }
    };

    const getStatusColor = (percent) => {
        if (percent > 100) return 'bg-danger-500';
        if (percent > 80) return 'bg-warning-500';
        return 'bg-success-500';
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="page-header">Budget Management</h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">Set and track category-wise monthly limits</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Create Budget Card */}
                <div className="glass-card-solid p-6 h-fit">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6 flex items-center gap-2">
                        <HiOutlinePlus className="text-primary-500" size={20} />
                        Create New Budget
                    </h3>
                    <form onSubmit={handleCreateBudget} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Category</label>
                            <select
                                value={newBudget.category}
                                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                className="input-field w-full"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Monthly Limit</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-dark-400">₹</span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    value={newBudget.limitAmount}
                                    onChange={(e) => setNewBudget({ ...newBudget, limitAmount: e.target.value })}
                                    className="input-field w-full pl-7"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full">Save Budget</button>
                    </form>
                </div>

                {/* Budget List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="glass-card-solid p-6 animate-pulse space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-dark-100 dark:bg-dark-800 rounded-xl"></div>
                            ))}
                        </div>
                    ) : budgets.length > 0 ? (
                        budgets.map((budget) => {
                            const percent = (budget.currentSpent / budget.limitAmount) * 100;
                            const isExceeded = percent > 100;

                            return (
                                <div key={budget.id} className="glass-card-solid p-6 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                                <HiOutlineCurrencyRupee className="text-primary-600 dark:text-primary-400" size={22} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-dark-900 dark:text-white capitalize">{budget.category}</h3>
                                                <p className="text-xs text-dark-400">Limit: {formatCurrency(budget.limitAmount)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBudget(budget.id)}
                                            className="p-2 text-dark-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-all"
                                        >
                                            <HiOutlineTrash size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dark-600 dark:text-dark-400">Spent: {formatCurrency(budget.currentSpent)}</span>
                                            <span className={`font-bold ${isExceeded ? 'text-danger-500' : 'text-dark-900 dark:text-white'}`}>
                                                {percent.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-dark-100 dark:bg-dark-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-1000 ${getStatusColor(percent)}`}
                                                style={{ width: `${Math.min(percent, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {isExceeded && (
                                        <div className="mt-4 flex items-center gap-2 text-xs text-danger-500 font-medium bg-danger-50 dark:bg-danger-500/10 p-2 rounded-lg">
                                            <HiOutlineExclamationCircle size={16} />
                                            Budget limit exceeded for this month
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="glass-card-solid p-12 text-center text-dark-400">
                            <HiOutlineCurrencyRupee size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No budgets set yet. Create one to start tracking your spend.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budgets;
