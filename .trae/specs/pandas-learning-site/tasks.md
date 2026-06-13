# Pandas 纯前端静态数据分析学习网站 - The Implementation Plan

> 任务优先级：P0=阻塞性关键路径；P1=重要功能；P2=优化/打磨。

## [ ] Task 1: 项目脚手架（Vite6 + React18 + TS + Tailwind3 + shadcn）
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 使用 Vite 初始化 React18 + TypeScript 项目（pnpm create vite@6 --template react-ts）。
  - 安装 TailwindCSS 3、PostCSS、autoprefixer，生成 `tailwind.config.js` / `postcss.config.js`。
  - 配置主色 `#165DFF`（`--primary`），扩展调色板/阴影/圆角，配置亮暗双主题（class 策略）。
  - 初始化 shadcn/ui：`components.json` + `/src/components/ui`（button, card, input, progress, toast, tabs, dialog, select, scroll-area, badge, separator, textarea, switch 等基础组件）。
  - 安装 react-router-dom 并搭建路由骨架：/、/lessons、/lessons/:lessonId、/editor、/wrongbook、/exam、/settings。
  - 配置 `vite.config.ts`：加入 `optimizeDeps.exclude: ['pyodide']`、`resolve.dedupe: ['pyodide']`；通过插件/中间件确保开发和生产构建中 `.wasm` MIME 为 `application/wasm`。
  - 配置 `public/_redirects`：`/*    /index.html   200`，构建后拷贝进 `dist` 目录（可放在 public 自动复制）。
  - 配置 `tsconfig`、`tsconfig.node.json`、`.eslintrc.cjs`、`.gitignore`、`index.html`（title/description/viewport）。
- **Acceptance Criteria Addressed**: AC-3、AC-13、AC-14、AC-16
- **Test Requirements**:
  - `programmatic` TR-1.1: `pnpm install && pnpm dev` 能启动，`pnpm build` 生成 `dist/` 且包含 `_redirects`。
  - `programmatic` TR-1.2: `vite.config.ts` 中存在 `optimizeDeps.exclude` / `resolve.dedupe` 配置。
  - `programmatic` TR-1.3: 开发服务器下访问任意 `.wasm` 返回头包含 `application/wasm`（可通过 curl 或 devtools 验证）。
  - `human-judgement` TR-1.4: 路由骨架页面可访问，亮/暗主题切换正常。
- **Notes**: 不要引入任何服务端框架；路由使用 MemoryRouter 以外的 BrowserRouter 即可。

## [ ] Task 2: Pyodide 全局单例与环境预装
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 新建 `src/lib/pyodide.ts`，模块级 `let pyodidePromise: Promise<PyodideInterface> | null = null`；`getPyodide()` 实现单例。
  - 使用 `loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/" })`，不依赖打包的 wasm。
  - 安装成功后立即 `await pyodide.loadPackage('micropip')`，然后 `micropip.install(['numpy','pandas','matplotlib'])`。
  - 封装 `runPython(code: string, opts?)`，带 stdout/stderr 回调、结果分类（DataFrame / matplotlib Figure / str/number）。
  - 提供全局 Context：`PyodideContext`（`state: 'idle'|'loading'|'ready'|'error'`，progress、message）。
  - 在 `App.tsx` 启动时触发一次预加载；页面顶部显示可视化进度条 + "环境就绪"toast。
  - 提供"停止当前执行"能力（通过 `pyodide.setInterruptBuffer` 或超时机制触发）。
- **Acceptance Criteria Addressed**: AC-1、AC-2、AC-4、AC-6
- **Test Requirements**:
  - `programmatic` TR-2.1: `getPyodide()` 连续两次调用返回同一实例的 Promise，控制台网络面板不重复下载 wasm。
  - `programmatic` TR-2.2: 在运行按钮逻辑中 `state!=='ready'` 时禁用按钮。
  - `programmatic` TR-2.3: 运行 `while True: pass` 能在 10-15 秒被超时终止，页面响应。
  - `human-judgement` TR-2.4: 进度条可读，"环境就绪"toast 出现。

## [ ] Task 3: 代码执行结果解析与中文错误解释
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 执行阶段统一走 `runPython`：捕获 stdout、stderr、异常 traceback。
  - 分类器识别：
    - 语法错误（SyntaxError / IndentationError）：定位信息 + 中文说明。
    - 模块缺失（ModuleNotFoundError: No module named xxx）：提示可能原因与建议（例如 "若需要额外库可尝试 micropip 安装"）。
    - 运行时异常（ValueError、KeyError、TypeError、IndexError 等）：给出中文提示语。
    - 超时：统一 "执行超时，已被终止"。
  - 结果解析：若返回值为 `pd.DataFrame` / `pd.Series`，调用 `df.to_html()` 返回 HTML 表格；若是 matplotlib Figure（或全局 `plt.gcf()`），通过 `fig.savefig` 到 BytesIO → base64 dataURL；其他类型使用 `repr` / `str` 输出。
  - 统一输出结构 `{ logs: string[], dataframes: string[], images: string[], errors: { type, message, zh }[] }`。
