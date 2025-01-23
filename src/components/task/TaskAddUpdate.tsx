// components/task/TaskDialog.tsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTask } from '@/hooks/useTask';

interface TaskBase {
    title: string;
    priority: number;
    status: 'Pending' | 'Finished';
    startDate: string;
    endDate: string;
    totalTime?: number;
}

interface Task extends TaskBase {
    _id: string;
    userId: string;
}

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    mode: 'add' | 'update';
}

const defaultTask: Omit<TaskBase, 'totalTime'> = {
    title: '',
    priority: 1,
    status: 'Pending',
    startDate: '',
    endDate: '',
};

const calculateTotalHours = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diffInHours < 0 ? 0 : Number(diffInHours.toFixed(2));
};

const formatDateForInput = (dateStr: string): string => {
    const date = new Date(dateStr);

    // Get the components of the date in the required format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine components into the "yyyy-MM-ddTHH:mm" format
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onClose, task, mode }) => {
    const { addTask, updateTask } = useTask();
    const [formData, setFormData] = useState<Task | Omit<TaskBase, 'totalTime'>>(defaultTask);

    useEffect(() => {
        if (mode === 'update' && task) {
            setFormData(task);
        } else {
            setFormData(defaultTask);
        }
    }, [task, mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const totalHours = calculateTotalHours(formData.startDate, formData.endDate);

        if (mode === 'update' && 'userId' in formData) {
            await updateTask(formData._id, { ...formData, totalTime: totalHours });
        } else {
            await addTask({ ...formData, totalTime: totalHours });
        }

        onClose();
        if (mode === 'add') {
            setFormData(defaultTask);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-[425px] md:max-w-[600px] p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                        {mode === 'add' ? 'Add new task' : 'Edit task'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:space-y-6">
                    {mode === 'update' && 'userId' in formData && (
                        <div className="grid gap-2">
                            <Label className="text-sm sm:text-base">Task ID: {formData._id}</Label>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full text-sm sm:text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Priority</Label>
                            <Select
                                value={String(formData.priority)}
                                onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
                            >
                                <SelectTrigger className="w-full text-sm sm:text-base">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((p) => (
                                        <SelectItem key={p} value={String(p)} className="text-sm sm:text-base">
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Status</Label>
                            <div className="flex items-center space-x-3 h-10 px-2">
                                <Switch
                                    id="status"
                                    checked={formData.status === 'Finished'}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, status: checked ? 'Finished' : 'Pending' })
                                    }
                                />
                                <Label htmlFor="status" className="font-normal text-sm sm:text-base">
                                    {formData.status}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-sm sm:text-base">Start time</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formatDateForInput(formData.startDate)}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                                className="w-full text-sm sm:text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-sm sm:text-base">End time</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formatDateForInput(formData.endDate)}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                                className="w-full text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            className="text-sm sm:text-base"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="text-sm sm:text-base"
                        >
                            {mode === 'add' ? 'Add task' : 'Update task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export { TaskDialog };
export type { Task, TaskBase };