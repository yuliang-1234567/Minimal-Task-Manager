import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilter from '../components/tasks/TaskFilter';

const TasksPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // 如果用户未登录，重定向到登录页面
  React.useEffect(() => {
    if (!state.user) {
      navigate('/login');
    }
  }, [state.user, navigate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskForm />
          <TaskList />
        </div>
        <div className="lg:col-span-1">
          <TaskFilter />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;