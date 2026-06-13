// Pyodide v0.29.3 执行器（模块级单例）
// 运行时通过 <script> 动态引入 jsdelivr CDN，确保 wasm 走 CDN 而非本地 dist

export type RunOutcome =
  | { ok: true; output: string[]; tables: string[]; figures: string[]; durationMs: number; error: null }
  | { ok: false; output: string[]; tables: string[]; figures: string[]; durationMs: number; error: { type: 'syntax' | 'missing' | 'runtime' | 'timeout'; message: string; zh: string } };

let pyodideReady: Promise<any> | null = null;
let isBootstrapping = false;

// 把进度暴露给外部，用于顶部进度条
type ProgressCb = (payload: { phase: string; percent: number; message: string }) => void;
const listeners: ProgressCb[] = [];

export function onProgress(cb: ProgressCb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function emit(phase: string, percent: number, message: string) {
  for (const cb of listeners) cb({ phase, percent, message });
}

const PYODIDE_VERSION = '0.29.3';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

async function ensureLoader() {
  // 1. 已有全局 loadPyodide（已插入 <script>）
  if (typeof (globalThis as any).loadPyodide === 'function') return;
  // 2. 动态插入 script（浏览器环境）
  if (typeof document === 'undefined') {
    // Node/SSR 下的回退占位，不会真的运行
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${INDEX_URL}pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide runtime'));
    document.head.appendChild(script);
  });
}

export async function bootstrap(): Promise<any> {
  if (pyodideReady) return pyodideReady;
  if (isBootstrapping) {
    // 并发调用：等待同一个 Promise
    while (!pyodideReady) await new Promise((r) => setTimeout(r, 50));
    return pyodideReady;
  }
  isBootstrapping = true;
  pyodideReady = (async () => {
    emit('loader', 5, '正在加载 Pyodide 运行时…');
    await ensureLoader();
    emit('loader', 20, '初始化 Pyodide…');
    const loadPyodide = (globalThis as any).loadPyodide;
    if (!loadPyodide) throw new Error('Pyodide loader not available');
    const pyodide = await loadPyodide({ indexURL: INDEX_URL });
    emit('loader', 55, '安装 micropip…');
    await pyodide.loadPackage('micropip');
    emit('loader', 75, '安装 numpy / pandas / matplotlib…');
    const micropip = pyodide.pyimport('micropip');
    await micropip.install(['numpy', 'pandas', 'matplotlib']);
    emit('loader', 95, '准备辅助函数…');

    // Python helper: 捕获 stdout/stderr，eval 最后一条表达式并分类
    const bootstrapPy = `
import sys, io, base64, ast
import numpy as np, pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

class _Capture:
    def __init__(self):
        self.buf = io.StringIO()
    def write(self, data):
        self.buf.write(data); return len(data)
    def flush(self): pass
    def get(self): return self.buf.getvalue()

def _run_and_classify(src):
    out = _Capture(); err = _Capture()
    stdout0, stderr0 = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    result_kind, result_value = "none", None
    try:
        tree = ast.parse(src)
        if tree.body and isinstance(tree.body[-1], ast.Expr):
            exec_part = ast.Module(body=tree.body[:-1], type_ignores=[])
            eval_part = ast.Expression(body=tree.body[-1].value)
            exec(compile(exec_part, "<exec>", "exec"), globals())
            result_value = eval(compile(eval_part, "<eval>", "eval"), globals())
        else:
            exec(src, globals())
        # 对结果分类
        if isinstance(result_value, (pd.DataFrame, pd.Series)):
            html = result_value.to_html(classes=["dataframe"], max_rows=40, max_cols=20, float_format=lambda x: f"{x:.4g}")
            result_kind, result_value = "table", html
        else:
            # 检查是否存在 Figure (matplotlib)
            figs = [plt.figure(n) for n in plt.get_fignums()]
            if figs:
                buf = io.BytesIO()
                figs[-1].savefig(buf, format="png", dpi=110, bbox_inches="tight")
                buf.seek(0)
                data = base64.b64encode(buf.read()).decode("ascii")
                result_kind, result_value = "figure", data
                plt.close("all")
            elif result_value is not None:
                try:
                    result_kind, result_value = "text", repr(result_value)
                except Exception:
                    result_kind, result_value = "text", str(result_value)
            else:
                result_kind, result_value = "text", ""
    except SyntaxError as e:
        return ("syntax", f"{e.msg} (line {e.lineno})", out.get(), err.get(), result_value)
    except Exception as e:
        name = type(e).__name__
        return ("runtime", f"{name}: {e}", out.get(), err.get(), result_value)
    finally:
        sys.stdout, sys.stderr = stdout0, stderr0
    return (result_kind, result_value, out.get(), err.get())
`;
    pyodide.runPython(bootstrapPy);
    emit('loader', 100, '环境就绪');
    return pyodide;
  })();
  try {
    return await pyodideReady;
  } catch (e: any) {
    pyodideReady = null;
    isBootstrapping = false;
    emit('error', 0, '加载失败: ' + (e?.message || String(e)));
    throw e;
  } finally {
    isBootstrapping = false;
  }
}

