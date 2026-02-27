import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { dashboardAPI } from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AlertContext = createContext(null);

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlerts must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const prevAlertsRef = useRef([]);

    const fetchAlerts = async () => {
        if (!isAuthenticated) return;

        const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';
        if (isAdmin) return;

        try {
            const response = await dashboardAPI.get();
            const rawData = response.data.data ? response.data.data : response.data;
            const newAlerts = rawData.alerts || [];

            setAlerts(newAlerts);

            // Count unread (Status ACTIVE in backend map to unread in frontend)
            const activeCount = newAlerts.filter(a => a.status === 'ACTIVE').length;
            setUnreadCount(activeCount);
            setReviewCount(rawData.reviewCount || 0);

            // Trigger toasts for new HIGH severity alerts
            newAlerts.forEach(alert => {
                const isNew = !prevAlertsRef.current.find(p => p.category === alert.category && p.message === alert.message);
                if (isNew && alert.severity === 'HIGH' && alert.status === 'ACTIVE') {
                    toast.error(`Budget Alert: ${alert.message}`, {
                        duration: 6000,
                        icon: '⚠️',
                    });
                }
            });

            prevAlertsRef.current = newAlerts;
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAlerts();
            // Poll every 30 seconds for new alerts
            const interval = setInterval(fetchAlerts, 30000);
            return () => clearInterval(interval);
        } else {
            setAlerts([]);
            setUnreadCount(0);
            prevAlertsRef.current = [];
        }
    }, [isAuthenticated]);

    return (
        <AlertContext.Provider value={{ alerts, unreadCount, reviewCount, fetchAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};
