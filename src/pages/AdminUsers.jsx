import { useState, useEffect } from 'react';
import { adminAPI } from '../api/axios';
import { HiOutlineUserGroup, HiOutlineSearch, HiOutlineDotsVertical, HiOutlineShieldCheck, HiOutlineUserRemove, HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load user list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await adminAPI.updateUserStatus(userId, newStatus);
            toast.success(`User status updated to ${newStatus}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-dark-200 dark:bg-dark-700 rounded-lg w-48"></div>
                <div className="h-64 bg-dark-200 dark:bg-dark-700 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="page-header flex items-center gap-3">
                        <HiOutlineUserGroup className="text-primary-500" />
                        User Management
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-2">
                        View and manage application user accounts and permissions.
                    </p>
                </div>

                <div className="relative">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-80 pl-12 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="glass-card-solid overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-dark-200 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-900/50">
                                <th className="px-6 py-4 text-xs font-bold text-dark-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-dark-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-dark-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-dark-500 uppercase tracking-wider">Joined At</th>
                                <th className="px-6 py-4 text-xs font-bold text-dark-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-200 dark:divide-dark-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-dark-50/50 dark:hover:bg-dark-900/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                                                {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-dark-900 dark:text-white">{user.fullName || 'Anonymous'}</div>
                                                <div className="text-sm text-dark-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wider uppercase ${user.role === 'ADMIN'
                                                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                                : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold leading-none ${user.status === 'ACTIVE' ? 'text-success-500' :
                                                user.status === 'SUSPENDED' ? 'text-danger-500' : 'text-dark-400'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-success-500' :
                                                    user.status === 'SUSPENDED' ? 'bg-danger-500' : 'bg-dark-400'
                                                }`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 outline-none">
                                            {user.status === 'ACTIVE' ? (
                                                <button
                                                    onClick={() => handleStatusUpdate(user.id, 'SUSPENDED')}
                                                    className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-all"
                                                    title="Suspend User"
                                                >
                                                    <HiOutlineUserRemove size={20} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusUpdate(user.id, 'ACTIVE')}
                                                    className="p-2 text-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 rounded-lg transition-all"
                                                    title="Activate User"
                                                >
                                                    <HiOutlineCheckCircle size={20} />
                                                </button>
                                            )}
                                            <button className="p-2 text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-all">
                                                <HiOutlineDotsVertical size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
