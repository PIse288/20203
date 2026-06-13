# Pandas 纯前端静态数据分析学习网站 - Product Requirement Document

## Overview
- **Summary**: 基于 React18 + TypeScript + Vite6 + TailwindCSS3 + shadcn/ui 构建的纯前端静态学习网站，通过 Pyodide WebAssembly 在浏览器内运行真实 Python/Pandas 代码，配套 12 个递进式课程项目、代码编辑器、自测、打卡、错题本、结业测试与学习仪表盘，所有数据仅在本地持久化（LocalStorage + IndexedDB），100% 永久免费无广告。
- **Purpose**: 为零基础到进阶学习者提供一个"无需安装环境、打开即学即练"的 Pandas 学习平台，通过真实代码执行 + 自动判分 + 学习追踪，系统性地掌握 Pandas 数据分析全流程。
- **Target Users**: 数据分析初学者、Python 学习者、在校学生、想快速掌握 Pandas 的在职人员。

## Goals
- 提供一个开箱即用、无需安装任何 Python 环境的 Pandas 学习平台
- 课程体系完整（12 个项目），知识点讲解 + 示例 + 练习 + 自测 + 打卡一条龙
- 代码编辑器稳定可靠，根治频繁报错：Pyodide 单例加载、环境预装、超时保护、MIME 正确、Cloudflare 可部署
- 学习数据本地永久保存，不上传任何用户数据，保护隐私
- 一键部署到 Cloudflare Pages，SPA 刷新 404 问题解决

## Non-Goals (Out of Scope)
- 不做后端服务器、不做用户注册登录、不做云端同步
- 不做付费课程、会员、付费解锁、广告、外链引流
- 不做协作编辑、多人共享、实时评论等社交功能
- 不做除 Pandas/numpy/matplotlib/micropip 之外的 Python 生态库预装（用户可自行通过 micropip 安装，但非默认支持）
- 不做移动端原生 App，仅浏览器访问

## Background & Context
- Pyodide v0.29.3 是成熟稳定的 WebAssembly Python 运行时，可在浏览器内完整运行 numpy/pandas/matplotlib
- Vite6 为现代化前端构建工具，配合 React18 + TS 有成熟的开发/生产链路
- shadcn/ui 基于 Radix UI + Tailwind，提供高质量可定制组件
- Cloudflare Pages 是主流的静态站点托管平台，SPA 部署需注意 _redirects 文件和 MIME 类型
- 纯前端 + 本地存储的架构，天然符合"100% 免费、无后端、无用户数据上传"的约束

## Functional Requirements
- **FR-1**: 首页仪表盘，展示总进度、已打卡小节、自测平均分、错题总数、薄弱知识点、最近学习时间线
- **FR-2**: 12 个完整的 Pandas 递进学习项目，每章节含：知识点讲解、示例代码、空白练习、参考答案
- **FR-3**: 在线代码编辑器：语法高亮、行号、格式化、清空、草稿自动保存、多标签、亮/暗主题、PC/移动端适配
- **FR-4**: Pyodide 全局单例加载（v0.29.3 官方 CDN），后台预装 micropip/numpy/pandas/matplotlib，显示加载进度条，加载完成提示"环境就绪"
- **FR-5**: 代码执行：接管 stdout/stderr，区分日志/语法错误/库缺失/运行时异常并中文翻译解释；DataFrame 渲染为表格、matplotlib 转为图片预览、普通文本显示在日志区
- **FR-6**: 内置 10 套行业 CSV 数据集（销售/营收/用户/考勤/零售等），支持 `pd.read_csv("/dataset/xxx.csv")` 直接读取
- **FR-7**: 代码超时保护与中断机制，防止死循环阻塞页面
- **FR-8**: 章节三套代码一键填充：演示示例/空白练习/参考答案，填充后直接运行
- **FR-9**: 章节自测：5 道单选/判断 + 2 道代码实操；客观题自动判分 + 解析；代码题自动比对标准答案打分
- **FR-10**: 小节打卡：自测正确率 ≥ 60% 方可打卡，打卡时间本地永久保存、不可撤销
- **FR-11**: 细粒度进度追踪：未学习 → 已浏览 → 自测通过 → 打卡完成，实时自动保存
- **FR-12**: 错题本：汇总所有章节 + 结业测试错题，绑定小节，支持回看重做
- **FR-13**: 结业综合测试：12 个项目全部打卡后解锁；20 道客观题 + 5 道高阶代码大题；限时 90 分钟；输出个人测评报告，标注薄弱项目与复习入口
- **FR-14**: 数据管理：导出备份学习进度（JSON）、清空本地数据重置记录
- **FR-15**: 亮/暗双主题切换，简约教育风格，主色 #165DFF，PC + 移动端 100% 响应式
- **FR-16**: Vite 构建产物固定为 `dist`，自动生成 Cloudflare Pages `_redirects` 文件，SPA 刷新 404 解决
- **FR-17**: `vite.config.ts` 配置 optimizeDeps.exclude、resolve.dedupe、wasm MIME 类型为 application/wasm（开发 + 生产）
- **FR-18**: README 包含 GitHub 上传、Cloudflare Pages 一键部署全流程

