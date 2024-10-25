import { type ProfileUpdateSocialMediasJsonType } from '@/schemas'
import { prisma, useProfileSystem } from '@/systems'

const profileSystem = useProfileSystem()

export const profileGetDataService = async () => {
  const post = await prisma.post.count()
  const image = await prisma.image.count()
  return {
    post,
    image
  }
}

export const profileGetStoreService = async () => {
  return profileSystem.store
}

export const profileUpdateNameBioService = (
  name: string,
  bio: string
) => {
  profileSystem.setNameBio(name, bio)
  return {
    store: profileSystem.store
  }
}

export const profileUpdateAboutMdService = (
  aboutMarkdown: string
) => {
  profileSystem.setAboutMarkdown(aboutMarkdown)
  return {
    store: profileSystem.store
  }
}

export const profileUpdateSocialMediasService = (
  socialMedias: ProfileUpdateSocialMediasJsonType['socialMedias']
) => {
  profileSystem.setSocialMedias(socialMedias)
  return {
    store: profileSystem.store
  }
}

export const profileAddAvatarService = async (
  imageFile: File
) => {
  const newAvatar = await profileSystem.addAvatar(imageFile)
  return {
    newAvatar,
    store: profileSystem.store
  }
}
