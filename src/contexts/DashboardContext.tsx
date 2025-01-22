import { createContext, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/Api';


interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completedPercentage: number;
    pendingPercentage: number;
    averageTime: number;
}

interface PriorityStats {
    priority: number;
    count: number;
    timeLapsed: number;
    timeToFinish: number;
}

interface PendingTaskStats {
    totalPending: number;
    totalTimeLapsed: number;
    timeToFinish: number;
    priorityStats: PriorityStats[];
}

interface DashboardData {
    states: DashboardStats;
    pendingTaskStats: PendingTaskStats;
}

interface DashboardContextType {
    dashboardData: DashboardData | null;
    loading: boolean;
    error: string | null;
    fetchDashboardData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${baseUrl}/dashboard`, {
                withCredentials: true
            });
            setDashboardData(response.data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        dashboardData,
        loading,
        error,
        fetchDashboardData
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export { DashboardContext }
export default DashboardProvider;