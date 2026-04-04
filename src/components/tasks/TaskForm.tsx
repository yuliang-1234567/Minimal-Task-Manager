import React, { useState } from 'react';
import { useTask } from '../../hooks/useTask';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);
  const [category, setCategory] = useState('工作');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const { addTask } = useTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    const newErrors: { title?: string } = {};
    if (!title) newErrors.title = '请输入任务标题';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const taskData = {
        title,
        description,
        priority: priority,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dueDate: new Date(dueDate),
        completed: false,
      };
      
      console.log('提交的任务数据:', taskData);
      
      await addTask(taskData);
      
      // 重置表单
      setTitle('');
      setDescription('');
      setPriority(3);
      setCategory('工作');
      setTags('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setErrors({});
    } catch (error) {
      console.error('添加任务失败', error);
    }
  };

  const categories = ['工作', '生活', '健康', '学习', '其他'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold">添加任务</h2>
      <Input
        label="任务标题"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        fullWidth
        placeholder="请输入任务标题"
      />
      <Textarea
        label="任务描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        placeholder="请输入任务描述"
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            优先级
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                {p} - {p === 1 ? '低' : p === 5 ? '高' : '中'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            分类
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Input
        label="标签（用逗号分隔）"
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        placeholder="例如：重要,紧急"
      />
      <Input
        label="截止日期"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        fullWidth
      />
      <Button type="submit" fullWidth>
        添加任务
      </Button>
    </form>
  );
};

export default TaskForm;