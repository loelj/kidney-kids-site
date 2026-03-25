# 部署备忘录

## 项目技术栈
- 前端/后端：Next.js 14 + TypeScript
- 数据库 ORM：Prisma
- 数据库：Supabase（PostgreSQL）
- 部署平台：Vercel
- 认证：NextAuth.js
- 样式：Tailwind CSS
- 国际化：next-intl（中文/英文）

---

## 当前部署架构

| 服务 | 平台 | 地址 |
|------|------|------|
| 网站 | Vercel | https://kidney-kids-site.vercel.app |
| 数据库 | Supabase | aws-0-us-west-2.pooler.supabase.com |
| 代码仓库 | GitHub | https://github.com/loelj/kidney-kids-site |

---

## Vercel 环境变量（必须配置）

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | Supabase 连接字符串（端口6543，带pgbouncer=true） |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 |
| `NEXTAUTH_URL` | 网站完整域名，如 https://kidney-kids-site.vercel.app |

---

## 曾经遇到的问题及解决方案

### 问题1：注册失败 Registration failed
- 原因：Prisma schema 配置了 `directUrl = env("DIRECT_URL")`，但 Vercel 没有配置该环境变量
- 解决：删除 schema.prisma 中的 `directUrl` 行，同时把 build 命令中的 `prisma db push` 去掉
- 最终 build 命令：`prisma generate && next build`

### 问题2：登录后 Server error
- 原因：用了临时部署域名（带随机字符）访问，与 NEXTAUTH_URL 不匹配
- 解决：始终使用固定域名 https://kidney-kids-site.vercel.app 访问

### 问题3：国内手机无法访问
- 原因：Vercel 服务器在海外，国内网络访问受限
- 解决：需迁移到国内服务器并备案（见下方方案）

---

## 修改网站内容

文章内容存放在 `content/zh/` 目录下，格式为 `.mdx` 文件。

修改后推送到 GitHub，Vercel 自动重新部署：
```bash
cd /home/loelj/kidney-kids-site
git add -A
git commit -m "更新内容"
git push origin main
```

---

## 国内服务器部署方案（备案后）

### 第一步：买域名
- 平台：https://wanwang.aliyun.com
- 推荐：`.cn` 约 ¥29/年，`.com` 约 ¥68/年

### 第二步：买服务器（ECS）
- 平台：https://ecs.console.aliyun.com
- 配置：2核4G，Ubuntu 22.04，5Mbps带宽
- 地域：华东上海 或 华南深圳
- 费用：约 ¥100-200/月（新用户有优惠）

### 第三步：ICP 备案
- 入口：阿里云控制台 → ICP 备案
- 材料：身份证、域名证书、服务器信息
- 周期：2-4 周

### 第四步：服务器部署步骤（备案通过后）
1. 安装 Node.js 环境
2. 从 GitHub 拉取代码
3. 配置环境变量
4. 用 PM2 启动 Next.js
5. 用 Nginx 绑定域名和 HTTPS

---

## 扩容建议

| 用户规模 | 建议方案 |
|----------|----------|
| 0-1000人 | 当前免费版够用 |
| 1000-10000人 | 升级 Vercel Pro（$20/月）+ Supabase Pro（$25/月） |
| 10000人以上 | 迁移国内服务器，考虑 CDN 加速 |
