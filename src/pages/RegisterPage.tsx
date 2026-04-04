import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // 如果用户已登录，重定向到任务管理页面
  React.useEffect(() => {
    if (state.user) {
      navigate('/tasks');
    }
  }, [state.user, navigate]);

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">注册</h1>
        <RegisterForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            已有账号？{' '}
            <Link to="/login" className="text-primary hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;