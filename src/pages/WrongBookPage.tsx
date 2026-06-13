import { Link } from 'react-router-dom';
import { useApp } from '@/lib/app-context';
import { courses } from '@/data/curriculum';

export function WrongBookPage() {
  const { wrongList, clearWrong, getLessonStatus } = useApp();

  const flat: { lessonId: string; lessonTitle: string; qid: string; q: any }[] = [];
  for (const c of courses) {
    for (const l of c.lessons) {
      const entry = wrongList.find((w) => w.lessonId === l.id);
      if (!entry) continue;
      for (const qid of entry.qids) {
        const q = l.questions.find((x) => x.id === qid);
        if (!q) continue;
        flat.push({ lessonId: l.id, lessonTitle: `${c.index}.${l.index} ${l.title}`, qid, q });
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">错题本</h1>
          <p className="mt-1 text-sm text-slate-500">
            汇总所有小节自测答错的题目，共 <span className="font-semibold text-slate-800 dark:text-slate-100">{flat.length}</span> 道。
          </p>
        </div>
      </div>

      {flat.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          🎉 还没有错题记录，继续保持！
        </div>
      )}

      <div className="space-y-4">
        {flat.map((item, i) => (
          <div key={item.qid} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <Link to={`/lesson/${item.lessonId}`} className="text-sm text-brand-600 hover:underline">
                {item.lessonTitle}
              </Link>
              <button
                onClick={() => clearWrong(item.lessonId, item.qid)}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                标记已掌握
              </button>
            </div>
            <div className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
              {i + 1}. {item.q.prompt}
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {item.q.options.map((opt: string, oi: number) => {
                const correct = oi === item.q.correctIndex;
                return (
                  <div
                    key={oi}
                    className={
                      'rounded-md border px-3 py-2 ' +
                      (correct
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200')
                    }
                  >
                    {String.fromCharCode(65 + oi)}. {opt} {correct && '（正确答案）'}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              解析：{item.q.explanation}
            </div>
            {/* Use status to avoid unused warning */}
            <div className="hidden">{getLessonStatus(item.lessonId)?.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
