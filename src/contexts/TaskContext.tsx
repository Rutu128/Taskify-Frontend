import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/Api';
import toast from 'react-hot-toast';

interface Task {
    _id: string;
    userId: string;
    title: string;
    priority: number;
    status: 'Pending' | 'Finished';
    startDate: string;
    endDate: string;
    totalTime?: number;
}

interface PaginationInfo {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
    fetchTasks: (page?: number, limit?: number, filters?: unknown) => Promise<void>;
    addTask: (taskData: Omit<Task, '_id' | 'userId'>) => Promise<boolean>;
    updateTask: (taskId: string, taskData: Partial<Task>) => Promise<boolean>;
    deleteTask: (taskId: string) => Promise<boolean>;
    clearError: () => void;
}
const TaskContext = createContext<TaskContextType | null>(null);
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 5
    });

    const fetchTasks = useCallback(async (page = 1, limit = 5) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),

            });

            const { data } = await axios.get(
                `${baseUrl}/task?${queryParams}`,
                { withCredentials: true }
            );

            if (data.statusCode === 200) {
                setTasks(data.data.tasks);
                setPagination(data.data.pagination);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const addTask = useCallback(async (taskData: Omit<Task, '_id' | 'userId'>) => {
        try {
            setLoading(true);
            const response = await axios.post(`${baseUrl}/task/add`, {
                taskData
            }, {
                withCredentials: true,
            });

            if (response.status === 200) {
                await fetchTasks();
                toast.success("Task added!");
                return true;
            }
            toast.error("Failed to add task!");
            return false;
        } catch (err) {
            console.log(err);
            setError(err instanceof Error ? err.message : 'Failed to add task');
            toast.error("Failed to add task!");
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchTasks]);

    const updateTask = useCallback(async (taskId: string, taskData: Partial<Task>) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${baseUrl}/task/update/${taskId}`,
                { taskData },
                { withCredentials: true }
            );

            if (data.statusCode === 200) {
                await fetchTasks();
                toast.success("Task updated!");
                return true;
            }
            toast.error("Failed to update task!");
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task');
            toast.error("Failed to update task!");
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchTasks]);

    const deleteTask = useCallback(async (taskId: string) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${baseUrl}/task/delete/${taskId}`, { withCredentials: true });

            if (response.status === 200) {
                await fetchTasks();
                toast.success("Task deleted!");
                return true;
            }
            toast.error("Failed to delete task!");
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete task');
            toast.error("Failed to delete task!");
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchTasks]);


    const value: TaskContextType = {
        tasks,
        loading,
        error,
        pagination,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        clearError: () => setError(null)
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;
export { TaskContext };