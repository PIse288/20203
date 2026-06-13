import type { Course, Question, CodeExercise, Lesson } from '@/types/course';

const mkQ = (q: Question): Question => q;
const mkE = (e: CodeExercise): CodeExercise => e;

const lessons: Lesson[] = [
  {
    id: '01-series',
    index: 1,
    title: 'Pandas 基础认知与 Series',
    intro:
      'Pandas 是 Python 生态中最常用的数据分析库之一，核心提供两种数据结构：一维的 Series（带标签的数组）和二维的 DataFrame（由多个 Series 按列拼成的表格）。本节先从 Series 开始，学习它的创建、取值和基本运算。',
    keyPoints: [
      'Series = 一维带标签数组，由索引 (index) + 值 (values) 组成',
      '可从 list、dict、ndarray 创建，索引默认从 0 开始，也可自定义',
      '取值可用位置 ([0], .iloc[0]) 或标签 (.loc["a"])',
      '支持逐元素运算：+, -, *, /, np.log 等',
      '通过 .describe() / .mean() / .sum() 看统计量',
    ],
    commonMistakes: [
      '误以为 .loc[i] 是按位置取，其实 .loc 用的是"标签"',
      '做算术运算时索引会自动对齐，缺失位置得到 NaN',
      '混合 int/str 索引会让人困惑，建议统一命名',
    ],
    demoCode: `import pandas as pd
import numpy as np

# 从 list 创建
s1 = pd.Series([1, 2, 3, 4, 5])
print("默认索引的 Series:\\n", s1)

# 自定义索引
s2 = pd.Series([10, 20, 30, 40], index=["Q1", "Q2", "Q3", "Q4"])
print("\\n自定义索引的 Series:\\n", s2)
print("\\n按标签取值 .loc['Q3']:", s2.loc["Q3"])
print("按位置取值 .iloc[2]:", s2.iloc[2])

# 运算
print("\\n逐元素 +10:\\n", s2 + 10)
print("\\n两个 Series 相加（按索引对齐）:\\n", s1[:3] + s2[:3])

# 统计
print("\\n均值:", s2.mean(), "求和:", s2.sum())
print("描述性统计:\\n", s2.describe())
`,
    blankCode: `# 请在此处尝试：
# 1) 创建一个 Series，内容为 [100, 200, 300, 400]，索引为 "Jan", "Feb", "Mar", "Apr"
# 2) 打印 .loc["Mar"]
# 3) 打印该 Series 的均值和总和

import pandas as pd

`,
    answerCode: `import pandas as pd

sales = pd.Series([100, 200, 300, 400], index=["Jan", "Feb", "Mar", "Apr"])
print("三月销售额:", sales.loc["Mar"])
print("均值:", sales.mean())
print("总和:", sales.sum())
`,
    questions: [
      mkQ({
        id: 'q1',
        prompt: '关于 Pandas Series，下面哪一个说法是正确的？',
        options: [
          'Series 只能保存数值类型',
          'Series 是一维数据结构，由索引和值组成',
          'Series 必须有列名 (columns)',
          'Series 不支持索引对齐',
        ],
        correctIndex: 1,
        explanation: 'Series 是一维带标签的数据结构，可以保存多种类型。',
      }),
      mkQ({
        id: 'q2',
        prompt: '使用默认索引创建 pd.Series([1,2,3]) 时，以下哪条代码能拿到值 3？',
        options: ['series[2]', 'series.loc[2]', 'series.iloc[2]', '以上都可以'],
        correctIndex: 3,
        explanation: '默认情况下索引就是整数 0..n-1，位置与标签一致。',
      }),
      mkQ({
        id: 'q3',
        prompt: '对两个长度不同的 Series 做加法会发生什么？',
        options: ['报错', '自动截断为较短者', '按索引对齐，不匹配的位置得到 NaN', '缺失位置自动补 0'],
        correctIndex: 2,
        explanation: 'Pandas 自动按索引对齐，不匹配项得到 NaN。',
      }),
      mkQ({
        id: 'q4',
        prompt: 'Series.describe() 默认不会输出哪个统计量？',
        options: ['count (非空个数)', 'mean', 'median (50%)', '标准差 std'],
        correctIndex: 2,
        explanation: '默认 describe 会输出 count/mean/std/min/25%/50%/75%/max，其中 50% 即是中位数。',
      }),
      mkQ({
        id: 'q5',
        prompt: 'pd.Series({"a":1,"b":2}) 中索引是什么？',
        options: ['0, 1', 'a, b', '字典没有索引', '随机字符串'],
        correctIndex: 1,
        explanation: '使用字典创建时，字典 key 会成为 Series 的 index。',
      }),
    ],
    exercises: [
      mkE({
        id: 'e1',
        title: 'Series 基础',
        prompt: '创建一个 Series s，值为 [5, 10, 15, 20]，索引 ["A", "B", "C", "D"]；打印 s 的总和与均值。',
        hint: '使用 pd.Series(values, index=...) 创建。',
        starterCode: `import pandas as pd\n\n`,
        solutionCode: `import pandas as pd
s = pd.Series([5, 10, 15, 20], index=["A", "B", "C", "D"])
print("sum:", s.sum())
print("mean:", s.mean())`,
        expectedOutputHints: ['sum: 50', 'mean: 12.5'],
      }),
      mkE({
        id: 'e2',
        title: 'Series 相加与对齐',
        prompt: '对 Series a = pd.Series([1,2,3], index=["x","y","z"]) 与 b = pd.Series([10,20,30], index=["y","z","w"]) 相加并打印结果。',
        hint: 'Pandas 会按索引标签自动对齐。',
        starterCode: `import pandas as pd\n\n`,
        solutionCode: `import pandas as pd
a = pd.Series([1, 2, 3], index=["x", "y", "z"])
b = pd.Series([10, 20, 30], index=["y", "z", "w"])
print(a + b)`,
        expectedOutputHints: ['x', 'NaN'],
      }),
    ],
  },
  {
    id: '02-dataframe',
    index: 2,
    title: 'DataFrame：创建、信息查看',
    intro:
      'DataFrame 是一个二维的表格型数据结构，可看作由多个共用索引的 Series 按列组合而成。本节学习从不同来源创建 DataFrame，以及查看基本信息 (shape、columns、dtypes、head/tail、info、describe)。',
    keyPoints: [
      '从字典 {列名: 序列} 创建 DataFrame 最常见',
      '.columns, .index, .shape 查看基本结构',
      '.head(n)/.tail(n) 查看首尾 n 行',
      '.info() 查看列类型与缺失值数量',
      '.describe() 输出数值列的统计描述',
    ],
    commonMistakes: ['把 columns 当作索引来取值', '忘记中文列名需要用字符串引用', 'info() 默认不在 stdout 中显示（需 print 或直接显示）'],
    demoCode: `import pandas as pd

data = {
    "product": ["A", "B", "C", "D"],
    "price": [10, 20, 15, 30],
    "qty": [100, 50, 80, 60],
}
df = pd.DataFrame(data)
print(df)
print("\\nshape:", df.shape, "columns:", list(df.columns))
print("\\ninfo:")
print(df.info())
print("\\ndescribe:\\n", df.describe())
`,
    blankCode: `# 构造一个 DataFrame 描述一次购物清单：
# 列 name / price / qty，至少 4 行；打印 shape 与 info()
import pandas as pd

`,
    answerCode: `import pandas as pd

df = pd.DataFrame({
    "name": ["苹果", "香蕉", "橙子", "葡萄"],
    "price": [5.5, 2.8, 4.2, 8.0],
    "qty": [3, 6, 4, 2],
})
print(df)
print("shape:", df.shape)
print(df.info())
`,
    questions: [
      mkQ({ id: 'd1', prompt: 'DataFrame.shape 返回 (rows, columns)，对吗？', options: ['对', '错，是 (columns, rows)', '只有行数', '返回字典'], correctIndex: 0, explanation: 'shape 属性顺序为 (行数, 列数)。' }),
      mkQ({ id: 'd2', prompt: '下面哪个方法能快速查看数据前几行？', options: ['.first()', '.head()', '.top()', '.start()'], correctIndex: 1, explanation: '.head(n) 默认展示前 5 行。' }),
      mkQ({ id: 'd3', prompt: '.info() 的作用是？', options: ['打印统计量', '展示列名、非空数量与类型', '返回前 10 行', '打印所有数据'], correctIndex: 1, explanation: 'info() 用于快速查看结构和缺失值。' }),
      mkQ({ id: 'd4', prompt: '以下哪种方式不能创建 DataFrame？', options: ['字典 {"a":[1,2],"b":[3,4]}', 'list of lists + columns 参数', '从 CSV 读取', '直接传入一个整数'], correctIndex: 3, explanation: '单个整数无法构成二维表。' }),
      mkQ({ id: 'd5', prompt: 'df["列名"] 返回的类型是？', options: ['list', 'DataFrame', 'Series', 'dict'], correctIndex: 2, explanation: '取单列得到 Series。' }),
    ],
    exercises: [
      mkE({
        id: 'de1',
        title: '练习 1',
        prompt: '创建一个 DataFrame，列名为 name / age / score，3 行数据；打印 .shape 与 .columns。',
        starterCode: `import pandas as pd\n\n`,
        solutionCode: `import pandas as pd
df = pd.DataFrame({"name":["Tom","Jerry","Kate"], "age":[12,11,13], "score":[90,85,92]})
print(df.shape)
print(list(df.columns))`,
        expectedOutputHints: ['(3, 3)'],
      }),
      mkE({
        id: 'de2',
        title: '练习 2',
        prompt: '使用 .describe() 打印数值列统计信息。',
        starterCode: `import pandas as pd\ndf = pd.DataFrame({"a":[1,2,3,4,5],"b":[10,20,30,40,50]})\n`,
        solutionCode: `import pandas as pd
df = pd.DataFrame({"a":[1,2,3,4,5],"b":[10,20,30,40,50]})
print(df.describe())`,
        expectedOutputHints: ['mean', 'std'],
      }),
    ],
  },
  {
    id: '03-selection',
    index: 3,
    title: 'loc / iloc 索引与切片',
    intro:
      '选择行/列是分析最频繁的操作。.loc 使用标签 (index/columns 名称)，.iloc 使用位置 (0, 1, 2 ...)。本节掌握 [行, 列] 的二维切片写法。',
    keyPoints: [
      'df.loc[行标签, 列标签]，df.iloc[行位置, 列位置]',
      '支持切片 [a:b]，loc 切片包含两端，iloc 与 Python 切片一致',
      '选择多列：df[["a","b"]]',
      '布尔选择：df[df["col"] > 0]',
      '改值：df.loc[条件, "列"] = new_value',
    ],
    commonMistakes: ['.loc["a":"c"] 会包含 c，不同于 Python 切片', '行列写反：df.loc[列, 行] 是错的', '修改时没有用 .loc 会触发 SettingWithCopyWarning'],
    demoCode: `import pandas as pd

df = pd.DataFrame(
    {"math":[80, 90, 70, 88], "english":[75, 95, 60, 82]},
    index=["Tom","Jerry","Kate","Bob"],
)
print("原表:\\n", df)
print("\\n.loc['Tom', 'math']:", df.loc["Tom", "math"])
print("\\n.loc['Tom':'Kate', :]\\n", df.loc["Tom":"Kate", :])
print("\\n.iloc[0:2, [0,1]]\\n", df.iloc[0:2, [0, 1]])
print("\\n布尔筛选 math>80:\\n", df[df["math"] > 80])
`,
    blankCode: `# 根据上面示例，先创建一个带自定义索引的 DataFrame，
# 再练习：.loc / .iloc / 布尔筛选
import pandas as pd

`,
    answerCode: `import pandas as pd

df = pd.DataFrame({"chinese":[88, 92, 70, 85], "math":[78, 95, 66, 80]},
                  index=["A","B","C","D"])
print(df.loc["B", "chinese"])
print(df.iloc[1:3, :])
print(df[df["math"] >= 80])`,
    questions: [
      mkQ({ id: 's1', prompt: '.loc 和 .iloc 的主要区别是？', options: ['没有区别', 'loc 用标签，iloc 用位置', 'iloc 更快但不稳定', 'loc 只能用整数'], correctIndex: 1, explanation: '关键差异在于是标签还是位置。' }),
      mkQ({ id: 's2', prompt: 'df.loc["a":"c"] 会包含哪几行？', options: ['a, b', 'a, b, c', 'b, c', '报错'], correctIndex: 1, explanation: 'loc 切片两端都包含。' }),
      mkQ({ id: 's3', prompt: '选出多列的正确写法是？', options: ['df["a","b"]', 'df[["a","b"]]', 'df("a","b")', 'df.a.b'], correctIndex: 1, explanation: '必须传入列名列表。' }),
      mkQ({ id: 's4', prompt: '修改满足条件的单元格时，推荐使用？', options: ['df[df.a>0].b = 1', 'df.loc[df.a>0, "b"] = 1', 'df["b"][df.a>0]', '直接 for 循环'], correctIndex: 1, explanation: '使用 .loc 可以避免 SettingWithCopyWarning。' }),
      mkQ({ id: 's5', prompt: 'df.iloc[2] 选中的是？', options: ['第 2 列', '第 3 行', 'index=2 的行', '索引为 2 的标签'], correctIndex: 1, explanation: 'iloc[2] 为位置 2 的行，即第 3 行。' }),
    ],
    exercises: [
      mkE({
        id: 'se1',
        title: '练习 3',
        prompt: '构造一张表后，用 .loc 选出 index="C" 的行，用 .iloc 选出最后两行。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"x":[1,2,3,4]}, index=["A","B","C","D"])\nprint(df.loc["C"])\nprint(df.iloc[-2:])`, expectedOutputHints: ['C', 'D'] }),
      mkE({
        id: 'se2',
        title: '练习 4',
        prompt: '筛选 x 列大于 2 的行。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"x":[1,2,3,4,5]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"x":[1,2,3,4,5]})\nprint(df[df["x"] > 2])`, expectedOutputHints: ['3', '4', '5'] }),
    ],
  },
  {
    id: '04-rename-sort',
    index: 4,
    title: '列名 / 索引重命名、排序、行列增删',
    intro:
      '掌握数据整形的常用操作：给列和索引起一个更友好的名字、按列或索引排序、新增列/删除列。',
    keyPoints: [
      'df.rename(columns={"old":"new"}) / df.rename(index={"old":"new"})',
      'df.columns = [new_names] / df.index = [new_index] 整体替换',
      'df.sort_values(by="col", ascending=False)',
      'df.sort_index() 按索引排序',
      '新增列：df["new"] = ...；删除列：df.drop(columns=["col"])',
    ],
    commonMistakes: ['rename 默认不修改原表，需要 inplace=True 或重新赋值', '排序时忘记 ascending=False 导致方向反了', '删除列时传入字符串而不是列表会报 Deprecation'],
    demoCode: `import pandas as pd

df = pd.DataFrame({"姓名":["Tom","Jerry","Kate"], "分数":[80, 95, 70]})
df = df.rename(columns={"姓名":"name", "分数":"score"})
df["grade"] = ["B","A","C"]
print(df)
print("\\n按 score 降序:\\n", df.sort_values("score", ascending=False))
print("\\n删除 grade 列:\\n", df.drop(columns=["grade"]))
`,
    blankCode: `# 练习：建表 -> 改列名 -> 加一列 "等级" -> 按 "等级" 排序
import pandas as pd

`,
    answerCode: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C"],"score":[70,95,82]})
df["level"] = ["C","A","B"]
print(df.sort_values("score", ascending=False))`,
    questions: [
      mkQ({ id: 'r1', prompt: 'df.rename(columns={"a":"b"}) 会修改原表吗？', options: ['会', '不会，默认 inplace=False', '报错', '取决于数据类型'], correctIndex: 1, explanation: 'rename 默认返回新 DataFrame。' }),
      mkQ({ id: 'r2', prompt: '以下哪行代码可以按 "amount" 列降序排序？', options: ['df.sort("amount")', 'df.sort_values("amount", ascending=False)', 'df.order("amount")', 'df.sort_index(ascending=False)'], correctIndex: 1, explanation: 'sort_values 按值排序。' }),
      mkQ({ id: 'r3', prompt: '新增一列正确写法是？', options: ['df.new_col = [...]', 'df.assign(new=[...]) (返回新表)', 'df["new"] = [...]', '以上都可以'], correctIndex: 3, explanation: '三种写法都可以；assign 返回新表，[]= 原地改。' }),
      mkQ({ id: 'r4', prompt: '删除列的推荐写法？', options: ['del df["col"]', 'df.drop(columns=["col"])', 'df.pop("col")', '三种都可用'], correctIndex: 3, explanation: '以上三种在语义上都能工作。' }),
      mkQ({ id: 'r5', prompt: '.sort_index() 的作用是？', options: ['按行号排序', '按索引值（标签）排序', '按列名排序', '随机排序'], correctIndex: 1, explanation: '按索引标签排序。' }),
    ],
    exercises: [
      mkE({
        id: 're1',
        title: '练习 5',
        prompt: '将 {"A 列":[1,2],"B 列":[3,4]} 的 DataFrame 改列名为 a, b，再按 b 降序打印。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"A 列":[1,2],"B 列":[3,4]})\ndf = df.rename(columns={"A 列":"a","B 列":"b"})\nprint(df.sort_values("b", ascending=False))`, expectedOutputHints: ['b'] }),
      mkE({
        id: 're2',
        title: '练习 6',
        prompt: '新增一列 "total" = a + b，删除原始 a、b 列，打印结果。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"a":[1,2,3],"b":[4,5,6]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"a":[1,2,3],"b":[4,5,6]})\ndf["total"] = df["a"] + df["b"]\nprint(df.drop(columns=["a","b"]))`, expectedOutputHints: ['total'] }),
    ],
  },
  {
    id: '05-missing',
    index: 5,
    title: '缺失值识别、删除、填充、插值',
    intro:
      '真实数据经常有空值。在 Pandas 中通常用 NaN (Not a Number) 表示缺失，我们需要识别、删除或合理填补它们。',
    keyPoints: [
      'df.isna() / df.isnull() 判断每个位置是否为空',
      'df.isna().sum() 按列统计缺失数',
      'df.dropna() 删除含 NaN 的行；dropna(axis=1) 删除列',
      'df.fillna(值) 统一填充；df.fillna(method="ffill"/"bfill") 前后向填充',
      'df.interpolate() 线性插值；特定列可用 groupby + transform 填充',
    ],
    commonMistakes: ['空字符串 "" 或 "NaN" 文本不会被视为缺失', 'inplace 未设置时 df 不会变化', '前后向填充时首/末行会保留 NaN'],
    demoCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({"a":[1, np.nan, 3, 5], "b":[2, 3, np.nan, 7]})
print("原表:\\n", df)
print("\\n每列缺失数:\\n", df.isna().sum())
print("\\ndropna:\\n", df.dropna())
print("\\nfillna(0):\\n", df.fillna(0))
print("\\nffill:\\n", df.ffill())
print("\\ninterpolate:\\n", df.interpolate())
`,
    blankCode: `# 构造带缺失的 DataFrame，练习 isna().sum() / fillna / dropna / interpolate
import pandas as pd
import numpy as np

`,
    answerCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({"x":[1, np.nan, 3, np.nan, 5], "y":[np.nan, 2, 3, np.nan, 5]})
print("缺失数:\\n", df.isna().sum())
print("均值填充:\\n", df.fillna(df.mean()))`,
    questions: [
      mkQ({ id: 'm1', prompt: '判断空值用哪个方法？', options: ['.na()', '.isna()', '.empty()', '.missing()'], correctIndex: 1, explanation: 'isna / isnull 都可以。' }),
      mkQ({ id: 'm2', prompt: 'df.dropna() 默认行为是？', options: ['删除含任何 NaN 的列', '删除含任何 NaN 的行', '删除所有值为 NaN 的行', '删除整张表'], correctIndex: 1, explanation: '默认按行删除。' }),
      mkQ({ id: 'm3', prompt: '下面哪条代码是均值填充？', options: ['df.fillna(0)', 'df.fillna(df.mean())', 'df.dropna()', 'df.mean()'], correctIndex: 1, explanation: '按列用均值填充。' }),
      mkQ({ id: 'm4', prompt: '"" (空字符串) 会被 isna 视为 True 吗？', options: ['是', '否，除非先把它转成 NaN', '取决于 Python 版本', '只在 Windows 上'], correctIndex: 1, explanation: '空字符串不是 NaN，可用 replace("", np.nan) 统一。' }),
      mkQ({ id: 'm5', prompt: 'df.ffill() 的含义？', options: ['用列均值填充', '用下一个非空值填充', '用上一个非空值填充', '线性插值'], correctIndex: 2, explanation: 'forward fill，前向填充。' }),
    ],
    exercises: [
      mkE({
        id: 'me1',
        title: '练习 7',
        prompt: '构造带 NaN 的 DataFrame；统计每列缺失数；用 0 填充后打印。', starterCode: `import pandas as pd, numpy as np\n`, solutionCode: `import pandas as pd, numpy as np\ndf = pd.DataFrame({"a":[1,np.nan,3],"b":[4,5,np.nan]})\nprint(df.isna().sum())\nprint(df.fillna(0))`, expectedOutputHints: ['0.0'] }),
      mkE({
        id: 'me2',
        title: '练习 8',
        prompt: '对 DataFrame 使用 ffill() 并打印。', starterCode: `import pandas as pd, numpy as np\ndf = pd.DataFrame({"x":[1,np.nan,np.nan,4]})\n`, solutionCode: `import pandas as pd, numpy as np\ndf = pd.DataFrame({"x":[1,np.nan,np.nan,4]})\nprint(df.ffill())`, expectedOutputHints: ['1', '4'] }),
    ],
  },
  {
    id: '06-duplicates',
    index: 6,
    title: '重复值检测、溯源、去重',
    intro:
      '数据录入错误会带来重复记录。本节学习识别重复、查看重复来源，以及保留首条/末条/完全删除。',
    keyPoints: [
      'df.duplicated() 返回布尔标记，默认 keep="first"',
      'df.duplicated(subset=["id"]) 仅按某些列判断',
      'df.drop_duplicates() 删除重复',
      '重复统计：df.duplicated().sum()',
      '可用于溯源：df[df.duplicated(keep=False)] 显示所有参与重复的行',
    ],
    commonMistakes: ['使用了错误的 subset 导致误删', 'keep="last" 与 keep="first" 方向不同'],
    demoCode: `import pandas as pd

df = pd.DataFrame({"id":[1,2,3,2,4,1], "name":["A","B","C","B","D","A"]})
print("原表:\\n", df)
print("\\n重复标记:\\n", df.duplicated())
print("\\n参与重复的全部行:\\n", df[df.duplicated(keep=False)])
print("\\n去重:\\n", df.drop_duplicates())
`,
    blankCode: `# 构造有重复的表，用 duplicated / drop_duplicates / subset 练习
import pandas as pd

`,
    answerCode: `import pandas as pd
df = pd.DataFrame({"uid":[101,102,103,102,104], "name":["x","y","z","y","w"]})
print("重复数:", df.duplicated(subset=["uid"]).sum())
print(df.drop_duplicates(subset=["uid"]))`,
    questions: [
      mkQ({ id: 'p1', prompt: 'df.duplicated(keep="first") 对每条重复行返回？', options: ['第一条 True，其余 False', '第一条 False，其余 True', '全部 True', '随机'], correctIndex: 1, explanation: 'first 表示保留第一条，其他标为重复。' }),
      mkQ({ id: 'p2', prompt: '想看到所有参与重复的行？', options: ['keep=False', 'keep="all"', 'keep="last"', '无法'], correctIndex: 0, explanation: 'keep=False 会把所有重复行标记为 True。' }),
      mkQ({ id: 'p3', prompt: '只按 id 列判断重复，用哪个参数？', options: ['columns=["id"]', 'subset=["id"]', 'on=["id"]', 'by=["id"]'], correctIndex: 1, explanation: 'subset 参数。' }),
      mkQ({ id: 'p4', prompt: '统计重复行数？', options: ['df.duplicated().count()', 'df.duplicated().sum()', 'len(df.duplicated())', 'df.count()'], correctIndex: 1, explanation: '布尔求和得到 True 的数量。' }),
      mkQ({ id: 'p5', prompt: 'drop_duplicates 会保留哪一行？', options: ['默认保留最后一行', '默认保留第一行', '随机保留', '全部删除'], correctIndex: 1, explanation: 'keep="first" 为默认值。' }),
    ],
    exercises: [
      mkE({
        id: 'pe1',
        title: '练习 9',
        prompt: '构造 6 行、含重复 id 的表；统计重复行数量，并打印去重后的表。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"id":[1,2,3,2,4,4],"v":["a","b","c","b","d","d"]})\nprint("重复行数:", df.duplicated().sum())\nprint(df.drop_duplicates())`, expectedOutputHints: ['重复行数'] }),
      mkE({
        id: 'pe2',
        title: '练习 10',
        prompt: '打印所有参与重复的行（keep=False）。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"id":[1,2,2,3,3,3]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"id":[1,2,2,3,3,3]})\nprint(df[df.duplicated(keep=False)])`, expectedOutputHints: ['2', '3'] }),
    ],
  },
  {
    id: '07-boolean',
    index: 7,
    title: '布尔索引与复合条件筛选',
    intro:
      '按业务条件筛选数据是分析的核心。使用 & (and)、| (or)、~ (not) 组合布尔掩码即可完成复杂筛选。',
    keyPoints: [
      'df[df.age >= 18]',
      '多个条件用 &、| 并用括号分组，例如 (df.a > 1) & (df.b < 10)',
      '.isin([...])、.between(a, b)、.str.contains(...)',
      'df.query("a > 1 and b < 10") 字符串式写法',
      '空值：df[df.col.isna()] 与 df[df.col.notna()]',
    ],
    commonMistakes: ['使用 and/or 而非 &/|', '忘记加括号导致优先级错误', '字符串比较未考虑大小写'],
    demoCode: `import pandas as pd

df = pd.DataFrame({"age":[15,20,30,40,12], "grade":["A","B","A","C","B"]})
print("成年:\\n", df[df["age"] >= 18])
print("\\n成年且 A:\\n", df[(df["age"] >= 18) & (df["grade"] == "A")])
print("\\nisin B/C:\\n", df[df["grade"].isin(["B","C"])])
print("\\nbetween 18-35:\\n", df[df["age"].between(18,35)])
`,
    blankCode: `# 构造一份数据，分别使用 &、|、isin、between 各写一次筛选
import pandas as pd

`,
    answerCode: `import pandas as pd
df = pd.DataFrame({"city":["Beijing","Shanghai","Beijing","Shenzhen"],
                   "age":[22,34,15,40], "income":[8,12,5,18]})
print(df[(df["age"] >= 18) & (df["city"].isin(["Beijing","Shanghai"]))])
print(df[df["income"].between(10, 20)])`,
    questions: [
      mkQ({ id: 'b1', prompt: '复合条件之间应该用？', options: ['and / or', '& / |', '&& / ||', '+ / -'], correctIndex: 1, explanation: '在 Pandas 中使用 & / | (位运算)。' }),
      mkQ({ id: 'b2', prompt: '筛选 a 列等于 1 或 b 列大于 10？', options: ['df[a==1 | b>10]', 'df[(df.a==1) | (df.b>10)]', 'df[df.a==1 or df.b>10]', 'df.filter(a=1,b>10)'], correctIndex: 1, explanation: '需要括号。' }),
      mkQ({ id: 'b3', prompt: '判断字符串包含 "A" 的方法？', options: ['df.col == "A"', 'df.col.str.contains("A")', '"A" in df.col', '没有方法'], correctIndex: 1, explanation: '使用 str 访问器。' }),
      mkQ({ id: 'b4', prompt: '~ 的含义？', options: ['按位与', '按位或', '按位非 (取反)', '近似'], correctIndex: 2, explanation: '取反布尔条件。' }),
      mkQ({ id: 'b5', prompt: 'df.between(1,10) 默认是？', options: ['开区间 (1,10)', '闭区间 [1,10]', '左开右闭', '随机'], correctIndex: 1, explanation: '默认包含两端。' }),
    ],
    exercises: [
      mkE({
        id: 'be1',
        title: '练习 11',
        prompt: '建表后筛选 age 在 [20,40] 之间且 score>=80 的行。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"age":[18,25,30,45,50],"score":[88,70,90,85,60]})\nprint(df[(df["age"].between(20,40)) & (df["score"]>=80)])`, expectedOutputHints: ['30', '90'] }),
      mkE({
        id: 'be2',
        title: '练习 12',
        prompt: '使用 isin 筛选城市为 Beijing / Shanghai 的行。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"city":["Beijing","NY","Shanghai","GZ"]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"city":["Beijing","NY","Shanghai","GZ"]})\nprint(df[df["city"].isin(["Beijing","Shanghai"])])`, expectedOutputHints: ['Beijing', 'Shanghai'] }),
    ],
  },
  {
    id: '08-groupby',
    index: 8,
    title: '分组聚合 Groupby',
    intro:
      '按某个维度分组后计算聚合值，是分析中最常见的模式。groupby + agg/transform/apply 是核心。',
    keyPoints: [
      'df.groupby("category")["value"].sum()',
      '多列分组：df.groupby(["a","b"]).agg({"x":"sum", "y":["mean","max"]})',
      '命名聚合：.agg(total=("x","sum"), avg=("y","mean"))',
      'transform：保留原形状，常用于给每行加上分组统计量',
      '分组后过滤：.filter(lambda g: g["x"].sum() > 0)',
    ],
    commonMistakes: ['忘记处理缺失的分组键（分组会出现 NaN 组）', 'agg 的嵌套写法易出错'],
    demoCode: `import pandas as pd

df = pd.DataFrame({
    "city": ["BJ","SH","BJ","SH","BJ"],
    "product": ["A","A","B","B","A"],
    "sales": [100, 150, 80, 120, 110],
})
print("按城市求和:\\n", df.groupby("city")["sales"].sum())
print("\\n按城市+商品聚合:\\n", df.groupby(["city","product"]).agg(total=("sales","sum"), avg=("sales","mean")))
print("\\ntransform 新增 city_total 列:\\n", df.assign(city_total=df.groupby("city")["sales"].transform("sum")))
`,
    blankCode: `# 练习：建一份含 category + value 的数据，做 groupby sum/mean/agg 与 transform
import pandas as pd

`,
    answerCode: `import pandas as pd
df = pd.DataFrame({"cat":["x","x","y","y","z"], "val":[1,2,3,4,5]})
print(df.groupby("cat")["val"].agg(["sum","mean"]))
df["cat_mean"] = df.groupby("cat")["val"].transform("mean")
print(df)`,
    questions: [
      mkQ({ id: 'g1', prompt: 'df.groupby("a")["x"].sum() 返回类型是？', options: ['DataFrame', 'Series', 'list', 'int'], correctIndex: 1, explanation: '聚合单列返回 Series。' }),
      mkQ({ id: 'g2', prompt: '聚合 sum/mean/max 都支持吗？', options: ['只支持 sum', '支持常见统计函数', '仅数值列可求 mean 等', '后两项都对'], correctIndex: 3, explanation: '聚合支持常见统计，字符串列无法求 mean。' }),
      mkQ({ id: 'g3', prompt: '命名 agg(total=("x","sum")) 含义是？', options: ['不合法', '对列 x 做 sum，并把结果列命名为 total', 'sum 列命名为 x', '多表拼接'], correctIndex: 1, explanation: 'Named aggregation。' }),
      mkQ({ id: 'g4', prompt: 'transform 的特点是？', options: ['返回与原表等长的结果', '返回聚合后的表', '返回分组的第一行', '只返回一行'], correctIndex: 0, explanation: 'transform 保留原表行数。' }),
      mkQ({ id: 'g5', prompt: '想过滤掉总值 < 10 的分组，使用？', options: ['df.filter()', 'df.groupby(...).filter(lambda g: g["x"].sum() >= 10)', 'df.drop(...)', 'df.where(...)'], correctIndex: 1, explanation: 'groupby filter 按组整体过滤。' }),
    ],
    exercises: [
      mkE({
        id: 'ge1',
        title: '练习 13',
        prompt: '按部门分组，求薪资的 sum 与 mean。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"dept":["HR","IT","HR","IT","IT"],"sal":[10,20,12,25,30]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"dept":["HR","IT","HR","IT","IT"],"sal":[10,20,12,25,30]})\nprint(df.groupby("dept")["sal"].agg(["sum","mean"]))`, expectedOutputHints: ['sum', 'mean'] }),
      mkE({
        id: 'ge2',
        title: '练习 14',
        prompt: '用 transform 新增一列 "dept_avg"，打印整张表。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"dept":["A","A","B","B"],"val":[1,3,5,7]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"dept":["A","A","B","B"],"val":[1,3,5,7]})\ndf["dept_avg"] = df.groupby("dept")["val"].transform("mean")\nprint(df)`, expectedOutputHints: ['dept_avg'] }),
    ],
  },
  {
    id: '09-pivot',
    index: 9,
    title: '透视表与交叉表',
    intro:
      'pivot_table 提供 Excel 式的多维汇总；crosstab 则专注于频数/频率表。它们是 groupby 的高级封装。',
    keyPoints: [
      'pd.pivot_table(df, index="行", columns="列", values="值", aggfunc="mean")',
      'margins=True 可增加合计列/行',
      'pd.crosstab(df.a, df.b) 列联表',
      'crosstab(normalize="index") 可得到行百分比',
      'pivot_table 默认聚合函数为 mean',
    ],
    commonMistakes: ['混淆 pivot (用于长→宽) 与 pivot_table (可聚合)', '未指定 aggfunc 导致默认求均值'],
    demoCode: `import pandas as pd

df = pd.DataFrame({
    "city": ["BJ","SH","BJ","SH","BJ","SH"],
    "product": ["A","A","B","B","A","B"],
    "sales": [100, 150, 80, 120, 110, 90],
})
print("透视表 (sum):\\n", pd.pivot_table(df, index="city", columns="product", values="sales", aggfunc="sum", margins=True))
print("\\ncrosstab:\\n", pd.crosstab(df["city"], df["product"]))
`,
    blankCode: `# 构造 3 列数据，分别用 pivot_table 和 crosstab 做一张表
import pandas as pd

`,
    answerCode: `import pandas as pd
df = pd.DataFrame({
    "dept":["HR","IT","HR","IT","IT","HR"],
    "level":["junior","senior","senior","junior","senior","junior"],
    "sal":[6,20,15,10,22,7],
})
print(pd.pivot_table(df, index="dept", columns="level", values="sal", aggfunc="mean"))
print(pd.crosstab(df["dept"], df["level"]))`,
    questions: [
      mkQ({ id: 'pt1', prompt: 'pivot_table 默认聚合是？', options: ['sum', 'count', 'mean', 'max'], correctIndex: 2, explanation: '默认使用 mean。' }),
      mkQ({ id: 'pt2', prompt: '想在透视表中加总计行/列，用哪个参数？', options: ['total=True', 'margins=True', 'sum=True', 'all=True'], correctIndex: 1, explanation: 'margins=True。' }),
      mkQ({ id: 'pt3', prompt: 'crosstab 的主要功能是？', options: ['求均值', '做列联表 (频数)', '做方差分析', '做排序'], correctIndex: 1, explanation: '统计两个因子的交叉计数。' }),
      mkQ({ id: 'pt4', prompt: 'crosstab(normalize="index") 的含义？', options: ['行合计 = 1 (行百分比)', '列合计 = 1', '整体归一化', '不做归一化'], correctIndex: 0, explanation: 'normalize="index" 每行加总为 1。' }),
      mkQ({ id: 'pt5', prompt: 'pivot_table 的 values 参数是？', options: ['分组列', '要聚合的数值列', '行标签', '列标签'], correctIndex: 1, explanation: '传入要汇总的数值列名。' }),
    ],
    exercises: [
      mkE({
        id: 'pte1',
        title: '练习 15',
        prompt: '生成一份三列的 DataFrame，输出 pivot_table。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"g":["a","a","b","b"],"x":["m","n","m","n"],"v":[1,2,3,4]})\nprint(pd.pivot_table(df, index="g", columns="x", values="v", aggfunc="sum"))`, expectedOutputHints: ['m', 'n'] }),
      mkE({
        id: 'pte2',
        title: '练习 16',
        prompt: '对两列因子做 crosstab。', starterCode: `import pandas as pd\ndf = pd.DataFrame({"A":["x","x","y","y","y"],"B":["p","q","p","q","p"]})\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"A":["x","x","y","y","y"],"B":["p","q","p","q","p"]})\nprint(pd.crosstab(df["A"], df["B"]))`, expectedOutputHints: ['p', 'q'] }),
    ],
  },
  {
    id: '10-join',
    index: 10,
    title: 'concat 拼接与 merge 多表关联',
    intro:
      '多源数据整合：concat 用于“堆叠”（行或列），merge 用于按键连接（像 SQL 的 join）。',
    keyPoints: [
      'pd.concat([df1, df2], axis=0) 按行拼接，默认 outer union 的列对齐',
      'pd.concat(..., ignore_index=True) 重排行索引',
      'pd.merge(left, right, on="key", how="inner/left/right/outer")',
      '多键 merge：on=["k1","k2"]',
      '左右列名不同时：left_on + right_on',
    ],
    commonMistakes: ['axis=1 时按索引对齐，索引不同会产生 NaN', '忘记 how=left 导致数据丢失', '键列类型不一致导致无法匹配'],
    demoCode: `import pandas as pd

df1 = pd.DataFrame({"id":[1,2,3],"name":["a","b","c"]})
df2 = pd.DataFrame({"id":[2,3,4],"score":[80,90,70]})
print("行拼接:\\n", pd.concat([df1, df2], axis=0, ignore_index=True))
print("\\ninner join:\\n", pd.merge(df1, df2, on="id", how="inner"))
print("\\nleft join:\\n", pd.merge(df1, df2, on="id", how="left"))
`,
    blankCode: `# 构造两个 DataFrame，做一次 concat、一次 inner merge、一次 left merge
import pandas as pd

`,
    answerCode: `import pandas as pd
a = pd.DataFrame({"k":[1,2,3],"v1":[10,20,30]})
b = pd.DataFrame({"k":[2,3,4],"v2":[200,300,400]})
print(pd.concat([a,b], axis=0, ignore_index=True))
print(pd.merge(a, b, on="k", how="inner"))
print(pd.merge(a, b, on="k", how="left"))`,
    questions: [
      mkQ({ id: 'j1', prompt: '按行堆叠两张同列的表用？', options: ['pd.join', 'pd.concat([df1,df2])', 'pd.merge(axis=0)', 'df.append'], correctIndex: 1, explanation: 'concat 默认 axis=0 按行拼。' }),
      mkQ({ id: 'j2', prompt: 'merge 的默认连接方式是？', options: ['left', 'right', 'inner', 'outer'], correctIndex: 2, explanation: '默认 inner，仅保留匹配项。' }),
      mkQ({ id: 'j3', prompt: '左表有 3 行，右表 2 行能匹配，left join 后行数？', options: ['2', '3', '5', '6'], correctIndex: 1, explanation: 'left join 保留左表所有行。' }),
      mkQ({ id: 'j4', prompt: '左右表键名不同时用？', options: ['on=("a","b")', 'left_on="a", right_on="b"', 'keys=["a","b"]', '无法做到'], correctIndex: 1, explanation: '使用 left_on / right_on。' }),
      mkQ({ id: 'j5', prompt: 'concat 后索引乱序怎么办？', options: ['reset_index()', 'ignore_index=True', 'sort_index()', '后两项都可以'], correctIndex: 3, explanation: '通常用 ignore_index=True 更直接。' }),
    ],
    exercises: [
      mkE({
        id: 'je1',
        title: '练习 17',
        prompt: '构造两张表，做 inner merge 并打印。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\nusers = pd.DataFrame({"uid":[1,2,3],"name":["x","y","z"]})\nscores = pd.DataFrame({"uid":[1,2,2,3],"score":[80,85,90,70]})\nprint(pd.merge(users, scores, on="uid"))`, expectedOutputHints: ['uid', 'name', 'score'] }),
      mkE({
        id: 'je2',
        title: '练习 18',
        prompt: '两个同列结构的表按行拼接。', starterCode: `import pandas as pd\ndf1 = pd.DataFrame({"a":[1,2],"b":[3,4]})\ndf2 = pd.DataFrame({"a":[5,6],"b":[7,8]})\n`, solutionCode: `import pandas as pd\ndf1 = pd.DataFrame({"a":[1,2],"b":[3,4]})\ndf2 = pd.DataFrame({"a":[5,6],"b":[7,8]})\nprint(pd.concat([df1, df2], ignore_index=True))`, expectedOutputHints: ['1', '2', '5', '6'] }),
    ],
  },
  {
    id: '11-stats',
    index: 11,
    title: '描述统计、分位数、异常值识别',
    intro:
      '统计摘要用于快速理解数据分布。常见的异常值识别方法是 IQR 规则与 Z-score 简单阈值。',
    keyPoints: [
      '.describe() 输出 count/mean/std/min/四分位数/max',
      '.quantile([0.25, 0.5, 0.75]) 自定义分位数',
      'IQR = Q3 - Q1；异常阈值：Q1-1.5*IQR，Q3+1.5*IQR',
      'Z-score：(x - mean) / std；|z|>3 可视为异常',
      '使用上述规则做布尔筛选保留/剔除异常行',
    ],
    commonMistakes: ['忽略样本量过小导致四分位数没有意义', 'IQR 适用于单峰大致对称数据'],
    demoCode: `import pandas as pd
import numpy as np

data = np.random.RandomState(0).normal(100, 15, size=100)
data[[5, 20, 80]] = 250, 260, 240  # 造几个异常
df = pd.DataFrame({"v": data})
print("describe:\\n", df.describe())
q1, q3 = df["v"].quantile([0.25, 0.75])
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print("\\nIQR 异常阈值:", low, high)
print("异常值:\\n", df[(df["v"] < low) | (df["v"] > high)])
print("剔除异常后行数:", len(df[(df["v"] >= low) & (df["v"] <= high)]))
`,
    blankCode: `# 构造含异常值的 Series，分别用 IQR 与 Z-score 两种规则检测
import pandas as pd
import numpy as np

`,
    answerCode: `import pandas as pd
import numpy as np

np.random.seed(1)
s = pd.Series(np.random.normal(50, 5, 200))
s[[10, 50, 120]] = 200, 210, 5
q1, q3 = s.quantile([0.25, 0.75])
iqr = q3 - q1
mask_iqr = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
print("IQR 异常数:", mask_iqr.sum())
z = (s - s.mean()) / s.std()
print("Z>3 异常数:", (z.abs() > 3).sum())`,
    questions: [
      mkQ({ id: 'st1', prompt: '.quantile(0.5) 等价于？', options: ['mean', 'median', 'mode', 'std'], correctIndex: 1, explanation: '50% 分位数即中位数。' }),
      mkQ({ id: 'st2', prompt: 'IQR 指？', options: ['最大值-最小值', 'Q3-Q1', '标准差', '方差'], correctIndex: 1, explanation: '四分位距。' }),
      mkQ({ id: 'st3', prompt: '常用异常阈值：', options: ['Q1-1.5*IQR, Q3+1.5*IQR', 'mean ± std', 'min/max', 'mode ± 2'], correctIndex: 0, explanation: '经典 Tukey 方法。' }),
      mkQ({ id: 'st4', prompt: 'Z-score 计算方式？', options: ['x - mean', '(x - mean)/std', '(x - min)/range', '(max - x)/std'], correctIndex: 1, explanation: '标准化。' }),
      mkQ({ id: 'st5', prompt: '异常值处理策略？', options: ['直接删除', '用中位数/分位数盖帽 (clip)', '单独标记分析', '视业务而定'], correctIndex: 3, explanation: '没有银弹，视业务决定。' }),
    ],
    exercises: [
      mkE({
        id: 'ste1',
        title: '练习 19',
        prompt: '生成含异常值的列，输出 25/50/75 分位数。', starterCode: `import pandas as pd, numpy as np\n`, solutionCode: `import pandas as pd, numpy as np\ns = pd.Series([1,2,3,4,5,100])\nprint(s.quantile([0.25,0.5,0.75]))`, expectedOutputHints: ['0.25', '0.50', '0.75'] }),
      mkE({
        id: 'ste2',
        title: '练习 20',
        prompt: '用 IQR 规则标记异常行，并打印剔除后的行数。', starterCode: `import pandas as pd, numpy as np\nnp.random.seed(0)\ndf = pd.DataFrame({"x": np.concatenate([np.random.normal(0,1,100), [10,-10]])})\n`, solutionCode: `import pandas as pd, numpy as np\nnp.random.seed(0)\ndf = pd.DataFrame({"x": np.concatenate([np.random.normal(0,1,100), [10,-10]])})\nq1,q3 = df["x"].quantile([0.25,0.75])\niqr = q3 - q1\nprint(len(df[(df["x"] >= q1 - 1.5*iqr) & (df["x"] <= q3 + 1.5*iqr)]))`, expectedOutputHints: ['100'] }),
    ],
  },
  {
    id: '12-project',
    index: 12,
    title: '综合实战：销售数据分析 + 可视化',
    intro:
      '把前面所学串起来：读取销售数据 → 清洗 → 分析 → 可视化。matplotlib 是 Python 绘制基础图表的标准库，与 Pandas 配合极佳。',
    keyPoints: [
      'pd.read_csv("...") 读取数据',
      '综合使用 isna/duplicated/groupby/sort_values',
      '使用 matplotlib.pyplot 绘制柱状图、折线图',
      '保存图表、输出结论',
    ],
    commonMistakes: ['未处理缺失导致聚合时被忽略', '绘图中未设置中文环境（浏览器 Pyodide 中文需要字体，本节英文即可）'],
    demoCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "month":["Jan","Feb","Mar","Apr","May","Jun"],
    "region":["N","N","S","S","N","S"],
    "sales":[120, 150, 130, 180, 200, 210],
})
print("总销售额:", df["sales"].sum())
by_region = df.groupby("region")["sales"].sum()
print("\\n按区域:\\n", by_region)

# 折线图（matplotlib 会被解析器转为图片）
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(df["month"], df["sales"], marker="o")
ax.set_title("Monthly Sales")
ax.set_xlabel("month")
ax.set_ylabel("sales")
ax.grid(True, alpha=0.3)
print("<FIGURE>")  # 占位，实际结果渲染器会捕获 fig
plt.close(fig)
`,
    blankCode: `# 自由发挥：构造/读取一份销售 DataFrame，做 groupby 聚合并绘图
import pandas as pd
import matplotlib.pyplot as plt

`,
    answerCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "product":["A","A","B","B","C","C"],
    "year":[2023,2024,2023,2024,2023,2024],
    "revenue":[100,150,80,120,50,90],
})
agg = df.groupby("product")["revenue"].sum().sort_values(ascending=False)
print(agg)
fig, ax = plt.subplots(figsize=(6,4))
agg.plot(kind="bar", ax=ax, color="#165DFF")
ax.set_title("Revenue by Product")
print("<FIGURE>")
plt.close(fig)
`,
    questions: [
      mkQ({ id: 'c1', prompt: '读取 CSV 的方法是？', options: ['pd.read_csv', 'pd.load_csv', 'pd.csv', 'pd.read'], correctIndex: 0, explanation: 'pd.read_csv(路径)。' }),
      mkQ({ id: 'c2', prompt: '想按多列聚合后按聚合值排序：', options: ['groupby(...).sum().sort_values("col")', 'sort_values(...).groupby(...)', 'groupby(...).sort()', '无法'], correctIndex: 0, explanation: '先分组再排序。' }),
      mkQ({ id: 'c3', prompt: '绘图前推荐准备？', options: ['什么都不需要', '明确要展示的指标/维度', '必须有 GPU', '数据必须 >10k 行'], correctIndex: 1, explanation: '先明确业务问题。' }),
      mkQ({ id: 'c4', prompt: 'matplotlib 中创建 Figure/Axes 对的推荐写法？', options: ['plt.figure()', 'fig, ax = plt.subplots()', 'ax = plt.new()', '没有固定写法'], correctIndex: 1, explanation: 'subplots() 返回 Figure 和 Axes 对象，更可控。' }),
      mkQ({ id: 'c5', prompt: '做柱状图用 Axes 的哪个方法？', options: ['.plot(kind="bar")', '.bar(...)', '.hist(...)', '.boxplot(...)'], correctIndex: 1, explanation: '.bar(x, height) 是 Axes 层原生 API。' }),
    ],
    exercises: [
      mkE({
        id: 'ce1',
        title: '练习 21',
        prompt: '构造 6 行销售数据，按 product 聚合销售额并降序打印。', starterCode: `import pandas as pd\n`, solutionCode: `import pandas as pd\ndf = pd.DataFrame({"product":["A","B","A","C","B","C"],"sales":[10,20,30,15,25,35]})\nagg = df.groupby("product")["sales"].sum().sort_values(ascending=False)\nprint(agg)`, expectedOutputHints: ['C', 'B', 'A'] }),
      mkE({
        id: 'ce2',
        title: '练习 22',
        prompt: '绘制一幅简单的柱状图（使用 matplotlib）。', starterCode: `import pandas as pd, matplotlib.pyplot as plt\ndf = pd.DataFrame({"x":["Q1","Q2","Q3","Q4"],"y":[10,20,15,25]})\n`, solutionCode: `import pandas as pd, matplotlib.pyplot as plt\ndf = pd.DataFrame({"x":["Q1","Q2","Q3","Q4"],"y":[10,20,15,25]})\nfig, ax = plt.subplots()\nax.bar(df["x"], df["y"], color="#165DFF")\nprint("<FIGURE>")\nplt.close(fig)`, expectedOutputHints: ['<FIGURE>'] }),
    ],
  },
];

export const courses: Course[] = lessons.map((lesson, idx) => ({
  id: lesson.id,
  index: idx + 1,
  title: lesson.title,
  summary: lesson.intro.slice(0, 80) + '...',
  lessons: [lesson],
}));

export const courseCount = courses.length;
export const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
