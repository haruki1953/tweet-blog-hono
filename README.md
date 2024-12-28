# Tweblog

- 后端 https://github.com/haruki1953/tweet-blog-hono
- 前端1（管理） https://github.com/haruki1953/tweet-blog-vue3
- 前端2（公开） https://github.com/haruki1953/tweet-blog-public-vue3

```sh
pnpm install

# prisma运行迁移 将在 /data 创建数据库
pnpm prisma migrate dev --name init

pnpm dev
```

```
open http://localhost:3000
```