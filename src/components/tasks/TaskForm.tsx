import React, { useState } from 'react';
import { useTask } from '../../hooks/useTask';
import { api } from '../../services/api';
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
  const [aiSteps, setAiSteps] = useState<string[]>([]);
  const [aiEtaHours, setAiEtaHours] = useState<number | null>(null);
  const [aiRationale, setAiRationale] = useState('');
  const [aiPolished, setAiPolished] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState({
    breakdown: false,
    priority: false,
    polish: false,
  });
  const { addTask } = useTask();

  const getTokenOrError = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAiError('请先登录后使用AI功能');
      return null;
    }
    return token;
  };

  const handleAiBreakdown = async () => {
    setAiError('');
    setAiLoading((prev) => ({ ...prev, breakdown: true }));
    try {
      const token = getTokenOrError();
      if (!token) return;
      const response = await api.ai.breakdown(token, { title, description });
      if (response.success) {
        setAiSteps(response.data.steps || []);
      } else {
        setAiError(response.message || 'AI拆解失败');
      }
    } catch (error) {
      console.error('AI拆解失败', error);
      setAiError('AI拆解失败');
    } finally {
      setAiLoading((prev) => ({ ...prev, breakdown: false }));
    }
  };

  const handleAiPriority = async () => {
    setAiError('');
    setAiLoading((prev) => ({ ...prev, priority: true }));
    try {
      const token = getTokenOrError();
      if (!token) return;
      const response = await api.ai.priorityEstimate(token, {
        title,
        description,
        dueDate,
      });
      if (response.success) {
        setPriority(response.data.priority);
        setAiEtaHours(response.data.etaHours ?? null);
        setAiRationale(response.data.rationale || '');
      } else {
        setAiError(response.message || 'AI估算失败');
      }
    } catch (error) {
      console.error('AI估算失败', error);
      setAiError('AI估算失败');
    } finally {
      setAiLoading((prev) => ({ ...prev, priority: false }));
    }
  };

  const handleAiPolish = async () => {
    setAiError('');
    setAiLoading((prev) => ({ ...prev, polish: true }));
    try {
      const token = getTokenOrError();
      if (!token) return;
      const response = await api.ai.polish(token, {
        text: description || title,
        style: 'concise',
      });
      if (response.success) {
        setAiPolished(response.data.polishedText || '');
        setAiSummary(response.data.summary || '');
      } else {
        setAiError(response.message || 'AI润色失败');
      }
    } catch (error) {
      console.error('AI润色失败', error);
      setAiError('AI润色失败');
    } finally {
      setAiLoading((prev) => ({ ...prev, polish: false }));
    }
  };

  const applyAiSteps = () => {
    if (aiSteps.length === 0) return;
    const stepsText = aiSteps.map((step) => `- ${step}`).join('\n');
    setDescription((prev) => `${prev ? `${prev}\n\n` : ''}步骤:\n${stepsText}`);
  };

  const applyAiPolish = () => {
    if (!aiPolished) return;
    setDescription(aiPolished);
  };

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
      <div className="space-y-4 p-4 border rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-800/30">
        <div className="flex flex-wrap gap-3">
          <Button type="button" size="sm" onClick={handleAiBreakdown} disabled={aiLoading.breakdown || !title} className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              {aiLoading.breakdown ? '拆解中...' : 'AI 智能拆解'}
            </span>
          </Button>
          <Button type="button" size="sm" onClick={handleAiPriority} disabled={aiLoading.priority || !title} className="!bg-purple-600 hover:!bg-purple-700 !text-white font-semibold">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {aiLoading.priority ? '估算中...' : 'AI 优先级 / 耗时估算'}
            </span>
          </Button>
          <Button type="button" size="sm" onClick={handleAiPolish} disabled={aiLoading.polish || (!title && !description)} className="!bg-emerald-600 hover:!bg-emerald-700 !text-white font-semibold">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              {aiLoading.polish ? '润色中...' : 'AI 润色优化描述'}
            </span>
          </Button>
        </div>
        
        {aiError && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/30">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {aiError}
          </div>
        )}
        {aiSteps.length > 0 && (
          <div className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-sm font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              AI 拆解步骤建议
            </div>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              {aiSteps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-indigo-500 font-medium">{index + 1}.</span> {step}
                </li>
              ))}
            </ul>
            <Button type="button" size="sm" variant="secondary" onClick={applyAiSteps} className="mt-2 text-xs py-1.5 px-3">
              将步骤追加到描述
            </Button>
          </div>
        )}
        {(aiEtaHours !== null || aiRationale) && (
          <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900/50 text-sm">
            {aiEtaHours !== null && (
              <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                预计耗时：<span className="text-indigo-600 dark:text-indigo-400">约 {aiEtaHours} 小时</span>
              </div>
            )}
            {aiRationale && (
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{aiRationale}</span>
              </div>
            )}
          </div>
        )}
        {aiPolished && (
          <div className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-sm font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              AI 润色文本
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-800">
              {aiPolished}
            </div>
            {aiSummary && (
              <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-start">
                <span className="font-semibold shrink-0">摘要:</span> {aiSummary}
              </div>
            )}
            <Button type="button" size="sm" variant="secondary" onClick={applyAiPolish} className="mt-2 text-xs py-1.5 px-3">
              使用此润色文本替换描述
            </Button>
          </div>
        )}
      </div>
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