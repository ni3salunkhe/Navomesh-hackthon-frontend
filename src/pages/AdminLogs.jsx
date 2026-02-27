import { useState, useEffect } from 'react';
import { adminAPI } from '../api/axios';
import { HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getLogs();
            setLogs(response.data || []);
        } catch (error) {
            console.error('Failed to fetch admin logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-dark-200 dark:bg-dark-700 rounded-lg w-48"></div>
                <div className="h-96 bg-dark-200 dark:bg-dark-700 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <HiOutlineShieldCheck className="text-primary-600 dark:text-primary-400" size={28} />
                    </div>
                    <div>
                        <h1 className="page-header">Admin Logs</h1>
                        <p className="text-dark-500 dark:text-dark-400 mt-1">System activity and security events</p>
                    </div>
                </div>
                <button onClick={fetchLogs} className="btn-secondary flex items-center gap-2">
                    <HiOutlineRefresh size={18} />
                    Refresh
                </button>
            </div>

            {/* Logs Table */}
            <div className="glass-card-solid overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-200 dark:border-dark-700">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Timestamp</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Level/Action</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-dark-500 dark:text-dark-400">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <tr key={log.id || i} className="border-b border-dark-100 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300 font-medium whitespace-nowrap">
                                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                {log.action || log.level || 'INFO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-900 dark:text-white">
                                            {log.message || JSON.stringify(log)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center text-dark-400">
                                        No logs available.
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

export default AdminLogs;
