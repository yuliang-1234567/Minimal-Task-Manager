const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// 获取任务列表路由
router.get('/', auth, taskController.getTasks);

// 获取单个任务路由
router.get('/:id', auth, taskController.getTask);

// 创建任务路由
router.post('/',
  auth,
  [
    body('title', '任务标题不能为空').notEmpty(),
  ],
  taskController.createTask
);

// 更新任务路由
router.put('/:id',
  auth,
  [
    body('title', '任务标题不能为空').notEmpty(),
  ],
  taskController.updateTask
);

// 删除任务路由
router.delete('/:id', auth, taskController.deleteTask);

// 切换任务完成状态路由
router.patch('/:id/toggle', auth, taskController.toggleTask);

// 获取任务统计路由
router.get('/stats/summary', auth, taskController.getTaskStats);

module.exports = router;