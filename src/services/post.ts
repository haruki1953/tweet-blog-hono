import { type PostSendJsonType } from '@/schemas'
import { prisma } from '@/systems'

export const postSendService = async (postInfo: PostSendJsonType) => {
  const post = await prisma.post.create({
    data: {
      content: postInfo.content,
      createdAt: postInfo.createdAt,
      twitterId: postInfo.twitterId,
      twitterLink: postInfo.twitterLink
    }
  })
  return post
}
