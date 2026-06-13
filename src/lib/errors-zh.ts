export interface ErrorZhInfo {
  type: 'syntax' | 'missing' | 'runtime' | 'timeout';
  zh: string;
  hint?: string;
}

const syntaxPatterns: Array<{ re: RegExp; zh: string; hint?: string }> = [
  {
    re: /IndentationError|unindent does not match any outer indentation level|expected an indented block/,
    zh: '缩进错误：请检查代码缩进（建议统一使用 4 个空格）。',
    hint: 'Python 对缩进敏感，循环/条件/函数体需要缩进。',
  },
  {
    re: /SyntaxError.*invalid syntax|SyntaxError.*unexpected/,
    zh: '语法错误：存在不合法的表达式。',
    hint: '请检查是否缺少冒号、括号、逗号或引号。',
  },
  {
    re: /SyntaxError.*EOF while scanning string literal/,
    zh: '字符串未闭合：引号没有配对。',
  },
  {
    re: /SyntaxError.*unterminated/,
    zh: '括号/字符串未结束。',
  },
  {
    re: /SyntaxError.*return.*outside function/,
    zh: 'return 语句写在函数外。',
  },
  {
    re: /SyntaxError/,
    zh: '语法错误：请检查语句结构。',
  },
];

const missingPatterns: Array<{ re: RegExp; zh: string; hint?: string }> = [
  {
    re: /ModuleNotFoundError|ImportError.*No module named/,
    zh: '模块未找到：请确认是否导入了正确的库名。',
    hint: '环境已预装 numpy/pandas/matplotlib，其他库请通过 micropip.install 安装。',
  },
  {
    re: /ImportError.*cannot import name/,
    zh: '导入错误：模块中没有该名字。',
  },
];

const runtimePatterns: Array<{ re: RegExp; zh: string; hint?: string }> = [
  {
    re: /NameError.*name.*is not defined/,
    zh: '变量未定义：使用了尚未声明的变量/函数名。',
  },
  {
    re: /TypeError.*not subscriptable/,
    zh: '类型错误：对不可下标访问的值使用了 []。',
  },
  {
    re: /TypeError.*unsupported operand/,
    zh: '类型错误：操作符两边的类型不匹配。',
  },
  {
    re: /TypeError/,
    zh: '类型错误：请检查传入参数的类型。',
  },
  {
    re: /KeyError/,
    zh: '键不存在：字典/Series/DataFrame 中没有这个键。',
  },
  {
    re: /IndexError.*list index out of range/,
    zh: '索引越界：访问了超出列表长度的位置。',
  },
  {
    re: /IndexError/,
    zh: '索引错误。',
  },
  {
    re: /ValueError/,
    zh: '值错误：参数值不合法（例如形状不匹配、空数据等）。',
  },
  {
    re: /AttributeError.*has no attribute/,
    zh: '属性错误：该对象没有该方法/属性。',
  },
  {
    re: /ZeroDivisionError/,
    zh: '除零错误：除数为 0。',
  },
  {
    re: /OverflowError/,
    zh: '数值溢出：数值超过了表示范围。',
  },
  {
    re: /FileNotFoundError/,
    zh: '文件未找到：路径不正确或浏览器沙箱中没有该文件。',
    hint: 'Pyodide 环境使用虚拟文件系统，可通过 pyodide.FS 操作。',
  },
  {
    re: /RecursionError/,
    zh: '递归深度超过限制。',
  },
  {
    re: /AssertionError/,
    zh: '断言失败：assert 条件为 False。',
  },
];

export function classifyError(traceback: string): ErrorZhInfo {
  if (!traceback) {
    return { type: 'runtime', zh: '未知错误' };
  }

  for (const p of syntaxPatterns) {
    if (p.re.test(traceback)) {
      return { type: 'syntax', zh: p.zh, hint: p.hint };
    }
  }
  for (const p of missingPatterns) {
    if (p.re.test(traceback)) {
      return { type: 'missing', zh: p.zh, hint: p.hint };
    }
  }
  for (const p of runtimePatterns) {
    if (p.re.test(traceback)) {
      return { type: 'runtime', zh: p.zh, hint: p.hint };
    }
  }

  return { type: 'runtime', zh: '运行时异常：请查看下方详细报错信息。' };
}

export function formatZhMessage(info: ErrorZhInfo): string {
  return info.hint ? `${info.zh} 提示：${info.hint}` : info.zh;
}
