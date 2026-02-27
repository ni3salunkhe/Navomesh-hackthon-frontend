import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dashboardAPI } from '../api/axios';
import { normalizeDashboard } from '../utils/normalizers';
import OverrideModal from '../components/modals/OverrideModal';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineArrowUp, HiOutlineArrowDown, HiOutlinePencilAlt } from 'react-icons/hi'; import { HiOutlinePencil } from 'react-icons/hi';

const CATEGORY_BADGES = {
    FOOD: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    SHOPPING: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    TRAVEL: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    PAYMENTS: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    LOANS: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    UTILITIES: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ENTERTAINMENT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    HEALTH: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    SALARY: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    INVESTMENT: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    OTHERS: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await dashboardAPI.get();
            const rawData = response.data.data ? response.data.data : response.data;
            const normalized = normalizeDashboard(rawData);

            if (normalized) {
                setTransactions(normalized.transactions);
                setFilteredTransactions(normalized.transactions);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...transactions];

        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }

        if (categoryFilter !== 'ALL') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1);
    }, [searchTerm, typeFilter, categoryFilter, transactions]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val || 0);
    };

    const categories = [...new Set(transactions.map(t => t.category))].sort();
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedData = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-dark-200 dark:bg-dark-700 rounded-lg w-48"></div>
                <div className="h-12 bg-dark-200 dark:bg-dark-700 rounded-xl"></div>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 bg-dark-200 dark:bg-dark-700 rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="page-header">Transactions</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">
                    {transactions.length} total transactions
                </p>
            </div>

            {/* Filters */}
            <div className="glass-card-solid p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                    <input
                        id="transaction-search"
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-11"
                    />
                </div>
                <select
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="input-field w-full md:w-40"
                >
                    <option value="ALL">All Types</option>
                    <option value="CREDIT">Credit</option>
                    <option value="DEBIT">Debit</option>
                </select>
                <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="input-field w-full md:w-44"
                >
                    <option value="ALL">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="glass-card-solid overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-200 dark:border-dark-700">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Date</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Description</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Type</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Amount</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((t, i) => (
                                    <tr key={t.id || i} className="border-b border-dark-100 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300 whitespace-nowrap">
                                            {t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-900 dark:text-white font-medium max-w-xs truncate">
                                            {t.merchant || t.rawDescription || 'Transaction'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${CATEGORY_BADGES[t.category] || CATEGORY_BADGES.OTHERS}`}>
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {t.type === 'CREDIT' ? (
                                                    <HiOutlineArrowUp className="text-accent-500" size={14} />
                                                ) : (
                                                    <HiOutlineArrowDown className="text-danger-500" size={14} />
                                                )}
                                                <span className={`text-sm font-medium ${t.type === 'CREDIT' ? 'text-accent-600 dark:text-accent-400' : 'text-danger-600 dark:text-danger-400'
                                                    }`}>
                                                    {t.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === 'CREDIT' ? 'text-accent-600 dark:text-accent-400' : 'text-danger-600 dark:text-danger-400'
                                            }`}>
                                            {t.type === 'CREDIT' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedTransaction(t);
                                                    setIsOverrideModalOpen(true);
                                                }}
                                                className="p-1.5 text-dark-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-all"
                                                title="Override Transaction"
                                            >
                                                <HiOutlinePencil size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-dark-400">
                                        {transactions.length === 0
                                            ? 'No transactions yet. Upload a document to get started.'
                                            : 'No transactions match your filters.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-dark-200 dark:border-dark-700">
                        <p className="text-sm text-dark-400">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isOverrideModalOpen && selectedTransaction && (
                <OverrideModal
                    transaction={selectedTransaction}
                    onClose={() => setIsOverrideModalOpen(false)}
                    onSuccess={fetchTransactions}
                />
            )}
        </div>
    );
};

export default Transactions;
