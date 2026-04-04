import React, { useEffect } from 'react';
import { useTask } from '../../hooks/useTask';
import Button from '../ui/Button';

const TaskList: React.FC = () => {
  const { fetchTasks, getFilteredTasks, toggleTask, deleteTask } = useTask();
  const tasks = getFilteredTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      await deleteTask(taskId);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 2:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 3:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 4:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 5:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center py-10 dark:text-gray-400">
          暂无任务
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50"
            />
            <div className="ml-4 flex-1">
              <h3 className={`font-medium text-red-500 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {task.description}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  优先级 {task.priority}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {task.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              className="ml-2"
            >
              删除
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;