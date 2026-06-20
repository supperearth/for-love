# 情侣纪念日小游戏网站

这是一个为情侣纪念日准备的轻量互动网站。项目采用纯前端实现，不依赖后端、数据库或账号系统，部署后可以通过域名直接访问。

第一版流程：

```text
暗号入口
→ 纪念日欢迎页
→ 回忆问答小游戏
→ 翻牌配对小游戏
→ 最终信件 / 彩蛋页
```

## 技术栈

```text
Vite
React
TypeScript
CSS
```

构建后会生成静态文件，可以部署到 Cloudflare Pages、Vercel、Netlify 或 GitHub Pages。推荐使用 Cloudflare Pages。

## 本地开发

安装依赖：

```powershell
npm install
```

启动开发服务器：

```powershell
npm run dev
```

构建生产版本：

```powershell
npm run build
```

本地预览生产构建：

```powershell
npm run preview
```

如果在 Windows PowerShell 里遇到 `npm.ps1` 执行策略限制，可以改用：

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## 内容修改位置

主要纪念内容集中在：

```text
src/data/siteContent.ts
```

可以修改：

```text
accessCode          暗号
coupleNames         两个人的名字或昵称
anniversaryTitle    网站标题
anniversaryDate     纪念日日期
openingLine         暗号页开场白
welcomeText         欢迎页文字
memories            回忆节点
questions           问答题
matchPairs          翻牌配对内容
finalLetterTitle    最终页标题
finalLetter         最终信件或彩蛋文字
```

当前 `accessCode` 留空时，输入任意非空内容都可以进入。正式上线前建议改成你准备好的暗号。

## 图片资源

图片建议放在：

```text
public/images/
```

在数据文件中引用时使用以 `/images/` 开头的路径，例如：

```ts
image: "/images/first-date.jpg"
```

注意线上环境通常区分文件名大小写。代码里写的文件名必须和真实图片文件名完全一致。

## Cloudflare Pages 部署要求

推荐部署流程：

```text
GitHub 仓库
→ Cloudflare Pages
→ 绑定自定义域名
→ HTTPS 自动生效
```

Cloudflare Pages 构建配置：

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Production branch: main
Root directory: /
```

项目已包含：

```text
public/_redirects
```

内容为：

```text
/* /index.html 200
```

这个文件用于避免单页网站刷新路径时出现 404。

## 域名建议

建议绑定一个二级域名：

```text
love.yourdomain.com
anniversary.yourdomain.com
```

DNS 通常添加：

```text
Type: CNAME
Name: love
Target: 你的项目名.pages.dev
```

具体记录值以 Cloudflare Pages 页面显示为准。

## 安全注意

这是静态网站，不是真正的私密系统。不要上传特别隐私的照片、真实住址、手机号、证件信息或任何敏感密钥。

暗号入口只用于增加仪式感和避免普通误入，不能作为真正的访问控制。

## 上线前检查

上线前建议确认：

```text
npm run build 成功
Cloudflare Pages 部署成功
默认 pages.dev 地址可访问
自定义域名可访问
HTTPS 正常
手机浏览器显示正常
微信内置浏览器显示正常
图片加载正常
问答流程可完成
翻牌流程可完成
最终彩蛋可打开
```
