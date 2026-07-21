# 西游迹｜《西游记》多维可视分析系统

这是项目的 React 基础框架，已包含：

- 五个页面路由
- 统一顶部导航
- 全局章节、人物、地点、事件状态
- 东方古典与现代数据可视化结合的样式
- 地图、时间轴、人物网络、矩阵、文本分析的占位区域
- 响应式布局

## 安装与启动

```bash
npm install
npm run dev
```

浏览器打开终端中显示的本地地址，通常是：

```text
http://localhost:5173
```

## 目录说明

```text
src/
├── components/
│   ├── common/      通用面板、页面标题、章节范围组件
│   └── layout/      导航栏、筛选状态栏、统一布局
├── context/         全局分析状态
├── data/            当前模拟数据
├── pages/           五个页面
└── styles/          全局样式
```

## 后续开发建议

- 成员 A：MapPage、EventsPage
- 成员 B：CharactersPage、TextAnalysisPage
- 共同：OverviewPage、AnalysisContext、公共样式与数据字段

当前所有图表区域均为占位组件，后续可逐步替换为 D3 可视化组件。
