import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineLogout, HiOutlineCalendar } from 'react-icons/hi';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="page-header">Profile</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Your account information</p>
            </div>

            {/* Profile Card */}
            <div className="glass-card-solid p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
                    <span className="text-white text-3xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">{user?.name || 'User'}</h2>
                <p className="text-dark-400 mt-1">{user?.email || 'No email'}</p>
                <span className="badge-success mt-3 inline-flex">{user?.role || 'USER'}</span>
            </div>

            {/* Details */}
            <div className="glass-card-solid divide-y divide-dark-200 dark:divide-dark-700">
                <div className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <HiOutlineUser className="text-primary-600 dark:text-primary-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-dark-400">Full Name</p>
                        <p className="font-semibold text-dark-900 dark:text-white">{user?.name || 'Not set'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
                        <HiOutlineMail className="text-accent-600 dark:text-accent-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-dark-400">Email Address</p>
                        <p className="font-semibold text-dark-900 dark:text-white">{user?.email || 'Not set'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-warning-50 dark:bg-warning-500/10 rounded-xl">
                        <HiOutlineShieldCheck className="text-warning-600 dark:text-warning-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-dark-400">Role</p>
                        <p className="font-semibold text-dark-900 dark:text-white">{user?.role || 'USER'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <HiOutlineCalendar className="text-purple-600 dark:text-purple-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-dark-400">Member Since</p>
                        <p className="font-semibold text-dark-900 dark:text-white">2026</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
                <button
                    id="profile-logout"
                    onClick={handleLogout}
                    className="btn-danger flex items-center gap-2"
                >
                    <HiOutlineLogout size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
