import { platformKeyMap } from '@/configs'
import type { DataForForwardPostPlatform, ReturnForForwardPost } from './dependencies'
import { TwitterApi } from 'twitter-api-v2'
import { useFetchSystem } from '@/systems'
import { useLogUtil } from '@/utils'

const fetchSystem = useFetchSystem()
const logUtil = useLogUtil()

type DataForForwardPostXtwitter = DataForForwardPostPlatform<typeof platformKeyMap.X.key>

// 推特接口好像没办法得到像前端中解析到的那样的图片真实链接
// platformImageLink 就先暂且设置为推文的链接吧

// 拼接推特链接
export const joinWebUrlXtwitter = (data: {
  username: string
  tweetId: string
}) => {
  const { username, tweetId } = data
  // https://x.com/sakikoO_O/status/1842172907080061009
  return `https://x.com/${username}/status/${tweetId}`
}

export const forwardPostXtwitterService = async (
  data: DataForForwardPostXtwitter
): Promise<ReturnForForwardPost> => {
  const {
    targetForwardSetting,
    targetPostData,
    targetImageList
  } = data

  // 新建 twitterClient
  const twitterClient = new TwitterApi({
    appKey: targetForwardSetting.data['API Key'],
    appSecret: targetForwardSetting.data['API Key Secret'],
    accessToken: targetForwardSetting.data['Access Token'],
    accessSecret: targetForwardSetting.data['Access Token Secret']
  }, {
    // 使用代理
    httpAgent: fetchSystem.getAgent()
  }).readWrite

  // 首先发图片，发送多张图片
  const uploadMediaResList = await Promise.all(
    targetImageList.map(async (targetImageData) => {
      const uploadMediaRes = await twitterClient.v1.uploadMedia(targetImageData.localLargeImagePath)
      const mediaId = uploadMediaRes
      if (targetImageData.alt !== null) {
        // 设置alt
        await twitterClient.v1.createMediaMetadata(mediaId, {
          alt_text: { text: targetImageData.alt }
        })
      }
      return {
        imageId: targetImageData.id,
        media_id: uploadMediaRes
      }
    })
  )
  const mediaIdList = uploadMediaResList.map((i) => i.media_id)

  // 处理将传入推文发送的媒体信息
  const mediaForTweet = (() => {
    if (mediaIdList.length === 0) {
      return undefined
    }
    return {
      media_ids: mediaIdList.slice(0, 4) as [string, string, string, string]
    }
  })()
  // 处理将传入推文发送的回复信息
  const replyForTweet = (() => {
    if (targetPostData.parentPostSamePlatformPostId == null) {
      return undefined
    }
    return {
      in_reply_to_tweet_id: targetPostData.parentPostSamePlatformPostId
    }
  })()

  // 发送推文
  const postTweetRes = await twitterClient.v2.tweet({
    text: targetPostData.content,
    media: mediaForTweet,
    reply: replyForTweet
  })
  const tweetId = postTweetRes.data.id

  // 尝试获取用户名
  const currentUserV2Res = await twitterClient.currentUserV2().catch((error) => {
    logUtil.info({
      title: `${platformKeyMap.X.name} 用户名获取失败`,
      content:
          `推文 id: ${targetPostData.id}\n` +
          `转发配置 uuid: ${targetForwardSetting.uuid}\n` +
          String(error)
    })
    return null
  })
  const username = currentUserV2Res?.data.username ?? '_'

  // 将得到的数据处理为指定格式
  const platformPostLink = joinWebUrlXtwitter({ username, tweetId })
  const resPostInfo = {
    postId: targetPostData.id,
    platformPostId: tweetId,
    platformPostLink
  }
  const resImageList = uploadMediaResList.map((i) => {
    return {
      imageId: i.imageId,
      platformImageId: i.media_id,
      // 推特接口好像没办法得到像前端中解析到的那样的图片真实链接
      // platformImageLink 就先暂且设置为推文的链接吧
      platformImageLink: platformPostLink
    }
  })
  return {
    resPostInfo,
    resImageList
  }
}
