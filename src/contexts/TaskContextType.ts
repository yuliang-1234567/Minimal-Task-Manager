import { createContext } from 'react';
import type { Task, TaskState } from '../types';

// Action类型
export type TaskAction =
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<TaskState['filter']> };

// 初始状态
export const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: {
    status: 'all',
    priority: null,
    category: null,
    startDate: null,
    endDate: null,
  },
};

// Reducer
export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TASKS_SUCCESS':
      return { ...state, isLoading: false, tasks: action.payload };
    case 'FETCH_TASKS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
  case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    default:
      return state;
  }
};

// Context类型
export interface TaskContextType {
  state: TaskState;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  setFilter: (filter: Partial<TaskState['filter']>) => void;
  getFilteredTasks: () => Task[];
}

// 创建Context
export const TaskContext = createContext<TaskContextType | undefined>(undefined);