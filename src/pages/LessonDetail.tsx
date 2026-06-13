import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/** 课程详情页（占位） */
export function LessonDetailPage() {
  const { lessonId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">课程 #{lessonId}：课程详情</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          内容与交互将在后续任务中填充
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概述</TabsTrigger>
          <TabsTrigger value="practice">练习</TabsTrigger>
          <TabsTrigger value="resources">资源</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>课程概述</CardTitle>
              <CardDescription>课程内容简介</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              这里将展示课程章节、学习目标与前置知识。
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="practice">
          <Card>
            <CardHeader>
              <CardTitle>随堂练习</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>进入代码编辑器</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>学习资源</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              相关文档与示例数据集链接
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
