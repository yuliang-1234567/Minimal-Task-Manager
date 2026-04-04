const config = require('./config/config');
const mysql = require('mysql2/promise');

async function queryUsers() {
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

    // 查询用户表数据
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log('数据库中的用户数据：');
    console.table(rows);

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('查询用户数据失败:', error);
  }
}

queryUsers();