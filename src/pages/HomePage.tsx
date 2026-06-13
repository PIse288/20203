import { Link } from 'react-router-dom';
import { BookOpen, Award, Target, AlertTriangle, TrendingUp, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { courses, totalLessons } from '@/data/curriculum';

export function HomePage() {
  const { dashboard, state, allCheckedIn, getLessonStatus } = useApp();

  const recent = Object.entries(state.lessons)
    .filter(([, p]) => p.lastVisitedAt)
    .sort((a, b) => (b[1].lastVisitedAt ?? 0) - (a[1].lastVisitedAt ?? 0))
    .slice(0, 5);

  const stats = [
    { label: '课程进度', value: `${dashboard.percent}%`, icon: TrendingUp, color: 'bg-brand-500 text-white' },
    { label: '已打卡', value: `${dashboard.checkedIn}/${totalLessons}`, icon: CheckCircle2, color: 'bg-emerald-500 text-white' },
    { label: '自测平均', value: `${dashboard.avg}`, icon: Target, color: 'bg-amber-500 text-white' },
    { label: '错题数', value: `${dashboard.totalWrong}`, icon: AlertTriangle, color: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">在浏览器里学 Pandas</h1>
            <p className="mt-1 text-sm text-white/85">纯前端、无需后端、不上传数据 · 支持 12 节递进课程 + 在线代码编辑器</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/lessons"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow hover:bg-white/95"
            >
              <BookOpen className="h-4 w-4" /> 开始学习
            </Link>
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              <ArrowRight className="h-4 w-4" /> 自由编码
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{s.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">课程目录</h2>
            <Link to="/lessons" className="text-sm text-brand-600 hover:underline">查看全部 →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {courses.map((c) => {
              const checked = c.lessons.reduce((acc, l) => acc + (getLessonStatus(l.id)?.status === 'checkedIn' ? 1 : 0), 0);
              return (
                <Link
                  key={c.id}
                  to={`/lesson/${c.id}`}
                  className="group rounded-lg border border-slate-200 p-3 transition hover:border-brand-500 dark:border-slate-800"
                >
                  <div className="text-xs text-slate-500">第 {c.index} 节</div>
                  <div className="mt-1 text-sm font-medium text-slate-800 group-hover:text-brand-700 dark:text-slate-100">{c.title}</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-brand-500 transition-all"
                      style={{ width: `${Math.round((checked / c.lessons.length) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">{checked}/{c.lessons.length} 已打卡</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-base font-semibold">最近学习</h2>
          {recent.length === 0 && (
            <div className="text-sm text-slate-500">
              还没有学习记录，去
              <Link to="/lessons" className="text-brand-600 hover:underline"> 课程 </Link>
              开始吧。
            </div>
          )}
          <ul className="space-y-2">
            {recent.map(([lessonId, p]) => (
              <li key={lessonId} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-medium text-slate-800 dark:text-slate-100">{lessonToTitle(lessonId)}</div>
                  <span className="shrink-0 text-xs text-slate-500">
                    <Clock className="mr-0.5 inline h-3 w-3 align-middle" />
                    {new Date(p.lastVisitedAt ?? 0).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  状态: {statusLabel(p.status)} {typeof p.score === 'number' && ` · 最高分 ${p.score}`}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">下一步</h2>
        <p className="mt-1 text-sm text-slate-500">
          完成每一小节的自测（60 分以上）后可打卡；全部 {totalLessons} 节打卡后即可进入
          <Link to="/exam" className="mx-1 text-brand-600 hover:underline">结业测试</Link>。
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {allCheckedIn ? (
            <Link to="/exam" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 font-medium text-white hover:bg-emerald-600">
              <Award className="h-4 w-4" /> 已解锁结业测试
            </Link>
          ) : (
            <Link to="/lessons" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 font-medium text-white hover:bg-brand-600">
              <BookOpen className="h-4 w-4" /> 继续学习
            </Link>
          )}
          <Link to="/wrongbook" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
            <AlertTriangle className="h-4 w-4" /> 错题本
          </Link>
        </div>
      </section>
    </div>
  );
}

function statusLabel(s: string) {
  return { idle: '未学习', viewed: '已浏览', quizPassed: '自测通过', checkedIn: '已打卡' }[s] ?? s;
}
function lessonToTitle(id: string) {
  for (const c of courses) for (const l of c.lessons) if (l.id === id) return `${c.index}.${l.index} ${l.title}`;
  return id;
}
