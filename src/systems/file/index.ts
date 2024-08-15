import { useSetup } from './init'
import { getImageConfig, processImage, updateImageConfig } from './service'

useSetup()

export const useImageSystem = () => {
  return {
    getImageConfig,
    updateImageConfig,
    processImage
  }
}
