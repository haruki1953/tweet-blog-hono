import { type ProfileStore } from '@/types'
import { save, store } from '../init'

export const addExternalIcon = () => {}
export const delExternalIcon = () => {}
export const delNotUsedExternalIcon = () => {}

export const setExternalLinks = (info: {
  externalLinks: ProfileStore['externalLinks']
}) => {
  save({
    ...store,
    ...info
  })
}
