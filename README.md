# 极简任务与日程管理工具

一个功能完整、界面美观的任务与日程管理工具，支持多设备访问，帮助用户更有效地管理个人任务和日程安排。

## 功能特性

### 1. 用户认证与个人中心模块
- 用户注册、登录、退出
- 密码修改、个人信息管理
- 数据安全与权限控制

### 2. 任务管理核心模块
- 任务添加、编辑、删除、完成/取消完成
- 任务优先级、分类、标签
- 按时间/状态筛选任务

### 3. 日程与日历模块
- 按日/按周查看日程
- 任务与日期绑定
- 日程提醒、到期提示

### 4. 数据统计与可视化模块
- 今日/本周/本月完成情况统计
- 任务完成率、未完成统计
- 图表展示（饼图、柱状图）

### 5. 界面交互与体验模块
- 响应式布局（电脑/手机适配）
- 暗黑模式/主题切换
- 操作动画、加载提示、友好提示

### 6. 后台数据服务模块
- 数据库设计（用户表、任务表）
- 前后端接口设计
- 数据增删改查、异常处理

### 7. AI 智能辅助模块（DeepSeek）
- 任务拆解为可执行步骤
- 任务优先级与耗时估算
- 日程安排建议
- 任务描述润色
- 自然语言搜索任务

## 技术栈

### 前端
- **框架**：React 19
- **语言**：TypeScript
- **UI框架**：Tailwind CSS v4
- **状态管理**：React Context + useReducer
- **路由**：React Router v7
- **图表库**：Chart.js
- **日期处理**：date-fns
- **表单处理**：React Hook Form
- **动画**：Framer Motion

### 后端
- **运行环境**：Node.js 18+
- **框架**：Express 4.x
- **数据库**：MySQL
- **认证**：JWT（JSON Web Token）
- **API设计**：RESTful API
- **验证**：express-validator

## 快速开始

### 前端启动

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

### 后端启动

1. 进入后端目录
```bash
cd backend
```

2. 配置环境变量
```bash
cp .env.example .env
```
在 `.env` 中填入 `DEEPSEEK_API_KEY` 等配置。

3. 安装依赖
```bash
npm install
```

4. 启动服务器
```bash
npm run start
```

## 项目结构

### 前端项目结构
```
src/
├── components/      # 通用组件
│   ├── auth/        # 认证相关组件
│   ├── tasks/       # 任务相关组件
│   ├── stats/       # 统计相关组件
│   └── ui/          # 通用UI组件
├── contexts/        # 全局状态管理
│   ├── AuthContext.tsx        # 认证上下文
│   ├── AuthContextType.ts     # 认证类型定义
│   ├── TaskContext.tsx        # 任务上下文
│   └── ThemeContext.tsx       # 主题上下文
├── hooks/           # 自定义Hooks
│   └── useAuth.ts             # 认证Hook
├── layouts/         # 布局组件
│   └── MainLayout.tsx         # 主布局
├── pages/           # 页面组件
│   ├── LoginPage.tsx          # 登录页面
│   ├── RegisterPage.tsx       # 注册页面
│   ├── TasksPage.tsx          # 任务页面
│   └── StatsPage.tsx          # 统计页面
├── services/        # API服务
│   └── api.ts                 # API服务
├── types/           # TypeScript类型定义
│   └── index.ts               # 类型定义
├── App.tsx          # 应用入口
└── main.tsx         # 渲染入口
```

### 后端项目结构
```
backend/
├── config/          # 配置文件
├── controllers/     # 控制器
├── middleware/      # 中间件
├── models/          # 数据模型
├── routes/          # 路由
├── services/        # 业务逻辑
├── utils/           # 工具函数
└── server.js        # 服务器入口
```

## API接口

### 用户相关接口
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息
- `PUT /api/users/password` - 修改密码

### 任务相关接口
- `GET /api/tasks` - 获取任务列表
- `GET /api/tasks/:id` - 获取单个任务
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务
- `PATCH /api/tasks/:id/toggle` - 切换任务完成状态
- `GET /api/tasks/stats/summary` - 获取任务统计

### AI 相关接口
- `POST /api/ai/breakdown` - AI 拆解任务
- `POST /api/ai/priority-estimate` - AI 估算优先级与耗时
- `POST /api/ai/polish` - AI 润色文本
- `POST /api/ai/schedule` - AI 日程建议
- `POST /api/ai/search` - AI 自然语言搜索

## 数据库设计

### 用户表（users）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | INT | 用户ID（自增主键） |
| username | VARCHAR(255) | 用户名 |
| email | VARCHAR(255) | 邮箱（唯一） |
| password | VARCHAR(255) | 密码（加密存储） |
| avatar | VARCHAR(255) | 头像URL |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 任务表（tasks）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | INT | 任务ID（自增主键） |
| user_id | INT | 所属用户ID（外键） |
| title | VARCHAR(255) | 任务标题 |
| description | TEXT | 任务描述 |
| priority | INT | 优先级（1-5） |
| category | VARCHAR(50) | 分类 |
| tags | JSON | 标签（JSON格式） |
| due_date | DATETIME | 截止日期 |
| completed | BOOLEAN | 是否完成 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 注意事项

1. 后端服务需要MySQL数据库支持，请确保本地或服务器上已安装并运行MySQL
2. 前端开发服务器默认运行在 http://localhost:5173
3. 后端服务器默认运行在 http://localhost:5000
4. 生产环境部署时，请修改配置文件中的JWT密钥和数据库连接字符串

## 常见问题

**Q：云端模式和本地模式有什么区别？**  
**A：**云端模式需要登录，任务数据通过后端API保存到服务器，可在多设备同步；本地模式（未登录）仅使用内置示例/临时数据，主要用于体验与开发调试，数据不会同步，刷新页面或更换设备会丢失。

## 许可证

MIT

欢迎阅读文档
