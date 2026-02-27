import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register({ name, email, password });
            if (response.data.success) {
                login(response.data.data);
                toast.success('Account created successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-primary-600 to-primary-800 relative overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute bottom-32 left-20 w-48 h-48 bg-white/5 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <span className="text-white text-3xl font-bold">E</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">Get Started</h2>
                    <p className="text-primary-100 text-lg max-w-md">
                        Create your account and start analyzing your financial behavior in minutes.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-dark-50 dark:bg-dark-950">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-lg font-bold">E</span>
                        </div>
                        <span className="text-xl font-bold text-dark-900 dark:text-white">ExpenseIQ</span>
                    </div>

                    <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-dark-500 dark:text-dark-400 mb-8">Fill in the details to get started</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Full Name</label>
                            <div className="relative">
                                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Email</label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                                <input
                                    id="register-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-12 pr-12"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                >
                                    {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                                <input
                                    id="register-confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-dark-500 dark:text-dark-400 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
