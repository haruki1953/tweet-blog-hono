import { type ProfileUpdateExternalLinksJsonType, type ProfileUpdateSocialMediasJsonType } from '@/schemas'
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

export const profileDeleteAvatarByUuidService = (
  uuid: string
) => {
  const delAvatar = profileSystem.delAvatar(uuid)
  return {
    delAvatar,
    store: profileSystem.store
  }
}

export const profileDeleteAvatarNotUsedService = () => {
  const delAvatarList = profileSystem.delNotUsedAvatars()
  return {
    delAvatarList,
    store: profileSystem.store
  }
}

export const profileUpdateAvatarService = (
  uuid: string
) => {
  profileSystem.setAvatar(uuid)
  return {
    store: profileSystem.store
  }
}

export const profileAddExternalIconService = async (
  imageFile: File
) => {
  const newExternalIcon = await profileSystem.addExternalIcon(imageFile)
  return {
    newExternalIcon,
    store: profileSystem.store
  }
}

export const profileDeleteExternalIconByUuidService = (
  uuid: string
) => {
  const delExternalIcon = profileSystem.delExternalIcon(uuid)
  return {
    delExternalIcon,
    store: profileSystem.store
  }
}

export const profileDeleteExternalIconNotUsedService = () => {
  const delExternalIconList = profileSystem.delNotUsedExternalIcon()
  return {
    delExternalIconList,
    store: profileSystem.store
  }
}

export const profileUpdateExternalLinksService = (
  externalLinks: ProfileUpdateExternalLinksJsonType['externalLinks']
) => {
  profileSystem.setExternalLinks(externalLinks)
  return {
    store: profileSystem.store
  }
}
