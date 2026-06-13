# Pandas 学习网站 - 验证清单（Checklist）

## 项目基础与构建
- [ ] Checkpoint 1: `pnpm install` 安装依赖无致命报错；`pnpm dev` 成功启动开发服务器（默认 http://localhost:5173）。
- [ ] Checkpoint 2: `pnpm build` 成功生成 `dist/` 目录，输出大小合理，`dist/index.html` 引用的 JS/CSS 存在。
- [ ] Checkpoint 3: `dist/_redirects` 文件存在且内容为 `/*    /index.html   200`，解决 Cloudflare Pages SPA 刷新 404。
- [ ] Checkpoint 4: `vite.config.ts` 中显式包含 `optimizeDeps.exclude: ['pyodide']` 与 `resolve.dedupe: ['pyodide']`。
- [ ] Checkpoint 5: 开发/生产环境 `.wasm` 的响应头 `Content-Type` 为 `application/wasm`（可通过 devtools/curl 校验）。

## Pyodide 环境
- [ ] Checkpoint 6: 首次访问即触发 Pyodide v0.29.3 加载，页面顶部显示加载进度条，运行按钮被锁定。
- [ ] Checkpoint 7: 加载完成自动预装 micropip/numpy/pandas/matplotlib，随后弹出"环境就绪"提示并解锁运行。
- [ ] Checkpoint 8: 连续在不同页面/组件调用执行，仅存在一个 Pyodide 实例，无重复 wasm 下载（devtools 网络面板验证）。
- [ ] Checkpoint 9: 运行 `while True: pass` 在 10-15 秒内被强制终止，浏览器不卡死。
- [ ] Checkpoint 10: 页面离线（断网）后仍可在已加载环境中执行 Python 代码（本地缓存运行时）。

## 代码执行与结果渲染
- [ ] Checkpoint 11: 运行正常 `print("hello")`、数值计算，日志区完整显示 stdout。
- [ ] Checkpoint 12: 含 `SyntaxError` / `IndentationError` 的代码被识别为语法错误并给出中文解释。
- [ ] Checkpoint 13: `import xxx`（未安装模块）被识别为模块缺失并给出中文建议。
- [ ] Checkpoint 14: 运行时异常（KeyError/ValueError/TypeError/IndexError）被分类并给出中文提示。
- [ ] Checkpoint 15: 返回 DataFrame 的代码渲染为可滚动 HTML 表格；列名、数据可见。
- [ ] Checkpoint 16: matplotlib 绘图代码渲染为图片预览（base64 dataURL）。

## 数据集
- [ ] Checkpoint 17: `public/dataset/` 至少存在 10 份 CSV，文件可直接通过 URL 下载。
- [ ] Checkpoint 18: 在编辑器中执行 `pd.read_csv("/dataset/sales.csv")` 等所有数据集路径均成功无报错。
- [ ] Checkpoint 19: 数据集列表页展示每份数据集的列名、行数、类型、前 5 行预览。

## 编辑器功能
- [ ] Checkpoint 20: 编辑器具备语法高亮、行号、可编辑内容；支持 Ctrl/Cmd+Enter 快捷运行。
- [ ] Checkpoint 21: 工具栏的"清空/保存草稿/加载草稿/主题切换"按钮都可正常工作，刷新后草稿仍在。
- [ ] Checkpoint 22: 多标签（课程小节/自由编辑）独立草稿互不干扰。
- [ ] Checkpoint 23: 移动端布局下编辑区与输出区合理堆叠，不出现横向滚动条。

## 课程体系
- [ ] Checkpoint 24: 学习中心可访问 12 个项目，每个项目至少 1 小节。
- [ ] Checkpoint 25: 每节包含：知识点讲解、三套代码（演示/空白/答案）、5 道客观题 + 2 道代码题。
- [ ] Checkpoint 26: 点击"加载演示示例/加载空白练习/加载参考答案"，编辑器被一键替换且运行无模块/路径报错。
- [ ] Checkpoint 27: 章节示例直接运行能输出正确结果。

## 自测与打卡
- [ ] Checkpoint 28: 客观题提交后立即判分并显示解析；可重复作答。
- [ ] Checkpoint 29: 代码题提交后系统运行用户代码并与标准答案比对（表格/数值/文本），自动判分。
- [ ] Checkpoint 30: 正确率 < 60% 时打卡按钮禁用并提示；正确率 ≥ 60% 才可打卡。
- [ ] Checkpoint 31: 打卡成功后记录时间戳且不可撤销；刷新页面后状态保留。
- [ ] Checkpoint 32: 进度状态（未学习→已浏览→自测通过→打卡完成）真实反映并持久化。

## 仪表盘与错题本
- [ ] Checkpoint 33: 仪表盘展示：总进度、已打卡小节、自测平均分、错题总数、薄弱知识点、最近学习时间线，数值与本地存储一致。
- [ ] Checkpoint 34: 错题本汇总章节 + 结业测试错题，支持回看与重做。
- [ ] Checkpoint 35: 重做错题并答对后，错题本状态更新为已掌握/移除。

## 结业综合测试
- [ ] Checkpoint 36: 未完成全部打卡时测试入口禁用并提示剩余项目。
- [ ] Checkpoint 37: 进入测试后显示 90 分钟倒计时；刷新页面后计时合理累积。
- [ ] Checkpoint 38: 提交测试后生成测评报告：总分、各项目得分、薄弱项目 Top3、复习入口。

## 数据管理
- [ ] Checkpoint 39: 支持导出 JSON 备份并下载到本地。
- [ ] Checkpoint 40: 导入备份后仪表盘、错题本、课程状态恢复与备份前一致。
- [ ] Checkpoint 41: 清空本地数据需二次确认；确认后所有学习记录清空，仪表盘恢复初始空态。

## UI 与主题
- [ ] Checkpoint 42: 亮/暗主题可一键切换并持久化；默认跟随系统或浅色。
- [ ] Checkpoint 43: 主色 `#165DFF` 贯穿重要按钮、进度条、高亮。
- [ ] Checkpoint 44: 关键文字对比度（正文 vs 背景）≥ 4.5:1（可通过 Chrome Lighthouse/DevTools 校验）。
- [ ] Checkpoint 45: 响应式：PC 多栏、平板自适应、移动端单栏，关键页面无布局错位。

## 部署验证（Cloudflare Pages）
- [ ] Checkpoint 46: `dist/` 目录可直接上传/连接 git 仓库部署成功。
- [ ] Checkpoint 47: 站点首页 `https://your-site.pages.dev` 正常加载。
- [ ] Checkpoint 48: 刷新 `/lessons`、`/editor`、`/lessons/1` 等任意子路由不出现 404。
- [ ] Checkpoint 49: 线上环境 Pyodide 正常加载，编辑器可运行 pandas 代码、读取 `/dataset/*.csv`。
- [ ] Checkpoint 50: 无第三方广告/外链引流/付费弹窗。
