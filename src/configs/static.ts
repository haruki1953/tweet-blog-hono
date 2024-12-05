// 静态文件托管配置
export const staticConfig = {
  files: [
    // 前端存放位置
    {
      path: '*',
      root: './static'
    },
    // 数据存放位置（图片）
    {
      path: '*',
      root: './data/public'
    }
  ],
  // 在 onFound 中对找到的文件匹配，匹配后设置对应头
  settings: [
    {
      // mediaFiles
      pathReg: /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|psd|ai|eps|mp4|avi|swf|mp3|pdf|ttf|woff2|woff|otf)$/,
      headers: [
        {
          name: 'Cache-Control',
          value: `public, immutable, max-age=${180 * 24 * 60 * 60}`
        }
      ]
    },
    {
      // webFiles
      pathReg: /\.(js|css)$/,
      headers: [
        {
          name: 'Cache-Control',
          value: `public, immutable, max-age=${180 * 24 * 60 * 60}`
        }
      ]
    }
  ]
}