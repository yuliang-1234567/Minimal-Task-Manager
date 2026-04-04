// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 任务类型
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: number;
  category: string;
  tags: string[];
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 任务统计类型
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byCategory: Record<string, number>;
}

// 认证状态类型
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// 任务状态类型
export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: {
    status: 'all' | 'completed' | 'pending';
    priority: number | null;
    category: string | null;
    startDate: Date | null;
    endDate: Date | null;
  };
}

// 主题状态类型
export interface ThemeState {
  isDark: boolean;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}