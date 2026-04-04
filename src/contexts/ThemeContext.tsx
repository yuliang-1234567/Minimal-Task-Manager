import React, { useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, themeReducer, initialState } from './ThemeContextType';

// Provider组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // 从localStorage加载主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('isDark');
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // 主题切换时更新localStorage和DOM
  useEffect(() => {
    if (state.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDark', JSON.stringify(state.isDark));
  }, [state.isDark]);

  // 切换主题
  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const value = {
    state,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};