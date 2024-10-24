import { type ProfileStore } from '@/types'
import { store, save } from '../init'

export const setNameBio = (info: {
  name: ProfileStore['name']
  bio: ProfileStore['bio']
}) => {
  save({
    ...store,
    ...info
  })
}

export const setAboutMarkdown = (info: {
  aboutMarkdown: ProfileStore['aboutMarkdown']
}) => {
  save({
    ...store,
    ...info
  })
}
