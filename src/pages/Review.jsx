import { useState, useEffect } from 'react';
import { transactionAPI } from '../api/axios';
import { HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlinePencilAlt, HiOutlineExclamation } from 'react-icons/hi';
import OverrideModal from '../components/modals/OverrideModal';
import toast from 'react-hot-toast';
import { useAlerts } from '../context/AlertContext';

const Review = () => {
    const [reviewItems, setReviewItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { fetchAlerts } = useAlerts();

    const fetchReviewItems = async () => {
        setLoading(true);
        try {
            const response = await transactionAPI.getReview();
            const rawData = response.data.data ? response.data.data : response.data;
            setReviewItems(rawData || []);
        } catch (error) {
            console.error('Failed to fetch review items:', error);
            toast.error('Failed to load transactions for review');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewItems();
    }, []);

    const handleQuickConfirm = async (item) => {
        try {
            await transactionAPI.override(item.id, {
                category: item.category,
                merchant: item.merchant,
                amount: item.amount
            });
            toast.success('Transaction confirmed');
            fetchReviewItems();
            fetchAlerts(); // Update dashboard counts
        } catch (error) {
            toast.error('Failed to confirm transaction');
        }
    };

    const getConfidenceColor = (score) => {
        if (score >= 0.9) return 'text-success-500';
        if (score >= 0.7) return 'text-warning-500';
        return 'text-danger-500';
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-dark-200 dark:bg-dark-700 rounded-lg w-64"></div>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="page-header flex items-center gap-3">
                    <HiOutlineShieldCheck className="text-primary-500" />
                    Manual Review Center
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-2">
                    Review and confirm transactions where Parsing confidence is below 80%.
                </p>
            </div>

            {reviewItems.length > 0 ? (
                <div className="grid gap-4">
                    {reviewItems.map((item) => (
                        <div key={item.id} className="glass-card-solid p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary-500/50 transition-all">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-dark-900 dark:text-white">
                                        {item.merchant}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-500">
                                        {item.transactionDate ? new Date(item.transactionDate).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-dark-500">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium">Detected Category:</span>
                                        <span className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                                            {item.category || 'OTHERS'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium">Amount:</span>
                                        <span className="text-dark-900 dark:text-white font-bold">
                                            ₹{item.amount?.toLocaleString() || '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <HiOutlineExclamation className={getConfidenceColor(item.confidenceScore)} />
                                        <span className="font-medium">Confidence:</span>
                                        <span className={`font-bold ${getConfidenceColor(item.confidenceScore)}`}>
                                            {item.confidenceScore != null ? `${(item.confidenceScore * 100).toFixed(0)}%` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleQuickConfirm(item)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-success-500 hover:bg-success-600 text-white font-semibold transition-all shadow-lg shadow-success-500/20"
                                >
                                    <HiOutlineCheckCircle size={20} />
                                    Quick Confirm
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTransaction({
                                            id: item.id,
                                            merchant: item.merchant,
                                            category: item.category,
                                            amount: item.amount,
                                            date: item.transactionDate
                                        });
                                        setIsModalOpen(true);
                                    }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-white font-semibold hover:bg-dark-200 dark:hover:bg-dark-700 transition-all border border-dark-200 dark:border-dark-700"
                                >
                                    <HiOutlinePencilAlt size={20} />
                                    Correct Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card-solid p-16 text-center">
                    <div className="w-20 h-20 bg-success-50 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineCheckCircle className="text-success-500" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">All Cleared!</h2>
                    <p className="text-dark-500 dark:text-dark-400 max-w-md mx-auto">
                        No transactions currently require human review. Your AI categorization engine is working smoothly.
                    </p>
                </div>
            )}

            {isModalOpen && selectedTransaction && (
                <OverrideModal
                    transaction={selectedTransaction}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        fetchReviewItems();
                        fetchAlerts();
                    }}
                />
            )}
        </div>
    );
};

export default Review;
