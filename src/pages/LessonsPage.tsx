import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Eye, HelpCircle } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { courses } from '@/data/curriculum';

export function LessonsPage() {
  const { getLessonStatus } = useApp();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">课程中心</h1>
        <p className="mt-1 text-sm text-slate-500">12 节递进课程，每节包含讲解 + 示例 + 自测。</p>
      </div>
      <div className="space-y-4">
        {courses.map((c) => {
          const total = c.lessons.length;
          const checked = c.lessons.reduce((acc, l) => acc + (getLessonStatus(l.id)?.status === 'checkedIn' ? 1 : 0), 0);
          return (
            <section key={c.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">第 {c.index} 节</div>
                  <div className="text-base font-semibold">{c.title}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-xs text-slate-500">{checked}/{total} 已打卡</div>
                  <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full bg-brand-500" style={{ width: `${(checked / total) * 100}%` }} />
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {c.lessons.map((l) => {
                  const st = getLessonStatus(l.id)?.status ?? 'idle';
                  return (
                    <li key={l.id}>
                      <Link
                        to={`/lesson/${l.id}`}
                        className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon status={st} />
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{l.index}. {l.title}</div>
                            <div className="text-xs text-slate-500">讲解 · 示例 · 自测</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">{labelOf(st)}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'checkedIn') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (status === 'quizPassed') return <HelpCircle className="h-5 w-5 text-amber-500" />;
  if (status === 'viewed') return <Eye className="h-5 w-5 text-slate-400" />;
  return <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />;
}
function labelOf(s: string) {
  return { idle: '未学习', viewed: '已浏览', quizPassed: '自测通过', checkedIn: '已打卡' }[s] ?? s;
}
