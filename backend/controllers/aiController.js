const { validationResult } = require('express-validator');
const { callDeepSeek } = require('../services/deepseekClient');

const parseAiJson = (text) => {
  let cleaned = text.trim();
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    cleaned = fenced[1].trim();
  }
  return JSON.parse(cleaned);
};

const clampNumber = (value, min, max, fallback) => {
  if (Number.isNaN(value) || value === null || value === undefined) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
};

const logAiUsage = (label, userId, startedAt, ok) => {
  const ms = Date.now() - startedAt;
  console.log(`[AI] ${label} user=${userId} ms=${ms} ok=${ok}`);
};

exports.breakdown = async (req, res) => {
  const startedAt = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description } = req.body;
    const content = await callDeepSeek({
      messages: [
        {
          role: 'system',
          content: 'You break tasks into clear steps. Return JSON only: {"steps": ["..."]}.',
        },
        {
          role: 'user',
          content: `Task title: ${title}\nTask description: ${description || ''}`,
        },
      ],
      maxTokens: 500,
    });

    const data = parseAiJson(content);
    const steps = Array.isArray(data.steps)
      ? data.steps.map((step) => String(step)).filter(Boolean)
      : [];

    logAiUsage('breakdown', req.user?._id, startedAt, true);
    return res.json({ success: true, data: { steps } });
  } catch (error) {
    logAiUsage('breakdown', req.user?._id, startedAt, false);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'AI 拆解失败',
      detail: error.message || 'unknown error',
    });
  }
};

exports.priorityEstimate = async (req, res) => {
  const startedAt = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, dueDate } = req.body;
    const content = await callDeepSeek({
      messages: [
        {
          role: 'system',
          content: '仅返回 JSON：{"priority": 1-5, "etaHours": number, "rationale": "..."}。rationale 必须是中文，不要包含英文。',
        },
        {
          role: 'user',
          content: `Task title: ${title}\nTask description: ${description || ''}\nDue date: ${dueDate || 'none'}`,
        },
      ],
      maxTokens: 400,
    });

    const data = parseAiJson(content);
    const priority = clampNumber(Number(data.priority), 1, 5, 3);
    const etaHours = clampNumber(Number(data.etaHours), 0.25, 200, 1);
    const rationale = data.rationale ? String(data.rationale) : '';

    logAiUsage('priority-estimate', req.user?._id, startedAt, true);
    return res.json({ success: true, data: { priority, etaHours, rationale } });
  } catch (error) {
    logAiUsage('priority-estimate', req.user?._id, startedAt, false);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'AI 估算失败',
      detail: error.message || 'unknown error',
    });
  }
};

exports.polish = async (req, res) => {
  const startedAt = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { text, style } = req.body;
    const content = await callDeepSeek({
      messages: [
        {
          role: 'system',
          content: 'Improve task text clarity. Return JSON only: {"polishedText": "...", "summary": "..."}.',
        },
        {
          role: 'user',
          content: `Style: ${style || 'concise'}\nText: ${text}`,
        },
      ],
      maxTokens: 500,
    });

    const data = parseAiJson(content);
    const polishedText = data.polishedText ? String(data.polishedText) : String(text);
    const summary = data.summary ? String(data.summary) : '';

    logAiUsage('polish', req.user?._id, startedAt, true);
    return res.json({ success: true, data: { polishedText, summary } });
  } catch (error) {
    logAiUsage('polish', req.user?._id, startedAt, false);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'AI 润色失败',
      detail: error.message || 'unknown error',
    });
  }
};

exports.schedule = async (req, res) => {
  const startedAt = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { rangeDays = 3, workingHours = '09:00-18:00' } = req.body;
    const { Task } = req.models;

    const tasks = await Task.findAll({
      where: { userId: req.user._id, completed: false },
      order: [['dueDate', 'ASC']],
    });

    const taskIndex = tasks.map((task) => ({
      id: String(task.id),
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    }));

    const content = await callDeepSeek({
      messages: [
        {
          role: 'system',
          content: 'Create a schedule plan. Return JSON only: {"schedule": [{"taskId": "", "title": "", "start": "YYYY-MM-DD HH:mm", "end": "YYYY-MM-DD HH:mm", "note": ""}]}.',
        },
        {
          role: 'user',
          content: `Range days: ${rangeDays}\nWorking hours: ${workingHours}\nToday: ${new Date().toISOString().slice(0, 10)}\nTasks: ${JSON.stringify(taskIndex)}`,
        },
      ],
      maxTokens: 900,
    });

    const data = parseAiJson(content);
    const knownIds = new Set(taskIndex.map((task) => task.id));
    const schedule = Array.isArray(data.schedule)
      ? data.schedule
          .map((item) => ({
            taskId: String(item.taskId || ''),
            title: String(item.title || ''),
            start: String(item.start || ''),
            end: String(item.end || ''),
            note: item.note ? String(item.note) : '',
          }))
          .filter((item) => item.taskId && knownIds.has(item.taskId))
      : [];

    logAiUsage('schedule', req.user?._id, startedAt, true);
    return res.json({ success: true, data: { schedule } });
  } catch (error) {
    logAiUsage('schedule', req.user?._id, startedAt, false);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'AI 日程建议失败',
      detail: error.message || 'unknown error',
    });
  }
};

exports.search = async (req, res) => {
  const startedAt = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { query } = req.body;
    const { Task } = req.models;

    const tasks = await Task.findAll({
      where: { userId: req.user._id },
      order: [['createdAt', 'DESC']],
    });

    const taskIndex = tasks.map((task) => ({
      id: String(task.id),
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      completed: task.completed,
    }));

    const content = await callDeepSeek({
      messages: [
        {
          role: 'system',
          content: 'Answer task search. Return JSON only: {"matchedIds": [""], "answer": ""}. Only use ids from task list.',
        },
        {
          role: 'user',
          content: `Query: ${query}\nTasks: ${JSON.stringify(taskIndex)}`,
        },
      ],
      maxTokens: 700,
    });

    const data = parseAiJson(content);
    const knownIds = new Set(taskIndex.map((task) => task.id));
    const matchedIds = Array.isArray(data.matchedIds)
      ? data.matchedIds.map((id) => String(id)).filter((id) => knownIds.has(id))
      : [];
    const answer = data.answer ? String(data.answer) : '';

    logAiUsage('search', req.user?._id, startedAt, true);
    return res.json({ success: true, data: { matchedIds, answer } });
  } catch (error) {
    logAiUsage('search', req.user?._id, startedAt, false);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'AI 搜索失败',
      detail: error.message || 'unknown error',
    });
  }
};
