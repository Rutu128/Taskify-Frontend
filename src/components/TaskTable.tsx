// TaskTable.tsx
import { useState, useEffect } from 'react';
import { useTask } from '@/hooks/useTask';
import { usePageSize } from '@/hooks/usePageSize';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Task } from './task/TaskAddUpdate';

interface TaskTableProps {
    selectedTasks: string[];
    onSelectTask: (taskId: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onEditTask: (task: Task) => void;
}

const SORT_OPTIONS = [
    { label: 'Start time: ASC', value: 'startAsc' },
    { label: 'Start time: DESC', value: 'startDesc' },
    { label: 'End time: ASC', value: 'endAsc' },
    { label: 'End time: DESC', value: 'endDesc' },
];

const STATUS_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Finished', value: 'Finished' },
];

const PRIORITY_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Low (1)', value: '1' },
    { label: 'Medium (2)', value: '2' },
    { label: 'High (3)', value: '3' },
];

const PAGE_SIZE_OPTIONS = [
    { label: '5 per page', value: '5' },
    { label: '7 per page', value: '7' },
    { label: '10 per page', value: '10' },
    { label: '20 per page', value: '20' },
];

export const TaskTable = ({
    selectedTasks,
    onSelectTask,
    onSelectAll,
    onEditTask
}: TaskTableProps) => {
    const { tasks, fetchTasks, pagination } = useTask();
    const { pageSize, updatePageSize } = usePageSize();
    const [sortType, setSortType] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    useEffect(() => {
        fetchTasks(1, parseInt(pageSize));
    }, [pageSize, sortType, statusFilter, priorityFilter, fetchTasks]);
    const clearFilters = () => {
        setSortType(null);
        setStatusFilter('all');
        setPriorityFilter('all');
        fetchTasks(1, parseInt(pageSize));
    };

    const handlePageChange = (page: number) => {
        fetchTasks(page, parseInt(pageSize));
    };

    const handlePageSizeChange = (newSize: string) => {
        updatePageSize(newSize);
        fetchTasks(1, parseInt(newSize));
    };
    
    const totaltime = (startDate: Date, endDate: Date): number => {
        const diffInMillis = endDate.getTime() - startDate.getTime();
        const hours = diffInMillis / (1000 * 60 * 60);
        return hours < 0 ? 0 : hours;
    };

    const isFiltersActive = sortType !== null || statusFilter !== 'all' || priorityFilter !== 'all';

    return (
        <div className="space-y-4">
            {/* Filters Section */}
            <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-4">
                            {/* Sort Selector */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap">Sort by:</label>
                                <Select
                                    value={sortType || 'none'}
                                    onValueChange={(value) => setSortType(value === 'none' ? null : value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select sort type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Status:</label>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Filter status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Priority Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Priority:</label>
                                <Select
                                    value={priorityFilter}
                                    onValueChange={setPriorityFilter}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Filter priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRIORITY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Page Size Selector */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Page size:</label>
                                <Select
                                    value={pageSize}
                                    onValueChange={handlePageSizeChange}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select page size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAGE_SIZE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {isFiltersActive && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                    onCheckedChange={onSelectAll}
                                />
                            </TableHead>
                            <TableHead className="whitespace-nowrap">Task ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="whitespace-nowrap">Priority</TableHead>
                            <TableHead className="whitespace-nowrap">Status</TableHead>
                            <TableHead className="whitespace-nowrap">Start Time</TableHead>
                            <TableHead className="whitespace-nowrap">End Time</TableHead>
                            <TableHead className="whitespace-nowrap">Total time (hrs)</TableHead>
                            <TableHead className="w-12">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    No tasks found
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTasks.includes(task._id)}
                                            onCheckedChange={(checked) => onSelectTask(task._id, checked as boolean)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{task._id}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.priority}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-sm ${task.status === 'Finished'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(task.startDate).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(task.endDate).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {totaltime(new Date(task.startDate), new Date(task.endDate))}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEditTask(task)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                            </svg>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
                <p className="text-sm text-gray-700 order-2 sm:order-1">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} entries
                </p>
                <div className="flex gap-2 order-1 sm:order-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                    ).map((page) => (
                        <Button
                            key={page}
                            variant={pagination.currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};