import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Stats from '../components/stats/Stats';

const StatsPage: React.FC = () => {
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
      <h1 className="text-2xl font-bold">数据统计</h1>
      <Stats />
    </div>
  );
};

export default StatsPage;