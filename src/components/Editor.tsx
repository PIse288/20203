import { useEffect, useMemo, useState } from 'react';
import { usePyodide } from '@/lib/pyodide-context';
import { Copy, Play, Trash2, Check } from 'lucide-react';

interface OutputBlock {
  kind: 'log' | 'table' | 'figure' | 'error';
  content: string;
}

interface EditorProps {
  initialCode?: string;
  expectedTables?: number[]; // 期望的行数/列数
  expectedText?: string; // 期望的关键字/文本片段
  onAutoScore?: (score: number) => void;
  headerTitle?: string;
  showRun?: boolean;
  placeholder?: string;
  mode?: 'lesson' | 'free';
  autoSaveKey?: string;
}

export function Editor({
  initialCode = '',
  headerTitle = '代码编辑器',
  showRun = true,
  placeholder = '在此编写 Python 代码',
  mode = 'free',
  autoSaveKey,
}: EditorProps) {
  const { run, ready } = usePyodide();
  const [code, setCode] = useState<string>(() => {
    if (autoSaveKey) {
      try {
        const saved = localStorage.getItem(autoSaveKey);
        if (saved) return saved;
      } catch {}
    }
    return initialCode;
  });
  const [running, setRunning] = useState(false);
  const [blocks, setBlocks] = useState<OutputBlock[]>([]);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setLineCount(code.split('\n').length);
  }, [code]);

  useEffect(() => {
    if (autoSaveKey) {
      try {
        localStorage.setItem(autoSaveKey, code);
      } catch {}
    }
  }, [code, autoSaveKey]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1).join('\n');
  }, [lineCount]);

  async function onRun() {
    if (!ready || running) return;
    setRunning(true);
    setBlocks([{ kind: 'log', content: '> 正在执行...' }]);
    const result = await run(code);
    const next: OutputBlock[] = [];
    if (result.output.length) next.push({ kind: 'log', content: result.output.join('\n') });
    result.tables.forEach((html) => next.push({ kind: 'table', content: html }));
    result.figures.forEach((src) =>
      next.push({ kind: 'figure', content: `<img src="${src}" style="max-width:100%;border-radius:8px;margin-top:8px;" />` }),
    );
    if (!result.ok && result.error) {
      next.push({ kind: 'error', content: result.error.zh });
    }
    setBlocks(next);
    setRunning(false);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-100">{headerTitle}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              });
            }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={() => setCode('')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Trash2 className="h-3.5 w-3.5" /> 清空
          </button>
          {showRun && (
            <button
              disabled={!ready || running}
              onClick={onRun}
              className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? '执行中…' : ready ? '运行' : '等待环境…'}
            </button>
          )}
        </div>
      </div>

      <div className="relative flex">
        <pre className="select-none bg-slate-50 p-3 text-right text-xs leading-5 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
{lineNumbers}
        </pre>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder={placeholder}
          className="min-h-[240px] flex-1 resize-y bg-white p-3 font-mono text-[13px] leading-5 text-slate-800 outline-none placeholder:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {blocks.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950/60">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">输出</div>
          {blocks.map((b, i) => (
            <div key={i} className="mb-2">
              {b.kind === 'log' && (
                <pre className="whitespace-pre-wrap rounded-md bg-white p-3 text-xs text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800">{b.content}</pre>
              )}
              {b.kind === 'error' && (
                <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">{b.content}</div>
              )}
              {b.kind === 'table' && (
                <div
                  className="overflow-x-auto rounded-md bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  dangerouslySetInnerHTML={{ __html: styleTable(b.content) }}
                />
              )}
              {b.kind === 'figure' && (
                <div
                  className="rounded-md bg-white p-2 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  dangerouslySetInnerHTML={{ __html: b.content }}
                />
              )}
            </div>
          ))}
          {mode === 'lesson' && (
            <div className="text-xs text-slate-500">* 练习代码自动保存在本地（草稿），刷新后不会丢失。</div>
          )}
        </div>
      )}
    </div>
  );
}

function styleTable(html: string) {
  // pandas 默认输出的 class="dataframe" 表格样式注入（支持暗/亮主题）
  const wrapper = html
    .replace(/class="dataframe"/g, 'style="width:100%;border-collapse:collapse;font-size:12px;"')
    .replace(/<th>/g, '<th style="background:#f1f5f9;color:#0f172a;padding:6px 10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">')
    .replace(/<td>/g, '<td style="padding:5px 10px;border:1px solid #e2e8f0;color:#334155;">')
    .replace(/<tr[^>]*>/g, (m) => {
      // 保留原属性，给奇数行添加浅灰背景
      if (m.includes('style')) return m;
      return '<tr style="background:#ffffff;">';
    });
  return wrapper;
}
