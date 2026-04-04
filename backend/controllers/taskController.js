const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取任务列表
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, category, startDate, endDate } = req.query;
    const { Task } = req.models;
    
    let whereClause = { userId: req.user._id };

    // 按状态筛选
    if (status) {
      whereClause.completed = status === 'completed';
    }

    // 按优先级筛选
    if (priority) {
      whereClause.priority = parseInt(priority);
    }

    // 按分类筛选
    if (category) {
      whereClause.category = category;
    }

    // 按日期范围筛选
    if (startDate) {
      whereClause.dueDate = { ...whereClause.dueDate, [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      whereClause.dueDate = { ...whereClause.dueDate, [Op.lte]: new Date(endDate) };
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取单个任务
exports.getTask = async (req, res) => {
  try {
    const { Task } = req.models;
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user._id }
    });
    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 创建任务
exports.createTask = async (req, res) => {
  try {
    // 验证请求数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, priority, category, tags, dueDate } = req.body;
    const { Task } = req.models;

    const newTask = await Task.create({
      userId: req.user._id,
      title,
      description,
      priority: parseInt(priority) || 3,
      category: category || '工作',
      tags: tags || [],
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      completed: false,
    });

    res.json({ success: true, data: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 更新任务
exports.updateTask = async (req, res) => {
  try {
    // 验证请求数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, priority, category, tags, dueDate, completed } = req.body;
    const { Task } = req.models;

    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user._id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    await task.update({
      title,
      description,
      priority: parseInt(priority),
      category,
      tags,
      dueDate: new Date(dueDate),
      completed,
    });

    res.json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 删除任务
exports.deleteTask = async (req, res) => {
  try {
    const { Task } = req.models;
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user._id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    await task.destroy();
    res.json({ success: true, message: '任务删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 切换任务完成状态
exports.toggleTask = async (req, res) => {
  try {
    const { Task } = req.models;
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user._id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    await task.update({
      completed: !task.completed,
    });

    res.json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取任务统计
exports.getTaskStats = async (req, res) => {
  try {
    const { Task } = req.models;
    const tasks = await Task.findAll({
      where: { userId: req.user._id }
    });

    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 按优先级统计
    const byPriority = {
      high: tasks.filter(task => task.priority >= 4).length,
      medium: tasks.filter(task => task.priority === 3).length,
      low: tasks.filter(task => task.priority <= 2).length,
    };

    // 按分类统计
    const byCategory = {};
    tasks.forEach(task => {
      if (byCategory[task.category]) {
        byCategory[task.category]++;
      } else {
        byCategory[task.category] = 1;
      }
    });

    res.json({ success: true, data: {
      total,
      completed,
      pending,
      completionRate,
      byPriority,
      byCategory,
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};