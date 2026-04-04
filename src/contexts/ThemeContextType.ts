import { createContext } from 'react';
import type { ThemeState } from '../types';

// Action类型
export type ThemeAction = { type: 'TOGGLE_THEME' };

// 初始状态
export const initialState: ThemeState = {
  isDark: false,
};

// Reducer
export const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { isDark: !state.isDark };
    default:
      return state;
  }
};

// Context类型
export interface ThemeContextType {
  state: ThemeState;
  toggleTheme: () => void;
}

// 创建Context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);