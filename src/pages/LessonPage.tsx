import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Code2, Eye } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { usePyodide } from '@/lib/pyodide-context';
import { courses } from '@/data/curriculum';
import { Editor } from '@/components/Editor';

type Tab = 'demo' | 'exercise' | 'answer';

export function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markViewed, setScore, recordWrong, clearWrong, canCheckIn, doCheckIn, getLessonStatus } = useApp();
  const { run, ready } = usePyodide();

  const course = useMemo(() => courses.find((c) => c.id === id) || courses[0], [id]);
  const lesson = course.lessons[0];

  const [tab, setTab] = useState<Tab>('demo');
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    markViewed(lesson.id);
  }, [lesson.id]);

  const activeLesson = course.lessons[selectedIdx] ?? lesson;
  const codeByTab = { demo: activeLesson.demoCode, exercise: activeLesson.blankCode, answer: activeLesson.answerCode }[tab];

  // 自测
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  function submitQuiz() {
    if (!activeLesson.questions.length) return;
    let correct = 0;
    const wrongs: string[] = [];
    activeLesson.questions.forEach((q) => {
      const pick = quizAnswers[q.id];
      if (pick === q.correctIndex) correct++;
      else wrongs.push(q.id);
    });
    const score = Math.round((correct / activeLesson.questions.length) * 100);
    setQuizScore(score);
    setWrongIds(wrongs);
    setScore(activeLesson.id, score);
    // 错题本更新
    const existing = new Set(getLessonStatus(activeLesson.id)?.wrongQuestionIds ?? []);
    wrongs.forEach((w) => {
      if (!existing.has(w)) recordWrong(activeLesson.id, w);
    });
    existing.forEach((w) => {
      if (!wrongs.includes(w)) clearWrong(activeLesson.id, w);
    });
  }

  const status = getLessonStatus(activeLesson.id)?.status ?? 'idle';
  const checkable = canCheckIn(activeLesson.id);

  // 上一节/下一节 id
  const flat = course.lessons;
  const currentIndex = selectedIdx;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < flat.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/lessons" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> 返回课程列表
        </Link>
        <div className="text-sm text-slate-500">
          当前小节状态：
          <span className="ml-1 font-medium text-slate-700 dark:text-slate-200">{labelOf(status)}</span>
        </div>
      </div>

      {/* 章节选择（多小节） */}
      <div className="flex flex-wrap gap-2">
        {flat.map((l, i) => {
          const st = getLessonStatus(l.id)?.status ?? 'idle';
          return (
            <button
              key={l.id}
              onClick={() => {
                setSelectedIdx(i);
                setQuizScore(null);
                setQuizAnswers({});
                setTab('demo');
              }}
              className={
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ' +
                (i === selectedIdx
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-200 bg-white hover:border-brand-500 dark:border-slate-800 dark:bg-slate-900')
              }
            >
              <StatusIcon status={st} inverted={i === selectedIdx} />
              {i + 1}. {l.title}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-xl font-semibold">
              {course.index}. {activeLesson.index} {activeLesson.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{activeLesson.intro}</p>

            <div className="mt-4">
              <h2 className="text-sm font-semibold">重点</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {activeLesson.keyPoints.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-semibold">易错点</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-700 dark:text-rose-300">
                {activeLesson.commonMistakes.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">代码区：</span>
              {(['demo', 'exercise', 'answer'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={
                    'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs transition ' +
                    (tab === t
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700')
                  }
                >
                  {t === 'demo' ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> 示例代码
                    </>
                  ) : t === 'exercise' ? (
                    <>
                      <Code2 className="h-3.5 w-3.5" /> 空白练习
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> 参考答案
                    </>
                  )}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-500">Pyodide v0.29.3 {ready ? '就绪' : '加载中…'}</span>
            </div>
            <Editor key={activeLesson.id + '-' + tab} initialCode={codeByTab} headerTitle={activeLesson.title} mode="lesson" autoSaveKey={`draft-${activeLesson.id}-${tab}`} />
          </section>

          {/* 代码实操题 */}
          {activeLesson.exercises.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold">代码实操题</h2>
              <div className="mt-3 space-y-3">
                {activeLesson.exercises.map((ex, i) => (
                  <PracticeItem key={ex.id} idx={i + 1} exercise={ex} onRun={run} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 自测 + 打卡 */}
        <aside className="space-y-4 lg:col-span-2">
          <section className="sticky top-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">小节自测</h2>
              <span className="text-xs text-slate-500">{activeLesson.questions.length} 题</span>
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {activeLesson.questions.map((q, i) => (
                <div key={q.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/10 text-xs font-semibold text-brand-700 dark:text-brand-200">
                      {i + 1}
                    </span>
                    <div className="font-medium text-slate-800 dark:text-slate-100">{q.prompt}</div>
                  </div>
                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => {
                      const picked = quizAnswers[q.id] === oi;
                      const isAnswer = oi === q.correctIndex;
                      const showResult = quizScore !== null;
                      let cls = 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800';
                      if (showResult) {
                        if (isAnswer) cls = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40';
                        else if (picked && !isAnswer) cls = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40';
                      } else if (picked) {
                        cls = 'border-brand-500 bg-brand-500/5';
                      }
                      return (
                        <button
                          key={oi}
                          disabled={showResult}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: oi })}
                          className={`flex items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition ${cls}`}
                        >
                          <span className="text-slate-500">{String.fromCharCode(65 + oi)}.</span>
                          <span className="text-slate-800 dark:text-slate-100">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {quizScore !== null && wrongIds.includes(q.id) && (
                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                      解析：{q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {quizScore === null ? (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < activeLesson.questions.length}
                className="mt-4 w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                提交自测
              </button>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                  <span>得分</span>
                  <span className={`text-lg font-semibold ${quizScore >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>{quizScore}</span>
                </div>
                {status === 'checkedIn' ? (
                  <button disabled className="w-full cursor-not-allowed rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                    已打卡（{new Date(getLessonStatus(activeLesson.id)?.checkedInAt ?? Date.now()).toLocaleString()}）
                  </button>
                ) : (
                  <button
                    onClick={() => doCheckIn(activeLesson.id)}
                    disabled={!checkable}
                    className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700"
                  >
                    {checkable ? '打卡并标记完成' : '需自测 ≥ 60 分才能打卡'}
                  </button>
                )}
              </div>
            )}
          </section>

          <div className="flex items-center justify-between text-sm">
            <button
              disabled={!hasPrev}
              onClick={() => {
                setSelectedIdx((i) => Math.max(0, i - 1));
                setQuizScore(null);
                setQuizAnswers({});
              }}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-slate-700 disabled:opacity-40 dark:border-slate-800 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> 上一小节
            </button>
            <button
              disabled={!hasNext}
              onClick={() => {
                setSelectedIdx((i) => Math.min(flat.length - 1, i + 1));
                setQuizScore(null);
                setQuizAnswers({});
              }}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-slate-700 disabled:opacity-40 dark:border-slate-800 dark:text-slate-200"
            >
              下一小节 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatusIcon({ status, inverted }: { status: string; inverted?: boolean }) {
  if (status === 'checkedIn') return <CheckCircle2 className={'h-4 w-4 ' + (inverted ? 'text-white' : 'text-emerald-500')} />;
  if (status === 'quizPassed') return <CheckCircle2 className={'h-4 w-4 ' + (inverted ? 'text-white' : 'text-amber-500')} />;
  if (status === 'viewed') return <Eye className={'h-4 w-4 ' + (inverted ? 'text-white' : 'text-slate-400')} />;
  return <Circle className={'h-4 w-4 ' + (inverted ? 'text-white/80' : 'text-slate-300 dark:text-slate-600')} />;
}

function labelOf(s: string) {
  return { idle: '未学习', viewed: '已浏览', quizPassed: '自测通过', checkedIn: '已打卡' }[s] ?? s;
}

function PracticeItem({ idx, exercise, onRun }: { idx: number; exercise: { id: string; title: string; prompt: string; starterCode: string; hint?: string }; onRun: (code: string) => Promise<any> }) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [running, setRunning] = useState(false);
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">实操 {idx}：{exercise.title}</div>
          <div className="mt-1 text-xs text-slate-500">{exercise.prompt}</div>
          {exercise.hint && <div className="mt-1 text-xs text-amber-700 dark:text-amber-200">提示：{exercise.hint}</div>}
        </div>
        <button
          disabled={running}
          onClick={async () => {
            setRunning(true);
            setError('');
            setOutput('');
            const res = await onRun(code);
            if (res?.ok) setOutput([...(res.output ?? []), ...(res.tables ?? [])].join('\n') || '(无文本输出，请查看上面的 DataFrame/图表)');
            else setOutput(res?.output?.join('\n') ?? ''), setError(res?.error?.zh ?? '执行出错');
            setRunning(false);
          }}
          className="shrink-0 rounded-md bg-brand-500 px-3 py-1 text-xs text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {running ? '执行中…' : '运行'}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="mt-2 h-40 w-full resize-y rounded-md border border-slate-200 bg-white p-2 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      />
      {output && <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-100 p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-100">{output}</pre>}
      {error && <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">{error}</div>}
    </div>
  );
}
