import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineLightningBolt,
    HiOutlineDocumentText, HiOutlineTrendingUp, HiOutlineBell,
    HiOutlineSun, HiOutlineMoon
} from 'react-icons/hi';

const features = [
    {
        icon: HiOutlineDocumentText,
        title: 'Smart PDF Extraction',
        description: 'Upload bank statements and our AI-powered engine extracts every transaction automatically.',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        icon: HiOutlineChartBar,
        title: 'Behavioral Analytics',
        description: 'Deep insights into your spending patterns, category-wise breakdown, and monthly trends.',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        icon: HiOutlineShieldCheck,
        title: 'Risk Detection',
        description: 'Real-time alerts for high spending, low savings, and excessive EMI burden.',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        icon: HiOutlineLightningBolt,
        title: 'Auto Categorization',
        description: 'Transactions automatically sorted into Food, Shopping, Travel, Payments, Loans & more.',
        gradient: 'from-purple-500 to-pink-600',
    },
    {
        icon: HiOutlineTrendingUp,
        title: 'Financial Health Score',
        description: 'Get a comprehensive 0-100 score that reflects your overall financial wellness.',
        gradient: 'from-cyan-500 to-blue-600',
    },
    {
        icon: HiOutlineBell,
        title: 'Smart Alerts',
        description: 'Proactive notifications when your spending exceeds safe thresholds.',
        gradient: 'from-rose-500 to-red-600',
    },
];

const Landing = () => {
    const { isAuthenticated } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="bg-dark-50 dark:bg-dark-950 transition-colors duration-300">
                {/* Navigation */}
                <nav className="fixed top-0 w-full bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-200/50 dark:border-dark-700/50 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <span className="text-white text-lg font-bold">E</span>
                            </div>
                            <span className="text-xl font-bold text-dark-900 dark:text-white">ExpenseIQ</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                            >
                                {darkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
                            </button>
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="btn-primary text-sm">Go to Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
                                    <Link to="/register" className="btn-primary text-sm">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-8 animate-fade-in">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                            Powered by Intelligent Financial Analysis
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-slide-up">
                            <span className="text-dark-900 dark:text-white">Take Control of</span>
                            <br />
                            <span className="gradient-text">Your Finances</span>
                        </h1>

                        <p className="text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Upload your bank statements, get instant insights, detect spending patterns,
                            and receive smart alerts to build a healthier financial future.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/register" className="btn-primary text-lg px-10 py-4">
                                Start Free Analysis →
                            </Link>
                            <Link to="/login" className="btn-secondary text-lg px-10 py-4">
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {[
                                { value: '10+', label: 'Categories Tracked' },
                                { value: '99%', label: 'Extraction Accuracy' },
                                { value: 'Real-time', label: 'Risk Alerts' },
                                { value: '0-100', label: 'Health Score' },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card-solid p-6 text-center animate-slide-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                                    <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-sm text-dark-500 dark:text-dark-400 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-6 bg-white dark:bg-dark-900">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4">
                                Everything You Need to
                                <span className="gradient-text"> Master Your Money</span>
                            </h2>
                            <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl mx-auto">
                                Comprehensive tools to analyze, categorize, and optimize your financial behavior.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="glass-card-solid p-8 group hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="text-white" size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-dark-500 dark:text-dark-400 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl shadow-primary-500/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                            <h2 className="relative text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Transform Your Finances?
                            </h2>
                            <p className="relative text-lg text-primary-100 mb-8 max-w-xl mx-auto">
                                Join now and get instant access to powerful financial analysis tools.
                                Your first analysis is just one upload away.
                            </p>
                            <Link
                                to="/register"
                                className="relative inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-xl hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                            >
                                Get Started Free →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-dark-200 dark:border-dark-800">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">E</span>
                            </div>
                            <span className="font-bold text-dark-900 dark:text-white">ExpenseIQ</span>
                        </div>
                        <p className="text-sm text-dark-400">
                            © 2026 ExpenseIQ. All rights reserved. Built for hackathon.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
