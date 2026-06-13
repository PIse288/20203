import { BookOpen, Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

/** 顶部导航：Logo + 移动端菜单 + 主题切换 */
export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b bg-background/90 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Pandas 学习平台</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="切换主题"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button>开始学习</Button>
        </div>
      </div>
    </header>
  );
}
