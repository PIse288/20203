import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { bootstrap, onProgress, runPython, type RunOutcome } from '@/lib/pyodide';

type Phase = 'idle' | 'loading' | 'ready' | 'error';

interface Ctx {
  phase: Phase;
  percent: number;
  message: string;
  ready: boolean;
  run: (code: string, timeoutMs?: number) => Promise<RunOutcome>;
}

const PyCtx = createContext<Ctx | null>(null);

export function PyodideProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('等待加载…');

  useEffect(() => {
    const unsub = onProgress(({ phase: ph, percent: pct, message: msg }) => {
      if (ph === 'error') {
        setPhase('error');
      } else {
        setPhase(pct >= 100 ? 'ready' : 'loading');
      }
      setPercent(pct);
      setMessage(msg);
    });
    bootstrap()
      .then(() => {
        setPhase('ready');
        setPercent(100);
        setMessage('环境就绪');
      })
      .catch((e: any) => {
        setPhase('error');
        setMessage('加载失败：' + (e?.message ?? String(e)));
      });
    return () => {
      unsub();
    };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      phase,
      percent,
      message,
      ready: phase === 'ready',
      run: (code, timeoutMs) => runPython(code, timeoutMs),
    }),
    [phase, percent, message],
  );

  return <PyCtx.Provider value={value}>{children}</PyCtx.Provider>;
}

export function usePyodide() {
  const ctx = useContext(PyCtx);
  if (!ctx) throw new Error('usePyodide must be used inside PyodideProvider');
  return ctx;
}
