import React, { useState } from 'react';
import { useTask } from '../../hooks/useTask';
import { api } from '../../services/api';
import Button from '../ui/Button';

const TaskFilter: React.FC = () => {
  const { state, setFilter } = useTask();
  const [scheduleItems, setScheduleItems] = useState<Array<{ title: string; start: string; end: string; note?: string }>>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleStatusChange = (status: 'all' | 'completed' | 'pending') => {
    setFilter({ status });
  };

  const handlePriorityChange = (priority: number | null) => {
    setFilter({ priority });
  };

  const handleCategoryChange = (category: string | null) => {
    setFilter({ category });
  };

  const categories = ['工作', '生活', '健康', '学习', '其他'];

  const handleSchedule = async () => {
    setShowScheduleModal(true);
    setScheduleError('');
    setScheduleLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setScheduleError('请先登录后使用AI日程建议');
        return;
      }
      const response = await api.ai.schedule(token, { rangeDays: 3, workingHours: '09:00-18:00' });
      if (response.success) {
        setScheduleItems(response.data.schedule || []);
      } else {
        setScheduleError(response.message || 'AI日程建议失败');
      }
    } catch (error) {
      console.error('AI日程建议失败', error);
      setScheduleError('AI日程建议失败');
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-4">筛选任务</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            状态
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('all')}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.status === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              全部
            </button>
            <button
              onClick={() => handleStatusChange('pending')}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.status === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              未完成
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.status === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              已完成
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            优先级
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePriorityChange(null)}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.priority === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              全部
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => handlePriorityChange(p)}
                className={`px-3 py-1 rounded-full text-sm ${state.filter.priority === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            分类
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-3 py-1 rounded-full text-sm ${state.filter.category === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 rounded-full text-sm ${state.filter.category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-5 mt-5 border-t border-gray-100 dark:border-gray-700/50 space-y-3">
        <label className="text-sm font-semibold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          AI 日程助手
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">根据您当前未完成的任务，AI将为您智能生成未来 3 天的日程安排。</p>
        <Button type="button" size="md" variant="primary" fullWidth onClick={handleSchedule} disabled={scheduleLoading} className="!bg-indigo-600 hover:!bg-indigo-700 !text-white font-semibold shadow-md py-2.5">
          {scheduleLoading ? '正在生成安排...' : '生成智能日程安排 ✨'}
        </Button>
      </div>
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowScheduleModal(false)}
          ></div>
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI 智能日程建议
              </h3>
              <button
                type="button"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowScheduleModal(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {scheduleLoading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI 正在为您规划日程...</div>
                </div>
              )}
              {!scheduleLoading && scheduleError && (
                <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/30">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {scheduleError}
                </div>
              )}
              {!scheduleLoading && !scheduleError && scheduleItems.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">目前没有建议安排</div>
              ) : (
                !scheduleLoading && !scheduleError && (
                  <div className="space-y-3">
                    {scheduleItems.map((item, index) => (
                      <div key={index} className="group flex flex-col gap-1 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-100 dark:hover:border-indigo-800/30">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 ml-4">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {item.start} — {item.end}
                        </div>
                        {item.note && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 ml-4 mt-1 leading-relaxed">
                            {item.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button type="button" size="md" variant="primary" onClick={() => setShowScheduleModal(false)}>
                知道了，关闭
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;