import React, { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Task, TaskState } from '../types';
import { TaskContext, taskReducer, initialState } from './TaskContextType';
import { api } from '../services/api';

// Provider组件
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'FETCH_TASKS_START' });
    try {
      // 从后端获取任务
      const token = localStorage.getItem('token');
      if (token) {
        console.log('从后端获取任务');
        const response = await api.tasks.getTasks(token);
        console.log('后端返回的任务数据:', response);
        if (response.success) {
          // 转换日期字符串为Date对象
          const parsedTasks = response.data.map((task: Task) => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          }));
          console.log('解析后的任务数据:', parsedTasks);
          dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: parsedTasks });
        } else {
          dispatch({ type: 'FETCH_TASKS_FAILURE', payload: response.message || '获取任务失败' });
        }
      } else {
        // 如果没有token，使用默认任务
        console.log('没有token，使用默认任务');
        const mockTasks: Task[] = [
          {
            id: '1',
            userId: '1',
            title: '完成项目文档',
            description: '编写项目的技术文档和用户手册',
            priority: 3,
            category: '工作',
            tags: ['文档', '重要'],
            dueDate: new Date(),
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            userId: '1',
            title: '购买 groceries',
            description: '购买牛奶、鸡蛋、蔬菜等',
            priority: 2,
            category: '生活',
            tags: ['购物'],
            dueDate: new Date(),
            completed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '3',
            userId: '1',
            title: '健身',
            description: '去健身房锻炼1小时',
            priority: 1,
            category: '健康',
            tags: ['运动'],
            dueDate: new Date(),
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: mockTasks });
      }
    } catch (error) {
      console.error('获取任务失败', error);
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: '获取任务失败' });
    }
  }, []);

  // 添加任务
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('添加任务数据:', taskData);
      const token = localStorage.getItem('token');
      if (token) {
        console.log('使用token添加任务');
        const response = await api.tasks.createTask(token, taskData);
        console.log('后端返回的添加任务结果:', response);
        if (response.success) {
          // 添加任务后刷新任务列表，确保前端显示的任务与数据库一致
          await fetchTasks();
        } else {
          console.error('添加任务失败', response.message);
        }
      } else {
        // 如果没有token，使用本地模拟
        console.log('没有token，使用本地模拟添加任务');
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: 'ADD_TASK', payload: newTask });
      }
    } catch (error) {
      console.error('添加任务失败', error);
    }
  }, [fetchTasks]);

  // 更新任务
  const updateTask = useCallback(async (task: Task) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.tasks.updateTask(token, task.id, task);
        if (response.success) {
          // 更新任务后刷新任务列表，确保前端显示的任务与数据库一致
          await fetchTasks();
        } else {
          console.error('更新任务失败', response.message);
        }
      } else {
        // 如果没有token，使用本地模拟
        const updatedTask = {
          ...task,
          updatedAt: new Date(),
        };
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      }
    } catch (error) {
      console.error('更新任务失败', error);
    }
  }, [fetchTasks]);

  // 删除任务
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.tasks.deleteTask(token, taskId);
        if (response.success) {
          // 删除任务后刷新任务列表，确保前端显示的任务与数据库一致
          await fetchTasks();
        } else {
          console.error('删除任务失败', response.message);
        }
      } else {
        // 如果没有token，使用本地模拟
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      }
    } catch (error) {
      console.error('删除任务失败', error);
    }
  }, [fetchTasks]);

  // 切换任务完成状态
  const toggleTask = useCallback(async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.tasks.toggleTask(token, taskId);
        if (response.success) {
          // 切换任务状态后刷新任务列表，确保前端显示的任务与数据库一致
          await fetchTasks();
        } else {
          console.error('切换任务状态失败', response.message);
        }
      } else {
        // 如果没有token，使用本地模拟
        dispatch({ type: 'TOGGLE_TASK', payload: taskId });
      }
    } catch (error) {
      console.error('切换任务状态失败', error);
    }
  }, [fetchTasks]);

  // 设置筛选条件
  const setFilter = useCallback((filter: Partial<TaskState['filter']>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []); // 不需要依赖state，因为dispatch是稳定的

  // 获取筛选后的任务
  const getFilteredTasks = useCallback((): Task[] => {
    let filteredTasks = [...state.tasks];

    // 按状态筛选
    if (state.filter.status === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (state.filter.status === 'pending') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    // 按优先级筛选
    if (state.filter.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === state.filter.priority);
    }

    // 按分类筛选
    if (state.filter.category) {
      filteredTasks = filteredTasks.filter(task => task.category === state.filter.category);
    }

    // 按日期范围筛选
    if (state.filter.startDate) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= state.filter.startDate!;
      });
    }

    if (state.filter.endDate) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate <= state.filter.endDate!;
      });
    }

    return filteredTasks;
  }, [state.tasks, state.filter]);

  const value = {
    state,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    getFilteredTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};