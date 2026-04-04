import React, { useEffect, useState } from 'react';
import { useTask } from '../../hooks/useTask';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import type { Task, TaskStats } from '../../types';

// 注册Chart.js组件
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Stats: React.FC = () => {
  const { state } = useTask();
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
    byCategory: {},
  });

  useEffect(() => {
    const calculateStats = (tasks: Task[]) => {
      const total = tasks.length;
      const completed = tasks.filter(task => task.completed).length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // 按优先级统计
      const byPriority = {
        high: tasks.filter(task => task.priority >= 4).length,
        medium: tasks.filter(task => task.priority === 3).length,
        low: tasks.filter(task => task.priority <= 2).length,
      };

      // 按分类统计
      const byCategory: Record<string, number> = {};
      tasks.forEach(task => {
        if (byCategory[task.category]) {
          byCategory[task.category]++;
        } else {
          byCategory[task.category] = 1;
        }
      });

      setStats({
        total,
        completed,
        pending,
        completionRate,
        byPriority,
        byCategory,
      });
    };

    calculateStats(state.tasks);
  }, [state.tasks]);

  // 饼图数据
  const pieData = {
    labels: ['已完成', '未完成'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // 柱状图数据
  const barData = {
    labels: Object.keys(stats.byCategory),
    datasets: [
      {
        label: '任务数量',
        data: Object.values(stats.byCategory),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  // 按优先级统计的柱状图数据
  const priorityData = {
    labels: ['低', '中', '高'],
    datasets: [
      {
        label: '任务数量',
        data: [stats.byPriority.low, stats.byPriority.medium, stats.byPriority.high],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">总任务数</h3>
          <p className="text-2xl font-semibold mt-1">{stats.total}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">已完成</h3>
          <p className="text-2xl font-semibold mt-1 text-success">{stats.completed}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">完成率</h3>
          <p className="text-2xl font-semibold mt-1">{stats.completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">任务完成情况</h2>
          <div className="h-64">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">任务分类统计</h2>
          <div className="h-64">
            <Bar data={barData} />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">任务优先级统计</h2>
        <div className="h-64">
          <Bar data={priorityData} />
        </div>
      </div>
    </div>
  );
};

export default Stats;