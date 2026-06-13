import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const lessons = [
  { id: '1', title: 'Pandas 基础入门', desc: '认识 DataFrame 与 Series', progress: 60, level: '入门' },
  { id: '2', title: '数据读取与清洗', desc: 'CSV、Excel 的读写与数据预处理', progress: 30, level: '基础' },
  { id: '3', title: '数据筛选与聚合', desc: '条件筛选与 groupby 操作', progress: 0, level: '进阶' },
  { id: '4', title: '时间序列分析', desc: '处理日期索引与滚动统计', progress: 0, level: '高级' },
];

/** 课程列表页 */
export function LessonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">课程列表</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          选择感兴趣的课程开始学习
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <Link key={l.id} to={`/lessons/${l.id}`} className="block transition-transform hover:-translate-y-1">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{l.title}</CardTitle>
                  <Badge variant="secondary">{l.level}</Badge>
                </div>
                <CardDescription>{l.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">学习进度</span>
                  <span className="font-medium">{l.progress}%</span>
                </div>
                <Progress value={l.progress} className="mt-2" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
