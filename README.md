# Tweblog

- 后端 https://github.com/haruki1953/tweet-blog-hono
- 前端 https://github.com/haruki1953/tweet-blog-vue3


```sh
pnpm install

# prisma运行迁移 将在 /data 创建数据库
pnpm prisma migrate dev --name init

pnpm dev
```

```
open http://localhost:3000
```

遇到了问题
```
现在正在准备docker打包，所以想先尝试一下将项目其编译为js再运行

pnpm build 之后，执行 node dist/index.js 出现了报错

$ node dist/index.js 
node:internal/modules/esm/resolve:249
    throw new ERR_UNSUPPORTED_DIR_IMPORT(path, fileURLToPath(base), String(resolved));
          ^

Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import 'E:\Project\tweet-blog\tweet-blog-hono\dist\configs' is not supported resolving ES modules imported from E:\Project\tweet-blog\tweet-blog-hono\dist\index.js
    at finalizeResolution (node:internal/modules/esm/resolve:249:11)
    at moduleResolve (node:internal/modules/esm/resolve:908:10)
    at defaultResolve (node:internal/modules/esm/resolve:1121:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:396:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:365:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:240:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:85:39)
    at link (node:internal/modules/esm/module_job:84:36) {
  code: 'ERR_UNSUPPORTED_DIR_IMPORT',
  url: 'file:///E:/Project/tweet-blog/tweet-blog-hono/dist/configs'
}

Node.js v20.10.0
```

```
大概是因为 Node 在处理模块时，不能自动找到目录里的 index.js 文件，

比如 
import { httpPort } from './configs'
好像必须要这样写 
import { httpPort } from './configs/index'

但是自己 pnpm dev 时是没问题的，整个项目里都是省略了index的，再改有点不现实

话说，省略index是正确的写法吗？
是不是哪里还要进行一些设置啊
```

