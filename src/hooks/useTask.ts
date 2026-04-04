import { useContext } from 'react';
import { TaskContext, type TaskContextType } from '../contexts/TaskContextType';

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};