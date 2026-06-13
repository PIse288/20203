import {
  BookOpen,
  Code2,
  FileQuestion,
  GraduationCap,
  Home,
  Settings as SettingsIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/lessons', icon: BookOpen, label: '课程列表' },
  { to: '/editor', icon: Code2, label: '代码编辑器' },
  { to: '/wrongbook', icon: FileQuestion, label: '错题本' },
  { to: '/exam', icon: GraduationCap, label: '测验' },
  { to: '/settings', icon: SettingsIcon, label: '设置' },
];

/** 左侧边栏：桌面端常驻，移动端可收起 */
export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 hidden w-64 border-r bg-background md:block">
      <nav className="flex h-full flex-col gap-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                  : 'text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
