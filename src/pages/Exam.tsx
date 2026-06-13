import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/** 测验页（占位） */
export function ExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">测验中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          通过测验检验学习成果
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>每日一练</CardTitle>
            <CardDescription>5 道精选题目，每日刷新</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>开始答题</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>章节测验</CardTitle>
            <CardDescription>各章节综合测试</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">选择章节</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
