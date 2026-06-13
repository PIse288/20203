import { BookOpen, Code2, GraduationCap, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  { icon: BookOpen, title: '系统课程', desc: '从入门到进阶的系统化 Pandas 教程' },
  { icon: Code2, title: '实时代码', desc: '浏览器内直接运行 Python，所见即所学' },
  { icon: GraduationCap, title: '练习测验', desc: '针对性练习与测验强化学习效果' },
  { icon: Zap, title: '错题回顾', desc: '自动收集错题，助你查漏补缺' },
];

/** 首页：欢迎信息 + 功能卡片 */
export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
        <h1 className="text-3xl font-bold md:text-4xl">
          欢迎来到 Pandas 学习平台
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          通过交互式代码编辑器、系统课程与智能错题本，高效掌握 Pandas 数据分析。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg">立即开始</Button>
          <Button variant="outline" size="lg">
            浏览课程
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3 text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
