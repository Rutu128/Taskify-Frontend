import { useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
    const { dashboardData, loading, error, fetchDashboardData } = useDashboard();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Error loading dashboard: {error}
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return null;
    }

    const { states, pendingTaskStats } = dashboardData;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            {/* Summary Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{states.totalTasks}</div>
                            <p className="text-xs text-muted-foreground">All tasks in system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasks completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{states.completedPercentage}%</div>
                            <p className="text-xs text-muted-foreground">Of total tasks</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasks pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{states.pendingPercentage}%</div>
                            <p className="text-xs text-muted-foreground">Of total tasks</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average time per task</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{states.averageTime} hrs</div>
                            <p className="text-xs text-muted-foreground">For completed tasks</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Pending Tasks Summary */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Pending task summary</h2>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{pendingTaskStats.totalPending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total time lapsed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{pendingTaskStats.totalTimeLapsed} hrs</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total time to finish</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{pendingTaskStats.timeToFinish} hrs</div>
                            <p className="text-xs text-muted-foreground">estimated based on endtime</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Priority Table */}
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Task priority</TableHead>
                                    <TableHead>Pending tasks</TableHead>
                                    <TableHead>Time lapsed (hrs)</TableHead>
                                    <TableHead>Time to finish (hrs)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingTaskStats.priorityStats.map((stat) => (
                                    <TableRow key={stat.priority}>
                                        <TableCell>{stat.priority}</TableCell>
                                        <TableCell>{stat.count}</TableCell>
                                        <TableCell>{stat.timeLapsed}</TableCell>
                                        <TableCell>{stat.timeToFinish}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;