## Non-Functional Requirements
- **NFR-1 (性能)**: Pyodide 首次加载不阻塞 UI；页面切换不重新下载 wasm；加载完成后断网仍可使用已加载库
- **NFR-2 (可靠性)**: 代码执行超时保护；本地存储写入失败有降级提示；不出现 MIME/404 导致编辑器不可用
- **NFR-3 (隐私)**: 不发送任何用户数据到服务器；所有学习记录仅存本地
- **NFR-4 (可部署性)**: `pnpm build` 产物可直接部署到 Cloudflare Pages；首屏/刷新无 404
- **NFR-5 (可访问性)**: 文字对比度符合 WCAG AA；键盘可操作；语义化 HTML
- **NFR-6 (可维护性)**: 代码风格一致，shadcn 组件统一封装，课程数据与业务逻辑解耦
- **NFR-7 (响应式)**: PC (>1024px) 多列布局，移动端（<768px）单列堆叠，编辑器区域自适应

## Constraints
- **Technical**: React 18、TypeScript、Vite 6、TailwindCSS 3、shadcn/ui、Pyodide v0.29.3（官方 jsdelivr CDN）、无后端
- **Business**: 永久免费、无广告、无付费、无用户数据上传
- **Dependencies**: pyodide npm 包（仅用于 TS 类型）；实际运行时从 CDN 加载 v0.29.3；不将 wasm 打包进项目

## Assumptions
- 学习者使用现代浏览器（支持 WebAssembly、ES Module、IndexedDB），推荐 Chrome/Edge/Firefox/Safari 最新版
- 部署平台为 Cloudflare Pages，具备正确的静态文件 MIME 回退能力
- 学习者首次使用时有网络，以便从 jsdelivr CDN 下载 Pyodide 运行时
- 学习者知道本地存储的风险（清空浏览器数据会丢失学习记录），并可通过"导出备份"功能提前保存

## Acceptance Criteria

### AC-1: Pyodide 首次加载与进度提示
- **Given**: 用户首次访问网站或浏览器无 Pyodide 缓存
- **When**: 打开首页或代码编辑器页面
- **Then**: 显示可可视化的加载进度条，锁定"运行"按钮；`loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/" })` 被调用；随后自动通过 micropip 安装 numpy/pandas/matplotlib；全部就绪后弹出"环境就绪"提示并解锁运行按钮
- **Verification**: `programmatic` + `human-judgment`
- **Notes**: 可通过查看控制台与页面 UI 双重验证

### AC-2: Pyodide 单例与页面切换不复用下载
- **Given**: Pyodide 已成功初始化
- **When**: 在页面间切换（学习页 / 编辑器 / 仪表盘）或多次点击运行
- **Then**: 仅存在一个 Pyodide 实例（模块级 Promise 缓存），不重复下载 wasm，控制台无重复网络请求日志
- **Verification**: `programmatic`

### AC-3: Vite 配置与 wasm MIME
- **Given**: 项目根目录存在 `vite.config.ts`
- **When**: 审查配置并在开发/生产构建后验证
- **Then**: 配置包含 `optimizeDeps.exclude: ['pyodide']`、`resolve.dedupe: ['pyodide']`，并在开发服务器与生产构建中 `.wasm` 返回 `Content-Type: application/wasm`；`dist` 目录生成且不含 wasm 本体
- **Verification**: `programmatic`

### AC-4: 代码执行与输出分类
- **Given**: 环境就绪
- **When**: 在编辑器分别运行：正常 print 代码、含语法错误的代码、未安装库的 import、含运行时异常的代码、输出 DataFrame 的代码、绘制 matplotlib 的代码
- **Then**: stdout 完整捕获；语法错误/库缺失/运行时异常以中文原因解释区分展示；DataFrame 渲染为可滚动表格；matplotlib 渲染为图片预览；普通文本/数值显示于日志区
- **Verification**: `programmatic` + `human-judgment`

