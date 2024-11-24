FROM node:20.12.2-alpine3.19 AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

# 复制项目全部文件至工作目录 
# 注意：提前删除了/node_modules /data
COPY . .

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 运行迁移 创建数据库表 生成 Prisma 客户端
RUN pnpm prisma migrate dev --name init

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]