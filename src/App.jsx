import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Budgets from './pages/Budgets';
import Recurring from './pages/Recurring';
import Review from './pages/Review';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminLogs from './pages/AdminLogs';

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';
        if (isAdmin) return <Navigate to="/admin" replace />;
        return children;
    }

    return <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';
    return !isAuthenticated ? children : (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />);
};

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';
    return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const AppContent = () => {
    const { darkMode } = useTheme();

    return (
        <div className={darkMode ? 'dark' : ''}>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/review" element={<ProtectedRoute><Layout><Review /></Layout></ProtectedRoute>} />
                    <Route path="/upload" element={<ProtectedRoute><Layout><Upload /></Layout></ProtectedRoute>} />
                    <Route path="/transactions" element={<ProtectedRoute><Layout><Transactions /></Layout></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
                    <Route path="/budgets" element={<ProtectedRoute><Layout><Budgets /></Layout></ProtectedRoute>} />
                    <Route path="/recurring" element={<ProtectedRoute><Layout><Recurring /></Layout></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><Layout><AdminUsers /></Layout></AdminRoute>} />
                    <Route path="/admin/logs" element={<AdminRoute><Layout><AdminLogs /></Layout></AdminRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: darkMode ? '#1e293b' : '#ffffff',
                        color: darkMode ? '#f1f5f9' : '#0f172a',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#ffffff' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
                    },
                }}
            />
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AlertProvider>
                    <AppContent />
                </AlertProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
