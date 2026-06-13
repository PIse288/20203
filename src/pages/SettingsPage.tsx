import { useRef, useState } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import type { AppState } from '@/lib/storage';

export function SettingsPage() {
  const { state, resetAll, importState, toggleTheme, theme } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function onExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pandas-learn-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('已导出备份，浏览器保存了一份 JSON。');
  }

  function onImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as AppState;
        if (!data.lessons) throw new Error('格式不正确');
        importState(data);
        setMsg('导入成功，进度已恢复。');
      } catch (e: any) {
        setMsg('导入失败：' + (e?.message ?? String(e)));
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">设置 & 数据管理</h1>
        <p className="mt-1 text-sm text-slate-500">所有学习数据仅保存在本地浏览器，可手动备份 / 清空。</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">界面主题</h2>
        <p className="mt-1 text-sm text-slate-500">切换亮/暗主题，仅影响当前设备。</p>
        <div className="mt-3 flex gap-2">
          <button onClick={toggleTheme} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
            当前：{theme === 'light' ? '亮色' : '暗色'}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">数据备份</h2>
        <p className="mt-1 text-sm text-slate-500">导出当前全部进度、打卡、错题记录，JSON 格式。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={onExport} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Download className="h-4 w-4" /> 导出 JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
            <Upload className="h-4 w-4" /> 从 JSON 恢复
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = '';
            }}
          />
        </div>
        {msg && <div className="mt-3 rounded-md bg-slate-50 p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">{msg}</div>}
      </section>

      <section className="rounded-xl border border-rose-200 bg-white p-4 shadow-sm dark:border-rose-900/50 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-rose-700 dark:text-rose-200">危险操作</h2>
        <p className="mt-1 text-sm text-slate-500">清空全部本地学习数据（进度、打卡、错题、草稿），不可撤销。</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (!confirm) {
                setConfirm(true);
                setTimeout(() => setConfirm(false), 5000);
              } else {
                resetAll();
                setConfirm(false);
                setMsg('已清空全部本地数据。');
              }
            }}
            className={
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white ' +
              (confirm ? 'bg-rose-600 hover:bg-rose-700' : 'bg-rose-500 hover:bg-rose-600')
            }
          >
            <Trash2 className="h-4 w-4" /> {confirm ? '再次点击以确认清空' : '清空本地数据'}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">关于</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>构建工具：Vite 6 · React 18 · TypeScript · TailwindCSS 3</li>
          <li>运行时：Pyodide v0.29.3（jsDelivr CDN）</li>
          <li>数据：LocalStorage 本地持久化，不向任何服务器上传</li>
        </ul>
      </section>
    </div>
  );
}
