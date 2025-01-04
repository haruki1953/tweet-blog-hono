# Tweblog

- 网站 https://tweblog.com
- 文档 https://github.com/haruki1953/Tweblog
- 后端 https://github.com/haruki1953/tweet-blog-hono
- 前端1（管理） https://github.com/haruki1953/tweet-blog-vue3
- 前端2（公开） https://github.com/haruki1953/tweet-blog-public-vue3

```sh
# 安装项目依赖
pnpm install

# 生成Prisma Client
pnpm prisma generate

# 将Prisma schema推送到数据库，创建数据库
pnpm prisma db push

# 启动开发服务器
pnpm dev
```

```
open http://localhost:3000
```