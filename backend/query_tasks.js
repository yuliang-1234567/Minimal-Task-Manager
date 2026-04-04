const config = require('./config/config');
const mysql = require('mysql2/promise');

async function queryTasks() {
  try {
    // 连接到MySQL数据库
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });

    console.log('成功连接到数据库');

    // 查询任务表数据
    const [rows] = await connection.execute('SELECT * FROM tasks');
    console.log('数据库中的任务数据：');
    console.table(rows);

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('查询任务数据失败:', error);
  }
}

queryTasks();