import { type PostControlForwardSettingSetJsonType } from '@/schemas'
import { useForwardSystem } from '@/systems'

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