function zhForError(type: string, message: string) {
  if (type === 'syntax') return `代码存在语法错误，请检查括号/缩进/冒号。详细：${message}`;
  if (message.startsWith('ModuleNotFoundError')) return `缺少依赖库：${message}`;
  if (message.startsWith('NameError')) return `使用了未定义的变量/函数。${message}`;
  if (message.startsWith('KeyError')) return `引用了不存在的列名或索引。${message}`;
  if (message.startsWith('ValueError')) return `值错误（可能是形状/类型不匹配）。${message}`;
  if (message.startsWith('TypeError')) return `类型错误（运算类型不兼容）。${message}`;
  if (message.startsWith('IndexError')) return `下标越界。${message}`;
  if (message.startsWith('ZeroDivisionError')) return `除零错误。${message}`;
  if (type === 'missing') return `运行依赖缺失：${message}`;
  if (type === 'timeout') return `代码执行超时（默认 15 秒）。如有死循环请调整逻辑。`;
  return `运行时错误：${message}`;
}

export async function runPython(code: string, timeoutMs = 15000): Promise<RunOutcome> {
  const start = performance.now();
  try {
    const pyodide = await bootstrap();
    const done = (async () => {
      const py = pyodide.globals.get('_run_and_classify');
      const result = py(code);
      try {
        const arr = result.toJs?.() ?? result;
        return arr;
      } finally {
        try { result?.destroy?.(); } catch {}
      }
    })();
    const timeout = new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error('__TIMEOUT__')), timeoutMs),
    );
    const arr = (await Promise.race([done, timeout])) as any[];
    const duration = performance.now() - start;

    const [kind, value, outStr, errStr] = arr;
    const output: string[] = [];
    if (outStr) output.push(outStr);
    if (errStr) output.push(errStr);

    // kind 分类
    if (kind === 'syntax') {
      return { ok: false, output, tables: [], figures: [], durationMs: duration, error: { type: 'syntax', message: value as string, zh: zhForError('syntax', value as string) } };
    }
    if (kind === 'runtime') {
      const message = value as string;
      const type = message.startsWith('ModuleNotFoundError') ? 'missing' : 'runtime';
      return { ok: false, output, tables: [], figures: [], durationMs: duration, error: { type, message, zh: zhForError(type, message) } };
    }
    const tables: string[] = [];
    const figures: string[] = [];
    if (kind === 'table') tables.push(value as string);
    if (kind === 'figure') figures.push(`data:image/png;base64,${value as string}`);
    if (kind === 'text' && value) output.push(value as string);
    return { ok: true, output, tables, figures, durationMs: duration, error: null };
  } catch (e: any) {
    const message = e?.message || String(e);
    const isTimeout = message === '__TIMEOUT__';
    const type = isTimeout ? 'timeout' : 'runtime';
    return {
      ok: false,
      output: [],
      tables: [],
      figures: [],
      durationMs: performance.now() - start,
      error: { type, message, zh: zhForError(type, message) },
    };
  }
}

export function isReady(): boolean {
  return !!pyodideReady;
}
