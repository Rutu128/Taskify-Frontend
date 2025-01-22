// pages/TaskPage.tsx
import { useState } from 'react';
import { useTask } from '@/hooks/useTask';
import { TaskTable } from '@/components/TaskTable';
import { TaskDialog } from '@/components/task/TaskAddUpdate';
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { Task } from '@/components/task/TaskAddUpdate';

const TaskPage = () => {
    const { tasks, deleteTask } = useTask();
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        mode: 'add' | 'update';
        task: Task | null;
    }>({
        isOpen: false,
        mode: 'add',
        task: null
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTasks(tasks.map(task => task._id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleSelectTask = (taskId: string, checked: boolean) => {
        if (checked) {
            setSelectedTasks(prev => [...prev, taskId]);
        } else {
            setSelectedTasks(prev => prev.filter(id => id !== taskId));
        }
    };

    const handleAddClick = () => {
        setDialogState({
            isOpen: true,
            mode: 'add',
            task: null
        });
    };

    const handleEditClick = (task: Task) => {
        setDialogState({
            isOpen: true,
            mode: 'update',
            task
        });
    };

    const handleCloseDialog = () => {
        setDialogState(prev => ({
            ...prev,
            isOpen: false,
            task: null
        }));
    };

    const handleDeleteSelected = async () => {
        try {
            const results = await Promise.all(
                selectedTasks.map(taskId => deleteTask(taskId))
            );
            if (results.every(result => result)) {
                setSelectedTasks([]);
            }
        } catch (error) {
            console.error('Error deleting tasks:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-center">Task List</h1>
                
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <Button
                        className="flex items-center gap-2 w-full sm:w-auto"
                        onClick={handleAddClick}
                    >
                        <Plus className="h-4 w-4" />
                        Add Task
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex items-center gap-2 w-full sm:w-auto"
                        disabled={selectedTasks.length === 0}
                        onClick={handleDeleteSelected}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected ({selectedTasks.length})
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <TaskTable
                    selectedTasks={selectedTasks}
                    onSelectTask={handleSelectTask}
                    onSelectAll={handleSelectAll}
                    onEditTask={handleEditClick}
                />
            </div>

            <TaskDialog
                isOpen={dialogState.isOpen}
                onClose={handleCloseDialog}
                task={dialogState.task}
                mode={dialogState.mode}
            />
        </div>
    );
};

export default TaskPage;