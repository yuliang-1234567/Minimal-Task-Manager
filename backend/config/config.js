module.exports = {
  // 数据库连接配置 - 使用MySQL
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '2816485259hyl',
    database: 'task_manager',
  },
  // JWT配置
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '7d',
  },
  // 服务器配置
  server: {
    port: process.env.PORT || 5000,
  },
};