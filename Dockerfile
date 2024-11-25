FROM node:20.12.2-alpine3.19 AS base

FROM base AS builder
WORKDIR /app

# 复制项目全部文件至工作目录 
# 注意：提前删除了/node_modules /data
COPY . .

# 设置代理
ENV http_proxy=http://192.168.2.110:10811/
ENV https_proxy=http://192.168.2.110:10811/

# 安装 pnpm、安装依赖、运行迁移、编译和修剪依赖
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm prisma migrate dev --name init && \
    pnpm build && \
    pnpm prune --prod

# 取消代理
ENV http_proxy=
ENV https_proxy=

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/data /app/data
COPY --from=builder --chown=hono:nodejs /app/static /app/static
COPY --from=builder --chown=hono:nodejs /app/prisma /app/prisma

USER hono

# 设置端口
ENV TWEET_BLOG_HONO_PORT=51125
EXPOSE 51125

CMD ["node", "dist/index.js"]