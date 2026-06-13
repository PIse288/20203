import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AppState,
  aggregateWrong,
  canCheckIn,
  clearWrong,
  dashboard as computeDashboard,
  doCheckIn,
  getLesson,
  loadState,
  markViewed,
  recordWrong,
  resetAll,
  saveState,
  setLesson,
} from '@/lib/storage';
import { totalLessons } from '@/data/curriculum';

interface AppCtx {
  state: AppState;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  markViewed: (lessonId: string) => void;
  setScore: (lessonId: string, score: number) => void;
  recordWrong: (lessonId: string, qid: string) => void;
  clearWrong: (lessonId: string, qid: string) => void;
  canCheckIn: (lessonId: string) => boolean;
  doCheckIn: (lessonId: string) => void;
  resetAll: () => void;
  importState: (next: AppState) => void;
  wrongList: { lessonId: string; qids: string[] }[];
  dashboard: { checkedIn: number; avg: number; totalWrong: number; percent: number };
  getLessonStatus: (lessonId: string) => AppState['lessons'][string] | undefined;
  allCheckedIn: boolean;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [state.theme]);

  const markViewedFn = useCallback((lessonId: string) => {
    setState((s) => markViewed(s, lessonId));
  }, []);
  const setScoreFn = useCallback((lessonId: string, score: number) => {
    setState((s) => {
      const prev = getLesson(s, lessonId);
      const best = Math.max(prev.score ?? 0, score);
      const next = setLesson(s, lessonId, {
        score: best,
        status: score >= 60 ? (prev.status === 'checkedIn' ? 'checkedIn' : 'quizPassed') : prev.status,
      });
      return next;
    });
  }, []);
  const recordWrongFn = useCallback((lessonId: string, qid: string) => {
    setState((s) => recordWrong(s, lessonId, qid));
  }, []);
  const clearWrongFn = useCallback((lessonId: string, qid: string) => {
    setState((s) => clearWrong(s, lessonId, qid));
  }, []);
  const canCheckInFn = useCallback((lessonId: string) => canCheckIn(state, lessonId), [state]);
  const doCheckInFn = useCallback((lessonId: string) => {
    setState((s) => doCheckIn(s, lessonId));
  }, []);
  const resetFn = useCallback(() => {
    resetAll();
    setState(loadState());
  }, []);
  const importFn = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);
  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
  }, []);

  const wrong = useMemo(() => aggregateWrong(state), [state]);
  const dash = useMemo(() => computeDashboard(state, totalLessons), [state]);
  const allCheckedIn = dash.checkedIn >= totalLessons && totalLessons > 0;

  const value = useMemo<AppCtx>(
    () => ({
      state,
      theme: state.theme,
      toggleTheme,
      markViewed: markViewedFn,
      setScore: setScoreFn,
      recordWrong: recordWrongFn,
      clearWrong: clearWrongFn,
      canCheckIn: canCheckInFn,
      doCheckIn: doCheckInFn,
      resetAll: resetFn,
      importState: importFn,
      wrongList: wrong,
      dashboard: dash,
      getLessonStatus: (id) => getLesson(state, id),
      allCheckedIn,
    }),
    [state, toggleTheme, markViewedFn, setScoreFn, recordWrongFn, clearWrongFn, canCheckInFn, doCheckInFn, resetFn, importFn, wrong, dash, allCheckedIn],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
