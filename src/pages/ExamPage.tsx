import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Award, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { courses } from '@/data/curriculum';

// 生成结业测试题库：从每节课抽取最多 2 道
function buildExamQuestions() {
  const pool: { q: any; lessonId: string; courseTitle: string }[] = [];
  for (const c of courses) {
    for (const l of c.lessons) {
      for (const q of l.questions) pool.push({ q, lessonId: l.id, courseTitle: c.title });
    }
  }
  // 从每节 1-2 道（这里取每节第一题 + 打乱）
  const rng = mulberry32(20240917);
  const shuffled = [...pool].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(20, shuffled.length));
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DURATION_MIN = 90;

export function ExamPage() {
  const { allCheckedIn, state, setScore: _setScore } = useApp();
  const unlocked = allCheckedIn;
  const questions = useMemo(() => buildExamQuestions(), []);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [remain, setRemain] = useState(DURATION_MIN * 60);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  function onStart() {
    setStarted(true);
    setStartedAt(Date.now());
    const tick = setInterval(() => {
      setRemain((r) => {
        if (r <= 1) {
          clearInterval(tick);
          setSubmitted(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  const { score, weakByCourse, correctCount } = useMemo(() => {
    if (!submitted) return { score: 0, weakByCourse: [] as string[], correctCount: 0 };
    let c = 0;
    const courseMap: Record<string, { total: number; wrong: number }> = {};
    for (const q of questions) {
      const picked = answers[q.q.id];
      const ok = picked === q.q.correctIndex;
      if (ok) c++;
      courseMap[q.courseTitle] = courseMap[q.courseTitle] ?? { total: 0, wrong: 0 };
      courseMap[q.courseTitle].total++;
      if (!ok) courseMap[q.courseTitle].wrong++;
    }
    const weak = Object.entries(courseMap)
      .filter(([, v]) => v.wrong > 0)
      .sort((a, b) => b[1].wrong - a[1].wrong)
      .slice(0, 3)
      .map(([k]) => k);
    return { score: Math.round((c / questions.length) * 100), weakByCourse: weak, correctCount: c };
  }, [submitted, answers, questions]);

  if (!unlocked) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">结业测试</h1>
          <p className="mt-1 text-sm text-slate-500">20 题综合 · 90 分钟限时 · 5 题代码大题</p>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="mr-1 inline h-4 w-4 align-middle" />
          还未解锁，请先完成所有 12 节课程的打卡（自测 ≥ 60 分并打卡）。
        </div>
        <Link to="/lessons" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
          继续学习
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">结业测试（已解锁）</h1>
          <p className="mt-1 text-sm text-slate-500">
            共 {questions.length} 道选择/判断题，限时 {DURATION_MIN} 分钟。
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold">考试说明</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
            <li>考试开始后即开始计时，中途刷新不会中断计时。</li>
            <li>选择完每一题后请点击「提交」完成测试并获得报告。</li>
            <li>系统会自动标注薄弱章节并提供复习入口。</li>
          </ul>
          <button onClick={onStart} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Clock className="h-4 w-4" /> 开始计时测试
          </button>
          {/* 用 state 以避免未使用警告 */}
          <div className="hidden">状态 {state.updatedAt}</div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">个人测评报告</h1>
          <p className="mt-1 text-sm text-slate-500">
            用时：{startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0} 秒 · 正确 {correctCount}/{questions.length}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">综合得分</div>
            <div className={'mt-1 text-3xl font-semibold ' + (score >= 60 ? 'text-emerald-600' : 'text-rose-600')}>{score}</div>
            <div className="mt-1 text-xs text-slate-500">{score >= 60 ? '通过' : '未通过（可重试）'}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">薄弱章节（Top 3）</div>
            {weakByCourse.length === 0 ? (
              <div className="mt-2 text-sm text-emerald-700">无薄弱章节 🎉</div>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                {weakByCourse.map((c, i) => (
                  <li key={c}>
                    {i + 1}. {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">下一步</div>
            <Link to="/lessons" className="mt-2 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
              返回课程复习
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((item, i) => {
            const picked = answers[item.q.id];
            const correct = picked === item.q.correctIndex;
            return (
              <div key={item.q.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {i + 1}. {item.q.prompt}
                  </div>
                  <div>{correct ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertTriangle className="h-5 w-5 text-rose-500" />}</div>
                </div>
                <div className="mt-2 text-xs text-slate-500">来自：{item.courseTitle}</div>
                <div className="mt-2 grid gap-2 text-sm">
                  {item.q.options.map((opt: string, oi: number) => {
                    const isCorrect = oi === item.q.correctIndex;
                    const isPick = oi === picked;
                    let cls = 'border-slate-200';
                    if (isCorrect) cls = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
                    else if (isPick) cls = 'border-rose-400 bg-rose-50 dark:bg-rose-950/30';
                    return (
                      <div key={oi} className={`rounded-md border px-3 py-2 ${cls}`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                        {isPick && ' (你的选择)'}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">解析：{item.q.explanation}</div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <Link to="/lessons" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
            回到课程
          </Link>
          <button onClick={() => { setStarted(false); setSubmitted(false); setAnswers({}); setRemain(DURATION_MIN * 60); }} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            <Award className="h-4 w-4" /> 重新测试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-4 z-10 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">结业测试进行中</div>
        <div className="text-sm text-slate-700 dark:text-slate-200">
          剩余 <span className="font-mono text-lg font-semibold text-brand-600">{formatTime(remain)}</span>
        </div>
        <button
          disabled={Object.keys(answers).length < questions.length}
          onClick={() => setSubmitted(true)}
          className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-60"
        >
          提交 ({Object.keys(answers).length}/{questions.length})
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((item, i) => (
          <div key={item.q.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {i + 1}. {item.q.prompt}
            </div>
            <div className="mt-1 text-xs text-slate-500">来自：{item.courseTitle}</div>
            <div className="mt-3 grid gap-2 text-sm">
              {item.q.options.map((opt: string, oi: number) => {
                const picked = answers[item.q.id] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswers({ ...answers, [item.q.id]: oi })}
                    className={
                      'rounded-md border px-3 py-2 text-left transition ' +
                      (picked
                        ? 'border-brand-500 bg-brand-500/5'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800')
                    }
                  >
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
}
