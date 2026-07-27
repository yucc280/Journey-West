# 西游迹｜《西游记》多维可视分析系统

这是一个基于 React + Vite + D3/ECharts 的《西游记》多维可视分析前端项目，围绕“地理路线、八十一难、人物关系、文本情感”四个维度，构建了一个可交互的文学知识可视化平台。

## 项目特色

- 以“总体概览”为入口，提供沉浸式专题介绍
- 支持多页面导航：总体概览、地理路线、八十一难、人物关系、词频情感
- 集成地图、时间轴、关系图、文本分析等可视化模块
- 支持与 AI 对话的智能助手入口
- 该项目已成功部署到 GitHub Pages ，可以通过访问 https://yucc280.github.io/Journey-West/#/ 查看


## 技术栈

- React 19
- Vite 7
- React Router
- D3.js
- ECharts
- Leaflet
- Express（用于 AI 代理接口）

## 目录结构

```text
journey-west-visualization/
├── public/
│   ├── data/              静态数据文件（如 CSV、JSON）
│   └── media/             图片、音频等资源文件
├── scripts/               辅助脚本
├── src/
│   ├── App.jsx            根组件，定义页面路由
│   ├── main.jsx           应用入口
│   ├── components/        人物关系相关图表组件
│   │   ├── charactercharts/ 人物关系相关图表组件
│   │   ├── common/          通用组件
│   │   ├── events/          八十一难相关组件
│   │   ├── layout/          顶部导航、布局组件
│   │   ├── map/             地图相关组件
│   │   ├── overview/        总览页相关组件
│   │   └── textcharts/      文本分析相关图表组件
│   ├── context/           全局上下文与状态管理
│   ├── data/              项目内使用的数据文件
│   ├── pages/             页面级组件
│   │   ├── CharactersPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── MapPage.jsx
│   │   ├── OverviewPage.jsx
│   │   └── TextAnalysisPage.jsx
│   └── styles/            全局样式与页面样式
├── .env.example           环境配置示例
├── server.js              AI 代理服务入口
├── package.json           项目依赖与脚本
├── package-lock.json      依赖锁文件，安装后生成
├── vite.config.js         Vite 配置（含 GitHub Pages 部署 base）
├── eslint.config.js       ESLint 配置
├── index.html             HTML 入口文件
└── README.md              项目说明
```

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动前端开发服务器

```bash
npm run dev
```

随后在浏览器中打开终端提示的地址，通常为：

```text
http://localhost:5173
```

### 3. 启动 AI 代理服务（可选）

如果要使用聊天助手相关功能，需要先配置环境变量。  
在根目录下新建 `.env` 文件（可参考 `.env.example`），并填入对应的 API Key： 
`ZHIPU_API_KEY=your_api_key_here `

然后新建一个终端启动后端代理服务：

```bash
node server.js
```

默认端口为：

```text
http://localhost:3001
```

## 主要页面

- 总体概览：展示项目主题、数据概况与主题引导
- 地理路线：展示西行路线与地理分布
- 八十一难：展示事件分布与章节时间线
- 人物关系：展示人物之间的联结关系
- 词频情感：分析文本中的高频词与情感波动

## 注意事项

- AI 对话功能依赖环境变量中的智谱 API Key，需在服务端环境中配置。
