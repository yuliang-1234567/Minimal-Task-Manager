const express = require('express');
const { body } = require('express-validator');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const aiRateLimit = require('../middleware/aiRateLimit');

const router = express.Router();

router.post(
  '/breakdown',
  auth,
  aiRateLimit,
  [body('title', '任务标题不能为空').notEmpty()],
  aiController.breakdown
);

router.post(
  '/priority-estimate',
  auth,
  aiRateLimit,
  [body('title', '任务标题不能为空').notEmpty()],
  aiController.priorityEstimate
);

router.post(
  '/polish',
  auth,
  aiRateLimit,
  [body('text', '文本不能为空').notEmpty()],
  aiController.polish
);

router.post(
  '/schedule',
  auth,
  aiRateLimit,
  [body('rangeDays').optional().isInt({ min: 1, max: 14 })],
  aiController.schedule
);

router.post(
  '/search',
  auth,
  aiRateLimit,
  [body('query', '搜索内容不能为空').notEmpty()],
  aiController.search
);

module.exports = router;
