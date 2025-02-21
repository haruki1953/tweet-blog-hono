import { blueskyConfig } from './dependencies'

// 判断推文是否过长
export const blueskyPostContentCheckUtil = (content: string) => {
  // 长度
  const length = textToPostContentPartCalcCharNumber(content)
  // 是否超过限制
  const isExceedsLengthLimit = length > blueskyConfig.maxPostCharactersOnSend
  return {
    length,
    isExceedsLengthLimit
  }
}

// 推文过长时，进行处理
export const blueskyPostContentSplitUtil = (content: string) => {
  const postContent = textToPostContentPart(content)
  const postContentSplit = splitPostContent(postContent, blueskyConfig.maxPostCharactersOnSend)
  // console.log(postContentSplit)
  const postContentTextList = postContentSplit.map(p => textByPostContentPart(p))
  return postContentTextList
}

// 推文过长拆分的处理
export const splitPostContent = (
  postContent: PostContentPart[],
  maxLength: number
): PostContentPart[][] => {
  if (maxLength < 20) {
    throw new Error('maxLength cannot be less than 20')
  }

  const result: PostContentPart[][] = []
  let currentChunk: PostContentPart[] = []
  let currentLength = 0

  // 将 maxLength 减10，以留出计数标识的位置，如 ' (999/999)'
  const maxLengthWithoutChunkCountLabel = maxLength - 10

  for (const part of postContent) {
    if (part.type === 'link') {
      // 链接不能被裁剪，直接添加到当前块
      // 【250221】这里进行修正，不要直接调用textCalcCharNumber，应调用textCalcPostContentCharNumber
      // const linkLength = textCalcCharNumber(part.href)
      const linkLength = textCalcPostContentCharNumber([part])
      if (currentLength + linkLength > maxLengthWithoutChunkCountLabel) {
        // 如果当前块加上链接会超出限制，则开始新的块
        result.push(currentChunk)
        currentChunk = []
        currentLength = 0
      }
      currentChunk.push(part)
      currentLength += linkLength
    } else if (part.type === 'text') {
      // 文本可以被裁剪
      let remainingText = part.content
      while (remainingText.length > 0) {
        const remainingLength = maxLengthWithoutChunkCountLabel - currentLength
        // 计算可以添加到当前块的文本长度
        const textToAdd = truncateTextToFit(remainingText, remainingLength)
        const textLength = textCalcCharNumber(textToAdd)

        if (remainingLength <= 0 || textLength <= 0) {
          // 如果当前块已满，开始新的块
          result.push(currentChunk)
          currentChunk = []
          currentLength = 0
          continue
        }

        // 添加文本到当前块
        currentChunk.push({ type: 'text', content: textToAdd })
        currentLength += textLength
        remainingText = remainingText.slice(textToAdd.length)
      }
    }
  }

  // 添加最后一个块
  if (currentChunk.length > 0) {
    result.push(currentChunk)
  }

  // 在每个块的末尾添加计数标识
  for (let i = 0; i < result.length; i++) {
    const chunk = result[i]
    const countText = ` (${i + 1}/${result.length})`
    const countTextLength = textCalcCharNumber(countText)

    // 检查当前块的长度是否足够添加计数标识
    const chunkLength = textCalcPostContentCharNumber(chunk)
    if (chunkLength + countTextLength <= maxLength) {
      chunk.push({ type: 'text', content: countText })
    } else {
      // 如果不够，则裁剪最后一个文本部分以腾出空间
      const lastPart = chunk[chunk.length - 1]
      if (lastPart.type === 'text') {
        const truncatedText = truncateTextToFit(
          lastPart.content,
          maxLength - (chunkLength - textCalcCharNumber(lastPart.content)) - countTextLength
        )
        if (truncatedText.length > 0) {
          chunk[chunk.length - 1] = { type: 'text', content: truncatedText }
          chunk.push({ type: 'text', content: countText })
        }
      }
    }
  }

  return result
}

// 辅助函数：裁剪文本以适应剩余空间
const truncateTextToFit = (text: string, maxLength: number): string => {
  let result = ''
  let length = 0

  for (const char of text) {
    // const charLength = /[\u3000-\u303F\uFF00-\uFFEF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(char) ? 2 : 1
    // 【bluesky】无论中英文都是算作1个字符
    const charLength = 1
    if (length + charLength > maxLength) {
      break
    }
    result += char
    length += charLength
  }

  return result
}

