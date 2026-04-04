const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// 注册路由
router.post('/register',
  [
    body('username', '用户名不能为空').notEmpty(),
    body('email', '邮箱格式不正确').isEmail(),
    body('password', '密码至少6位').isLength({ min: 6 }),
  ],
  userController.register
);

// 登录路由
router.post('/login',
  [
    body('email', '邮箱格式不正确').isEmail(),
    body('password', '密码不能为空').notEmpty(),
  ],
  userController.login
);

// 获取当前用户信息路由
router.get('/me', auth, userController.getCurrentUser);

// 更新用户信息路由
router.put('/me', auth, userController.updateUser);

// 修改密码路由
router.put('/password', auth, userController.updatePassword);

module.exports = router;