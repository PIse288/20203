# Pandas 学习平台

基于 Vite 6 + React 18 + TypeScript + TailwindCSS 3 的交互式 Pandas 学习平台脚手架。

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite 6
- **样式**：TailwindCSS 3 + CSS 变量（shadcn/ui 风格）
- **组件库**：手动集成的 shadcn/ui 基础组件
- **路由**：react-router-dom (BrowserRouter)
- **图标**：lucide-react

## 快速开始

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 目录结构

- `src/components/ui/` — 基础 UI 组件（shadcn/ui）
- `src/components/layout/` — 布局组件（Header、Sidebar）
- `src/pages/` — 页面路由
- `src/lib/` — 工具函数

## 路由

- `/` — 首页
- `/lessons` — 课程列表
- `/lessons/:lessonId` — 课程详情
- `/editor` — 代码编辑器
- `/wrongbook` — 错题本
- `/exam` — 测验
- `/settings` — 设置

> 完整 README 将在后续任务中补充。
