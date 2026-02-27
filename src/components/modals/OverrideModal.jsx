import { useState } from 'react';
import { transactionAPI } from '../../api/axios';
import { HiOutlineX, HiOutlineSave } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'HEALTH', 'INVESTMENT', 'OTHERS'];

const OverrideModal = ({ transaction, onClose, onSuccess }) => {
    const [category, setCategory] = useState(transaction.category || 'OTHERS');
    const [merchant, setMerchant] = useState(transaction.merchant || '');
    const [amount, setAmount] = useState(transaction.amount || 0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionAPI.override(transaction.id, {
                category: category,
                merchant: merchant,
                amount: Number(amount)
            });
            toast.success('Transaction updated');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card-solid w-full max-w-md p-6 shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-900 dark:text-white">Override Transaction</h3>
                    <button onClick={onClose} className="p-2 text-dark-400 hover:text-dark-600 dark:hover:text-white transition-colors">
                        <HiOutlineX size={20} />
                    </button>
                </div>

                <div className="mb-6 p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl border border-dark-100 dark:border-dark-700">
                    <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Original Detail</p>
                    <p className="font-medium text-dark-900 dark:text-white">{transaction.merchant}</p>
                    <p className="text-sm text-dark-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Merchant Name</label>
                        <input
                            type="text"
                            value={merchant}
                            onChange={(e) => setMerchant(e.target.value)}
                            className="input-field w-full"
                            placeholder="Merchant Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field w-full"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Amount (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input-field w-full"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300 font-medium hover:bg-dark-50 dark:hover:bg-dark-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <HiOutlineSave size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OverrideModal;
