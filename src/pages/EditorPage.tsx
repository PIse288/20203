import { Editor } from '@/components/Editor';

const starter = `# 在这里自由编写 Python / Pandas 代码
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "名称": ["苹果", "香蕉", "橙子"],
    "单价": [5.8, 3.5, 4.2],
    "数量": [10, 18, 12],
})
df["总价"] = df["单价"] * df["数量"]
df
`;

export function EditorPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">自由代码编辑器</h1>
        <p className="mt-1 text-sm text-slate-500">基于 Pyodide v0.29.3 浏览器内运行，支持 Pandas / NumPy / Matplotlib。</p>
      </div>
      <Editor initialCode={starter} headerTitle="Pyodide · 在线 Python" mode="free" autoSaveKey="free-editor-draft" />
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div className="font-medium text-slate-700 dark:text-slate-100">小贴士</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>最后一行如果是表达式（例如 <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">df</code>），会以表格形式渲染；其他 <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">print()</code> 输出会出现在日志区。</li>
          <li>Matplotlib 图形会自动被捕获并以图片形式展示。</li>
          <li>代码草稿自动保存到浏览器 LocalStorage，刷新后仍保留。</li>
        </ul>
      </div>
    </div>
  );
}
