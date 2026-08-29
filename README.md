# BMI Calculator

一个使用 **React + TypeScript + Vite** 构建的 BMI 健康仪表盘，并通过 GitHub Actions 自动发布到 GitHub Pages。

## 功能

- 输入身高（cm）和体重（kg）计算 BMI
- 显示偏瘦、正常、超重、肥胖分类
- 可视化 BMI 区间指示器
- 根据当前身高估算健康体重参考范围
- 保存最近 10 条 BMI 记录到浏览器 Local Storage
- 响应式布局，支持桌面端和手机浏览器
- GitHub Actions 自动构建和部署

## 技术栈

- React 19
- TypeScript
- Vite
- GitHub Actions
- GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物会生成到 `dist/`。

## 自动部署

仓库包含 `.github/workflows/deploy-pages.yml`。

当代码合并或推送到 `main` 后，GitHub Actions 会自动：

1. 安装 Node.js 和项目依赖
2. 运行 TypeScript + Vite 构建
3. 上传 `dist/` 构建产物
4. 发布到 GitHub Pages

GitHub Pages 的 **Build and deployment → Source** 需要设置为 **GitHub Actions**。

在线地址：

`https://zhl9691.github.io/BMI-Calculator/`

## BMI 公式

`BMI = 体重(kg) / 身高(m)^2`

> BMI 只是一般筛查参考，不能替代医生或其他专业医疗人员的评估。
