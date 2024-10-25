import { z } from 'zod'

export const profileUpdateNameBioJsonSchema = z.object({
  name: z.string(),
  bio: z.string()
})
export type ProfileUpdateNameBioJsonType = z.infer<typeof profileUpdateNameBioJsonSchema>

export const profileUpdateAboutMdJsonSchema = z.object({
  aboutMarkdown: z.string()
})
export type ProfileUpdateAboutMdJsonType = z.infer<typeof profileUpdateAboutMdJsonSchema>

export const profileUpdateSocialMediasJsonSchema = z.object({
  socialMedias: z.array(z.object({
    name: z.string(),
    description: z.string(),
    link: z.string(),
    fontawesomeClass: z.string()
  }))
})
export type ProfileUpdateSocialMediasJsonType = z.infer<typeof profileUpdateSocialMediasJsonSchema>
