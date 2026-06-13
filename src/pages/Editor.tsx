import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/** 代码编辑器页（占位） */
export function EditorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">代码编辑器</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            在浏览器中编写并运行 Python 代码
          </p>
        </div>
        <Button>运行代码</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>代码输入</CardTitle>
            <CardDescription>在此编写 Python 代码</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-4 text-xs text-muted-foreground">
{`# 在这里输入你的代码
import pandas as pd
df = pd.DataFrame({'A': [1, 2, 3]})
print(df)`}
            </pre>
          </CardContent>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>执行结果</CardTitle>
            <CardDescription>代码运行输出</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-4 text-xs text-muted-foreground">
{'等待代码执行...'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
