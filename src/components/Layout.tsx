import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, BookOpen, GraduationCap, Code2, AlertTriangle, Trophy, Settings, Moon, Sun, Sparkles } from 'lucide-react';
import { usePyodide } from '@/lib/pyodide-context';
import { useApp } from '@/lib/app-context';

const navItems = [
  { to: '/', label: '首页', icon: GraduationCap, end: true },
  { to: '/lessons', label: '课程', icon: BookOpen },
  { to: '/editor', label: '代码', icon: Code2 },
  { to: '/wrongbook', label: '错题', icon: AlertTriangle },
  { to: '/exam', label: '结业', icon: Trophy },
  { to: '/settings', label: '设置', icon: Settings },
];

export function Layout() {
  const { phase, percent, message, ready } = usePyodide();
  const { theme, toggleTheme, dashboard } = useApp();
  const [toast, setToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (phase === 'ready') {
      setToast(true);
      const t = setTimeout(() => setToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* 顶部进度条 */}
      <div className="h-1 w-full bg-slate-200 dark:bg-slate-800">
        <div
          className={
            'h-full transition-all duration-500 ' +
            (phase === 'error'
              ? 'bg-rose-500'
              : phase === 'ready'
                ? 'bg-emerald-500'
                : 'bg-brand-500')
          }
          style={{ width: `${Math.max(5, Math.min(100, percent))}%` }}
        />
      </div>

      {/* 导航栏 */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Pandas 学习站</span>
            <span className="sm:hidden">Pandas</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="切换主题"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="菜单"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 md:hidden dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950">
            <nav className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-2 py-2">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) =>
                    `inline-flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs transition-colors ${
                      isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Pyodide 加载提示 + 环境状态 */}
      <div className="mx-auto max-w-6xl px-4 pt-3">
        {!ready && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-500/30 bg-brand-500/5 px-3 py-2 text-sm">
            <div className="min-w-0">
              <div className="truncate font-medium text-brand-700 dark:text-brand-200">{message}</div>
              <div className="text-xs text-slate-500">Pyodide v0.29.3 · 首次加载约 30-60 秒</div>
            </div>
            <div className="shrink-0 text-right text-xs text-slate-500">{Math.round(percent)}%</div>
          </div>
        )}
      </div>

      {/* 就绪 toast */}
      {toast && (
        <div className="fixed right-4 top-16 z-30 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 shadow-lg dark:bg-emerald-950/80 dark:text-emerald-200">
          ✓ Python 环境已就绪
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-slate-500">
        基于 React 18 + Vite 6 + Tailwind 3 · Pyodide v0.29.3 · 所有学习数据仅保存在本地
        <div className="mt-1">进度：已打卡 {dashboard.checkedIn} 小节 · 平均分 {dashboard.avg}</div>
      </footer>
    </div>
  );
}
