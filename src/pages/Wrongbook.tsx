import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const wrongItems = [
  { id: 1, title: 'DataFrame 索引操作', subject: 'Pandas 基础', date: '2024-01-10' },
  { id: 2, title: 'groupby 聚合方法', subject: '数据聚合', date: '2024-01-09' },
  { id: 3, title: '缺失值填充策略', subject: '数据清洗', date: '2024-01-08' },
];

/** 错题本页（占位） */
export function WrongbookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">错题本</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          自动记录错误题目，便于回顾
        </p>
      </div>

      <div className="space-y-3">
        {wrongItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.date}</CardDescription>
              </div>
              <Badge variant="secondary">{item.subject}</Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              点击查看原题、解析与正确答案
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
