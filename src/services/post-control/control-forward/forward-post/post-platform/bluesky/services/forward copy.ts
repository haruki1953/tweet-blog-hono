import { type platformKeyMap } from '@/configs'
import { getFileMimeType } from './dependencies'
import type { DataForForwardPostPlatform, ReturnForForwardPost } from './dependencies'
import { AppError } from '@/classes'
import { useFetchSystem } from '@/systems'
import path from 'path'
import { urlJoinUtil } from '@/utils'
import { readFile } from 'fs/promises'
import Jimp from 'jimp'

type DataForForwardPostBluesky = DataForForwardPostPlatform<typeof platformKeyMap.Bluesky.key>

const fetchSystem = useFetchSystem()

// 测试
export const forwardPostBlueskyService = async (
  data: DataForForwardPostBluesky
): Promise<ReturnForForwardPost> => {
  const {
    targetForwardSetting,
    targetPostData,
    targetImageList
  } = data

  const pdsHost = targetForwardSetting.data['PDS Host']
  const webHost = targetForwardSetting.data['Web Host']
  const identifier = targetForwardSetting.data.Identifier
  const password = targetForwardSetting.data.Password
  const text = targetPostData.content

  // 身份验证
  console.log('xrpc/com.atproto.server.createSession')
  const resCreateSession = await fetchSystem.fetchProxy(
    urlJoinUtil(pdsHost, 'xrpc/com.atproto.server.createSession'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier,
        password
      })
    }
  )
  const jsonCreateSession = await resCreateSession.json()
  console.log(jsonCreateSession)

  // // 刷新令牌
  // console.log('xrpc/com.atproto.server.refreshSession')
  // const resRefreshSession = await fetchSystem.fetchProxy(
  //   urlJoinUtil(pdsHost, 'xrpc/com.atproto.server.refreshSession'),
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${refreshJwt}`
  //     }
  //   }
  // )
  // const jsonRefreshSession = await resRefreshSession.json()
  // console.log(jsonRefreshSession)

  // 上传图片
  const resUploadBlobInfoList = await Promise.all(targetImageList.map(async (i) => {
    // 读取本地图片文件
    const imageFile = await readFile(i.localLargeImagePath)

    console.log('xrpc/com.atproto.repo.uploadBlob')
    const resUploadBlob = await fetchSystem.fetchProxy(
      urlJoinUtil(pdsHost, 'xrpc/com.atproto.repo.uploadBlob'),
      {
        method: 'POST',
        headers: {
          'Content-Type': getFileMimeType(i.localLargeImagePath),
          Authorization: `Bearer ${jsonCreateSession.accessJwt}`
        },
        body: imageFile
      }
    )
    const jsonUploadBlob = await resUploadBlob.json()
    console.log(jsonUploadBlob)
    // console.log(resUploadBlob)

    const aspectRatio = await (async () => {
      const image = await Jimp.read(i.localLargeImagePath).catch(() => null)
      if (image == null) {
        return undefined
      }
      return { width: image.bitmap.width, height: image.bitmap.height }
    })()
    return {
      ...i,
      aspectRatio,
      jsonUploadBlob
    }
  }))

  // 发送帖子
  console.log('xrpc/com.atproto.repo.createRecord')
  const resCreateRecord = await fetchSystem.fetchProxy(
    urlJoinUtil(pdsHost, 'xrpc/com.atproto.repo.createRecord'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jsonCreateSession.accessJwt}`
      },
      body: JSON.stringify({
        repo: jsonCreateSession.did,
        collection: 'app.bsky.feed.post',
        record: {
          $type: 'app.bsky.feed.post',
          text,
          createdAt: new Date().toISOString(),
          embed: {
            $type: 'app.bsky.embed.images',
            images: resUploadBlobInfoList.map(i => {
              return {
                alt: i.alt ?? undefined,
                image: i.jsonUploadBlob.blob,
                aspectRatio: i.aspectRatio
              }
            })
          }
        }
      })
    }
  )
  const jsonCreateRecord = await resCreateRecord.json()
  console.log(jsonCreateRecord)

  // ...
  throw new AppError('测试')
}
