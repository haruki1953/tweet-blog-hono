import { type ProfileStore } from '@/types'
import { save, store } from '../init'

export const addAvatar = () => {}
export const delAvatar = () => {}
export const delNotUsedAvatar = () => {}

export const setAvatar = (info: {
  avatar: ProfileStore['avatar']
}) => {
  save({
    ...store,
    ...info
  })
}
