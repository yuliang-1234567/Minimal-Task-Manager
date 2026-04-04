const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 先创建数据库（如果不存在）
const createDatabase = async () => {
  try {
    // 连接到MySQL服务器
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
    });

    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database}`);
    await connection.end();
    console.log('数据库创建成功');
  } catch (error) {
    console.error('创建数据库失败:', error);
  }
};

// 创建Sequelize实例
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: console.log,
  }
);

// 定义用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

// 定义任务模型
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: '工作',
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  dueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
});

// 建立关联
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

// 同步数据库表
createDatabase().then(() => {
  return sequelize.sync({ force: false }) // force: false 不会删除现有表，确保数据持久保存
    .then(() => {
      console.log('数据库表同步成功');
      // 检查是否已有用户数据，只有在没有用户时才插入测试数据
      return User.count();
    })
    .then((userCount) => {
      if (userCount === 0) {
        // 插入测试数据
        return User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: '$2a$10$eJ7y8V3e5G7H9I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8', // 加密后的密码
        });
      }
      return null;
    })
    .then((user) => {
      if (user) {
        // 插入测试任务
        return Task.bulkCreate([
          {
            userId: user.id,
            title: '完成项目文档',
            description: '编写项目的技术文档和用户手册',
            priority: 3,
            category: '工作',
            tags: ['文档', '重要'],
            dueDate: new Date(),
            completed: false,
          },
          {
            userId: user.id,
            title: '购买 groceries',
            description: '购买牛奶、鸡蛋、蔬菜等',
            priority: 2,
            category: '生活',
            tags: ['购物'],
            dueDate: new Date(),
            completed: true,
          },
          {
            userId: user.id,
            title: '健身',
            description: '去健身房锻炼1小时',
            priority: 1,
            category: '健康',
            tags: ['运动'],
            dueDate: new Date(),
            completed: false,
          },
        ]);
      }
      return null;
    })
    .catch((error) => {
      console.error('数据库同步失败:', error);
    });
});

// 将Sequelize模型添加到请求对象中
app.use((req, res, next) => {
  req.models = { User, Task };
  next();
});

// 路由
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(config.server.port, () => {
  console.log(`服务器运行在端口 ${config.server.port}`);
  console.log('使用MySQL数据库');
});