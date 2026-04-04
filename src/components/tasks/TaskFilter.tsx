import React from 'react';
import { useTask } from '../../hooks/useTask';

const TaskFilter: React.FC = () => {
  const { state, setFilter } = useTask();

  const handleStatusChange = (status: 'all' | 'completed' | 'pending') => {
    setFilter({ status });
  };

  const handlePriorityChange = (priority: number | null) => {
    setFilter({ priority });
  };

  const handleCategoryChange = (category: string | null) => {
    setFilter({ category });
  };

  const categories = ['工作', '生活', '健康', '学习', '其他'];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-4">筛选任务</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            状态
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('all')}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.status === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              全部
            </button>
            <button
              onClick={() => handleStatusChange('pending')}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.status === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              未完成
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.status === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              已完成
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            优先级
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePriorityChange(null)}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.priority === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              全部
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => handlePriorityChange(p)}
                className={`px-3 py-1 rounded-full text-sm ${state.filter.priority === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            分类
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.category === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 rounded-full text-sm ${state.filter.category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;