import { type ProfileStore } from '@/types'
import { save, store } from '../init'

export const setSocialMedias = (info: {
  socialMedias: ProfileStore['socialMedias']
}) => {
  save({
    ...store,
    ...info
  })
}
