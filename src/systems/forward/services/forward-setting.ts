import { type ForwardSettingItem, type ForwardSettingItemForSet } from '@/types'
import { store, save } from './dependencies'
import { AppError } from '@/classes'
import { cloneDeep } from 'lodash'

export const forwardSettingFind = (uuid: string) => {
  return store.forwardSettingList.find(i => i.uuid === uuid)
}

export const forwardSettingGet = () => {
  return store.forwardSettingList
}

// 设置转发配置，item.data可为undefined，即不更改
export const forwardSettingSet = (forwardSettingList: ForwardSettingItemForSet[]) => {
  const newForwardSettingList = []
  for (const item of forwardSettingList) {
    let newItem
    const find = forwardSettingFind(item.uuid)
    if (find != null) {
      // 更新
      if (find.platform !== item.platform) {
        throw new AppError('更新转发配置时平台不能变更', 400)
      }
      newItem = cloneDeep(find)
      newItem.name = item.name
      if (item.data != null) {
        newItem.data = item.data
      }
    } else {
      // 添加
      const isItemDataNotNull = ((item: ForwardSettingItemForSet): item is ForwardSettingItem => {
        return item.data != null
      })(item)
      if (!isItemDataNotNull) {
        throw new AppError('添加转发配置时令牌数据不能为空', 400)
      }
      newItem = item
    }
    newForwardSettingList.push(newItem)
  }
  save({
    ...store,
    forwardSettingList: newForwardSettingList
  })
}