- **Acceptance Criteria Addressed**: AC-4、AC-6
- **Test Requirements**:
  - `programmatic` TR-3.1: 运行给定的三类错误样例，能分别归类到 `syntax/missing/runtime`。
  - `programmatic` TR-3.2: `pd.DataFrame(...)` 运行结果产生 HTML 表格片段。
  - `programmatic` TR-3.3: matplotlib 绘图代码生成 dataURL。

## [ ] Task 4: 在线代码编辑器组件
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 基于 CodeMirror 6 / @uiw/react-codemirror（或 Monaco Editor CDN 版）实现编辑区：语法高亮、行号、字体大小适中。
  - 顶部工具栏：运行、停止、清空、格式化（可选）、保存草稿、加载草稿、亮/暗主题同步。
  - 多标签：每个课程小节与"自由编辑"独立草稿（LocalStorage keyed by tabId）。
  - 右侧/下方输出面板分 Tab：日志、表格、图片、错误。
  - 编辑器组件暴露 `loadCode(code:string)` 方法用于一键填充。
  - PC 双栏、移动端单栏（编辑在上、输出在下）。
- **Acceptance Criteria Addressed**: AC-4、AC-7、AC-14
- **Test Requirements**:
  - `programmatic` TR-4.1: 加载一段代码并运行，日志区显示 stdout，表格区显示 to_html 内容。
  - `human-judgement` TR-4.2: 移动端 (<480px) 不横向溢出，输出在编辑下方。
  - `human-judgement` TR-4.3: 清空、保存、加载草稿交互可用。

## [ ] Task 5: 内置 CSV 数据集
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - 在 `public/dataset/` 提供至少 10 份 CSV：sales、revenue、users、attendance、retail、orders、products、employees、students、weather（中文列头，100-500 行，字段多样）。
  - 在 Pyodide 运行环境中 patch `pd.read_csv("/dataset/xxx.csv")`：通过 `fetch` 到本地临时文件或直接在 Python 侧使用 `pyodide.open_url`（或等价机制）读取，让路径透明可用。
  - 在"数据集"模块中列出可用 CSV 及其 schema（列名、类型、行数、前 5 行预览）。
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-5.1: 运行 `pd.read_csv("/dataset/sales.csv")` 返回正确行数/列数。
  - `programmatic` TR-5.2: 每一个数据集文件可被读取无 404。
  - `human-judgement` TR-5.3: 数据集列表页面展示 schema 和样例数据。

## [ ] Task 6: 课程数据体系（12 项目）
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 创建 `src/data/curriculum.ts`（或 JSON 模块），结构：
    - `Project[]`: id, title, description, lessons: `Lesson[]`。
    - `Lesson`: id, title, intro(markdown), codeSamples { demo, blank, answer }, quiz { objectiveQuiz: QuizQuestion[], codingQuiz: CodingQuestion[] }。
    - `QuizQuestion`: id, stem, options[], correctIndex, explanation（中文）。
    - `CodingQuestion`: id, stem, starterCode, solutionCode, checker（通过运行后比对：如期望 stdout / 期望 DataFrame shape/首行 / 期望数值，以可解析的断言表达）。
  - 编写 12 项目内容，每项目 1-3 小节，保证每节含：讲解 + 三套代码 + 5 客观题 + 2 代码题。
- **Acceptance Criteria Addressed**: AC-7、AC-8、AC-15
- **Test Requirements**:
  - `programmatic` TR-6.1: 每节至少含 5 道客观题 + 2 道代码题；共 12 项目。
  - `human-judgement` TR-6.2: 示例代码直接运行能出正确结果，无报错。

## [ ] Task 7: 本地持久化层（LocalStorage + IndexedDB）
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - `src/lib/storage.ts`：封装 key 常量、版本迁移、读写降级。
  - LocalStorage 存：主题、课程进度（已浏览/自测通过/打卡）、小节打卡时间戳、客观题答题记录摘要、草稿元数据。
  - IndexedDB 存：代码草稿内容（较大字符串）、错题明细、学习时间线（事件流）、结业测评报告、代码题运行结果。
  - 提供 `exportBackup(): Blob`、`importBackup(json)`、`clearAll()` 三个 API。
  - 进度状态机：`idle → viewed → quizPassed → checkedIn`，单调不回退。
- **Acceptance Criteria Addressed**: AC-9、AC-10、AC-12
- **Test Requirements**:
  - `programmatic` TR-7.1: 写入 + 读取 + 刷新后数据保留；`clearAll` 后所有键值清空。
  - `programmatic` TR-7.2: 已打卡状态不可通过 UI 回退（不可撤销）。

