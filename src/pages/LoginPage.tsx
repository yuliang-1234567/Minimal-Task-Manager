import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import TrueFocus from '../components/ui/TrueFocus';

const LoginPage: React.FC = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  // 如果用户已登录，重定向到任务管理页面
  useEffect(() => {
    if (authState.user) {
      navigate('/tasks');
    }
  }, [authState.user, navigate]);

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <TrueFocus  
            sentence="True Focus"
            manualMode={false}
            blurAmount={5}
            borderColor="#5227FF"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
        </div>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
          这是一个用于任务与日程管理的应用，支持任务记录、筛选与统计。
        </p>
        <h1 className="text-2xl font-bold text-center mb-6">登录</h1>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            还没有账号？{' '}
            <Link to="/register" className="text-primary hover:underline">
              注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
