import { type PostControlForwardSettingSetJsonType } from '@/schemas/post-control'
import { useForwardSystem } from '@/systems/forward'

const forwardSystem = useForwardSystem()

export const postControlForwardGetService = () => {
  const forwardStore = forwardSystem.forwardStore()
  return {
    forwardStore
  }
}

export const postControlForwardSettingSetService = (json: PostControlForwardSettingSetJsonType) => {
  const { forwardSettingList } = json
  forwardSystem.forwardSettingSet(forwardSettingList)
  return postControlForwardGetService()
}