## [ ] Task 8: 学习中心页面（课程列表 + 小节页）
- **Priority**: P0
- **Depends On**: Task 4, Task 6, Task 7
- **Description**:
  - `/lessons`：12 项目卡片网格，显示项目进度条、已打卡数。
  - `/lessons/:lessonId`：左侧目录树，右侧主内容分三个 Tab：
    1. 讲解与示例（含一键填充按钮：演示/空白/答案）。
    2. 自测（客观题 5 道 + 代码题 2 道 + 提交按钮 + 判分）。
    3. 打卡区（显示当前正确率；≥60% 解锁打卡按钮；已打卡显示时间；不可撤销）。
  - 编辑器内嵌在讲解区下方或侧边（PC 双栏）。
- **Acceptance Criteria Addressed**: AC-7、AC-8、AC-9、AC-15
- **Test Requirements**:
  - `programmatic` TR-8.1: 提交自测后自动判分，页面上显示得分与正确率。
  - `programmatic` TR-8.2: 正确率 <60% 时打卡按钮为 `disabled`。
  - `human-judgement` TR-8.3: 一键填充后代码正确，运行通过。

## [ ] Task 9: 首页仪表盘
- **Priority**: P1
- **Depends On**: Task 7
- **Description**:
  - `/`：卡片化展示：总学习进度（已打卡小节/总小节）、已打卡数、自测平均分、错题总数、薄弱知识点（按章节错误率排序）、最近学习时间线（最近 n 条）。
  - 提供快捷入口：继续学习、错题本、综合测试、设置。
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `human-judgement` TR-9.1: 无学习数据时展示空态；有数据时卡片数值与 LocalStorage/IndexedDB 一致。

## [ ] Task 10: 错题本
- **Priority**: P1
- **Depends On**: Task 7
- **Description**:
  - `/wrongbook`：按章节聚合；展示题干、用户答案、正确答案、解析、重做入口。
  - 重做：将题目重新进入独立答题/编辑器，提交后更新错题本状态。
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `human-judgement` TR-10.1: 错题能被列出、重做；重做正确后从错题本移除（或标记"已掌握"）。

## [ ] Task 11: 结业综合测试
- **Priority**: P1
- **Depends On**: Task 2, Task 4, Task 6, Task 7
- **Description**:
  - `/exam`：检测 12 项目是否全部打卡，未打卡禁用并提示还需完成项目。
  - 测试页：90 分钟倒计时（localStorage 记录起始时间，刷新累计）；客观题 20 道 + 代码题 5 道；逐题或分卷提交。
  - 提交后生成报告：总分、各项目得分分布、薄弱项目 Top3、建议复习入口、历史成绩。
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `human-judgement` TR-11.1: 未全部打卡时禁用入口；全部打卡后可进入。
  - `programmatic` TR-11.2: 报告写入 IndexedDB，可在仪表盘查看最近成绩。

## [ ] Task 12: 设置 / 数据管理页
- **Priority**: P1
- **Depends On**: Task 7
- **Description**:
  - `/settings`：主题切换、字体大小、导出备份（下载 JSON）、导入备份（文件选择）、清空本地数据（二次确认对话框）。
- **Acceptance Criteria Addressed**: AC-12
- **Test Requirements**:
  - `programmatic` TR-12.1: 导出的 JSON 可再次导入并恢复状态。
  - `programmatic` TR-12.2: 清空后所有持久化键值删除。

## [ ] Task 13: UI 规范化与响应式打磨
- **Priority**: P1
- **Depends On**: Task 1, Task 8, Task 9, Task 10, Task 11, Task 12
- **Description**:
  - 统一使用 shadcn 主题变量，主色 `#165DFF`，中性灰；圆角、阴影一致。
  - 关键文字对比度 AA（浅色 >= 4.5:1，深色亦然）。
  - 响应式断点：移动端/平板/桌面（tailwind sm/md/lg）。
  - 页面切换与 Tab 切换加过渡动画（duration-150/200）。
- **Acceptance Criteria Addressed**: AC-14
- **Test Requirements**:
  - `human-judgement` TR-13.1: 检查 3 个典型断点下各主要页面布局正常。

## [ ] Task 14: 构建产物与部署配置验证
- **Priority**: P0
- **Depends On**: Task 1 - Task 13
- **Description**:
  - 执行 `pnpm build`，确保 `dist/` 输出正确：
    - 无重复 wasm 文件（本项目不打包 wasm）。
    - `_redirects` 文件存在且内容为 `/*    /index.html   200`。
    - `public/dataset/*.csv` 原样输出。
  - 编写 README：项目简介、功能清单、安装构建、GitHub 推送、Cloudflare Pages 配置（框架预设 Vite，构建命令 pnpm build，输出目录 dist，环境变量无）、SPA 路由配置说明、常见问题。
- **Acceptance Criteria Addressed**: AC-13、AC-16
- **Test Requirements**:
  - `programmatic` TR-14.1: `dist/_redirects` 内容正确；`dist/dataset` 至少 10 份 CSV。
  - `human-judgement` TR-14.2: README 步骤可让用户从 0 到部署成功。
