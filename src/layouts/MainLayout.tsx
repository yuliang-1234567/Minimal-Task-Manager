import React from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/ui/Button';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { state: authState, logout } = useAuth();
  const { state: themeState, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-primary">
              极简任务管理
            </Link>
            {authState.user && (
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/tasks"
                  className={`${location.pathname === '/tasks' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary`}
                >
                  任务管理
                </Link>
                <Link
                  to="/stats"
                  className={`${location.pathname === '/stats' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary`}
                >
                  数据统计
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
              aria-label="切换主题"
            >
              {themeState.isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {authState.user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm dark:text-gray-300">
                  {authState.user.username}
                </span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  退出
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    登录
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    注册
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2026 极简任务与日程管理工具
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;