### AC-5: 内置 CSV 数据集可用
- **Given**: 环境就绪，数据集文件放在 `public/dataset/` 下至少 10 份 CSV
- **When**: 运行 `pd.read_csv("/dataset/sales.csv")` 及其他数据集路径
- **Then**: 读取成功，返回正常 DataFrame；无 404、无路径报错
- **Verification**: `programmatic`

### AC-6: 超时保护
- **Given**: 环境就绪
- **When**: 运行含死循环的 Python 代码（如 `while True: pass`）
- **Then**: 达到预设超时后（默认 10-15 秒）强制终止执行并提示"执行超时"，页面不卡死
- **Verification**: `programmatic`

### AC-7: 三套代码一键填充
- **Given**: 用户进入任一课程小节
- **When**: 点击"加载演示示例 / 加载空白练习 / 加载参考答案"按钮
- **Then**: 编辑器内容被完整替换为对应代码；可直接点击运行出正确结果；无模块缺失、无路径报错
- **Verification**: `human-judgment`

### AC-8: 章节自测与代码题自动判分
- **Given**: 环境就绪，用户在小节自测页
- **When**: 完成 5 道客观题并提交；完成 2 道代码实操题并提交
- **Then**: 客观题立即判分并展示解析；代码题运行后与标准答案（表格/数值/文本）自动比对打分
- **Verification**: `programmatic` + `human-judgment`

### AC-9: 小节打卡与进度追踪
- **Given**: 用户完成自测
- **When**: 自测正确率 ≥ 60% 可点击打卡；< 60% 则打卡按钮禁用并提示
- **Then**: 打卡成功后记录时间戳且不可撤销；进度状态由"未学习 → 已浏览 → 自测通过 → 打卡完成"逐级流转；所有状态写入 LocalStorage/IndexedDB；刷新页面后状态保留
- **Verification**: `programmatic`

### AC-10: 错题本与仪表盘
- **Given**: 用户做过错题并打卡过部分章节
- **When**: 访问"错题本"与"仪表盘"页面
- **Then**: 错题本按章节汇总错题，支持回看与重做；仪表盘展示总进度、打卡数、自测平均分、错题总数、薄弱知识点、最近学习时间线
- **Verification**: `human-judgment`

### AC-11: 结业测试解锁与测评报告
- **Given**: 12 个项目全部打卡完成
- **When**: 访问"综合测试"页
- **Then**: 测试入口解锁；开始测试后限时 90 分钟，内含 20 道客观题 + 5 道代码大题；完成后输出测评报告并标注薄弱项目与复习入口
- **Verification**: `human-judgment`

### AC-12: 数据管理
- **Given**: 用户已有学习数据
- **When**: 点击"导出备份"与"清空本地数据"
- **Then**: 导出下载 JSON 备份；清空后所有学习记录清零并提示确认二次确认
- **Verification**: `programmatic`

### AC-13: Cloudflare Pages 部署与 SPA 路由
- **Given**: 执行 `pnpm build` 成功
- **When**: 将 `dist` 目录部署到 Cloudflare Pages
- **Then**: 首页加载正常；刷新 `/lessons/1` 等子路由返回首页不 404；代码编辑器正常加载与运行
- **Verification**: `programmatic` + `human-judgment`

### AC-14: 响应式与主题
- **Given**: 用户在 PC / 平板 / 手机浏览器访问
- **When**: 分别查看各页面、切换亮/暗主题
- **Then**: PC 多列、移动端单列堆叠；亮暗主题切换即时生效且不丢失学习状态；文字对比度符合无障碍标准
- **Verification**: `human-judgment`

### AC-15: 12 个课程项目内容完整性
- **Given**: 访问学习中心
- **When**: 依次查看 12 个项目的各小节
- **Then**: 每节均含：讲解、示例代码、空白练习、参考答案、自测（5 客观 + 2 代码）、打卡入口；无功能删减
- **Verification**: `human-judgment`

### AC-16: README 部署流程
- **Given**: 项目根目录存在 README
- **When**: 阅读 README
- **Then**: README 明确记录 GitHub 上传流程、`pnpm install/build` 流程、Cloudflare Pages 配置（构建命令、输出目录、环境变量/框架预设）、_redirects 的作用
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要额外支持代码保存到本地文件（非仅草稿）？— 默认不做，仅保留编辑器草稿。
- [ ] 结业测试的"90 分钟限时"是否支持中途关闭页面仍计时？— 默认使用本地时间戳累计，关闭页面期间不计时。
- [ ] 12 项目的具体章节细分粒度（每项目拆几小节）是否有偏好？— 默认每项目 1-3 节，总量约 20-25 节。
- [ ] 是否需要支持导出为 PDF 学习进度报告？— 默认不做，仅导出 JSON 备份。
