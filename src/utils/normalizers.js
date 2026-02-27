// src/utils/normalizers.js

// Normalize single transaction
export const normalizeTransaction = (t) => ({
    id: t.id,
    date: t.date || t.transactionDate || null,
    merchant: t.merchant || t.normalizedMerchant || t.rawDescription || 'Unknown',
    amount: Number(t.amount || 0),
    type: t.type || t.transactionType || 'DEBIT',
    category: t.category || t.systemCategory || 'OTHERS',
    recurring: Boolean(t.recurringFlag),
    confidence: Number(t.confidence || 0)
});

// Normalize dashboard response
export const normalizeDashboard = (data) => {
    if (!data) return null;

    const transactions = (data.recentTransactions || []).map(normalizeTransaction);

    return {
        summary: {
            totalIncome: Number(data.totalIncome || 0),
            totalExpense: Number(data.totalExpense || 0),
            netBalance: Number(
                data.netBalance ??
                (Number(data.totalIncome || 0) - Number(data.totalExpense || 0))
            )
        },

        transactions,

        categoryBreakdown: data.categoryBreakdown || {},

        recurring: (data.recurringPayments || []).map(r => ({
            merchant: r.merchant,
            averageAmount: Number(r.averageAmount || 0),
            intervalDays: r.intervalDays,
            confidence: Number(r.confidence || 0)
        })),

        alerts: (data.alerts || []).map(a => ({
            type: a.type,
            severity: a.severity || 'MEDIUM',
            message: a.message,
            relatedCategory: a.relatedCategory || a.category || null,
            relatedTransactionId: a.relatedTransactionId || null
        }))
    };
};
