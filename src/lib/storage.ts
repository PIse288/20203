// 本地持久化学习进度
// 课程（小节）进度状态
export type LessonStatus = 'idle' | 'viewed' | 'quizPassed' | 'checkedIn';

export interface LessonProgress {
  status: LessonStatus;
  score?: number; // 自测最高得分 0-100
  lastVisitedAt?: number;
  checkedInAt?: number; // 打卡时间戳，不可撤销
  wrongQuestionIds?: string[]; // 错题 id 列表
}

export interface AppState {
  version: 1;
  theme: 'light' | 'dark';
  lessons: Record<string, LessonProgress>;
  // 结业测试
  finalExam?: {
    unlocked: boolean;
    takenAt?: number;
    score?: number;
    weakTopics?: string[];
  };
  createdAt: number;
  updatedAt: number;
}

const KEY = 'pandas-learn-state-v1';

function defaultState(): AppState {
  return {
    version: 1,
    theme: 'light',
    lessons: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadState(): AppState {
  try {
    if (typeof localStorage === 'undefined') return defaultState();
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState) {
  try {
    if (typeof localStorage === 'undefined') return;
    const next = { ...state, updatedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function resetAll() {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function getLesson(state: AppState, lessonId: string): LessonProgress {
  return state.lessons[lessonId] ?? { status: 'idle' };
}

export function setLesson(state: AppState, lessonId: string, patch: Partial<LessonProgress>): AppState {
  const cur = getLesson(state, lessonId);
  const next: LessonProgress = { ...cur, ...patch };
  // 单调状态流转：idle -> viewed -> quizPassed -> checkedIn
  const order: LessonStatus[] = ['idle', 'viewed', 'quizPassed', 'checkedIn'];
  if (patch.status && order.indexOf(patch.status) < order.indexOf(cur.status)) {
    // 不回退
    next.status = cur.status;
  }
  return {
    ...state,
    lessons: { ...state.lessons, [lessonId]: next },
    updatedAt: Date.now(),
  };
}

export function markViewed(state: AppState, lessonId: string): AppState {
  const cur = getLesson(state, lessonId);
  if (cur.status === 'idle') return setLesson(state, lessonId, { status: 'viewed', lastVisitedAt: Date.now() });
  return setLesson(state, lessonId, { lastVisitedAt: Date.now() });
}

export function recordWrong(state: AppState, lessonId: string, qid: string): AppState {
  const cur = getLesson(state, lessonId);
  const list = Array.from(new Set([...(cur.wrongQuestionIds ?? []), qid]));
  return setLesson(state, lessonId, { wrongQuestionIds: list });
}

export function clearWrong(state: AppState, lessonId: string, qid: string): AppState {
  const cur = getLesson(state, lessonId);
  const list = (cur.wrongQuestionIds ?? []).filter((x) => x !== qid);
  return setLesson(state, lessonId, { wrongQuestionIds: list });
}

export function canCheckIn(state: AppState, lessonId: string) {
  const p = getLesson(state, lessonId);
  return !!p.score && p.score >= 60 && p.status !== 'checkedIn';
}

export function doCheckIn(state: AppState, lessonId: string): AppState {
  return setLesson(state, lessonId, { status: 'checkedIn', checkedInAt: Date.now() });
}

// 返回所有错题的汇总 (lessonId -> qids)
export function aggregateWrong(state: AppState): { lessonId: string; qids: string[] }[] {
  return Object.entries(state.lessons)
    .map(([lessonId, p]) => ({ lessonId, qids: p.wrongQuestionIds ?? [] }))
    .filter((x) => x.qids.length > 0);
}

// 学习仪表盘统计
export function dashboard(state: AppState, totalLessons: number) {
  const entries = Object.values(state.lessons);
  const checkedIn = entries.filter((e) => e.status === 'checkedIn').length;
  const scores = entries.map((e) => e.score).filter((s): s is number => typeof s === 'number');
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const totalWrong = entries.reduce((acc, e) => acc + (e.wrongQuestionIds?.length ?? 0), 0);
  const percent = Math.min(100, Math.round((checkedIn / Math.max(totalLessons, 1)) * 100));
  return { checkedIn, avg, totalWrong, percent };
}