// 推文链接信息的解析
export const blueskyPostContentInfoUtil = (content: string) => {
  const postContent = textToPostContentPart(content)
  const linkInfo: Array<{
    byteStart: number
    byteEnd: number
    link: string
  }> = []

  postContent.forEach((item, index) => {
    if (item.type === 'link') {
      // byteStart 数组中item之前的所有项的字节数之和
      const byteStart = getPostContentByteLength(postContent.slice(0, index))
      // byteEnd 为 byteStart 加本项的字节数
      const byteEnd = byteStart + getPostContentByteLength([item])
      // link
      const link = item.href
      linkInfo.push({
        byteStart,
        byteEnd,
        link
      })
    }
  })

  // 将链接内容和文字组合为内容
  const textContent = textByPostContentPartAndLinkByContent(postContent)

  return {
    textContent,
    linkInfo
  }
}

// 辅助函数，计算PostContentPart[]字节数之和
const getPostContentByteLength = (
  postContent: PostContentPart[]
) => {
  let byteLength = 0
  postContent.forEach((i) => {
    byteLength += getStringByteLength(i.content)
  })
  return byteLength
}

interface PostContentTextPart {
  type: 'text'
  content: string
}

interface PostContentLinkPart {
  type: 'link'
  content: string
  href: string
}

type PostContentPart = PostContentTextPart | PostContentLinkPart

// 将PostContentPart[]拼接为字符串，这个将在拆分后使用
export const textByPostContentPart = (postContent: PostContentPart[]): string => {
  let text = ''
  for (const p of postContent) {
    if (p.type === 'link') {
      text += p.href
    } else {
      text += p.content
    }
  }
  return text
}

// 将PostContentPart[]拼接为字符串，这个将在解析链接后使用
export const textByPostContentPartAndLinkByContent = (postContent: PostContentPart[]): string => {
  let text = ''
  for (const p of postContent) {
    if (p.type === 'link') {
      // text += p.href
      // 【bluesky】应拼接链接显示的内容，因为之后会附加指定连接
      text += p.content
    } else {
      text += p.content
    }
  }
  return text
}

// 将字符串解析为PostContentPart[]
export const textToPostContentPart = (text: string): PostContentPart[] => {
  const parts: PostContentPart[] = [] // 用于存储解析后的部分
  const regex = /(https?:\/\/[^\s]+)/g // 匹配链接的正则表达式
  let lastIndex = 0 // 记录上一个匹配结束的位置

  // 使用 matchAll 方法找到所有链接
  const matches = text.matchAll(regex)
  for (const match of matches) {
    const offset = match.index // 当前匹配的开始位置
    // 如果当前匹配前有普通文本部分，添加到 parts 数组
    if (offset > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, offset)
      })
    }
    // 添加链接部分到 parts 数组
    // 限制链接文本长度
    // 【bluesky】正需要这个
    const linkContent = (() => {
      const cutHttp = match[0].replace(/https?:\/\//, '')
      const limitLength = (() => {
        const maxLength = blueskyConfig.linkContentMaxLength
        if (cutHttp.length > maxLength) {
          return cutHttp.slice(0, maxLength) + '...'
        } else {
          return cutHttp
        }
      })()
      return limitLength
    })()
    parts.push({
      type: 'link',
      content: linkContent,
      href: match[0]
    })
    // 更新 lastIndex 为当前匹配结束的位置
    lastIndex = offset + match[0].length
  }

  // 如果最后一个匹配后还有剩余的普通文本部分，添加到 parts 数组
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    })
  }

  return parts // 返回解析后的部分数组
}

export const textCalcCharNumber = (str: string): number => {
  let length = 0

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const char of str) {
    // // 判断是否为宽字符（包括中文、日文、韩文以及其他全角字符）
    // if (/[\u3000-\u303F\uFF00-\uFFEF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(char)) {
    //   length += 2 // 宽字符长度计为2
    // } else {
    //   length += 1 // 其他字符长度计为1
    // }
    // 【bluesky】无论中英文都是算作1个字符
    length += 1
  }

  return length
}

// 计算PostContentPart[]的字数
export const textCalcPostContentCharNumber = (
  postContent: PostContentPart[]
) => {
  let length = 0
  postContent.forEach((p) => {
    if (p.type === 'link') {
      // length += textCalcCharNumber(p.href)
      // 【bluesky】应计算链接显示文本的长度
      length += textCalcCharNumber(p.content)
    } else {
      length += textCalcCharNumber(p.content)
    }
  })
  return length
}

// 计算字符串字数
export const textToPostContentPartCalcCharNumber = (text: string) => {
  return textCalcPostContentCharNumber(textToPostContentPart(text))
}

// 获取字符串字节数
const getStringByteLength = (str: string): number => {
  const encoder = new TextEncoder()
  const encodedStr = encoder.encode(str) // 将字符串编码为 Uint8Array
  return encodedStr.length // 返回字节数
}
