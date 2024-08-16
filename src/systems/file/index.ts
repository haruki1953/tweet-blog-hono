import { useSetup } from './init'
import { deleteImage, getImageConfig, processImage, updateImageConfig } from './service'

useSetup()

export const useImageSystem = () => {
  return {
    getImageConfig,
    updateImageConfig,
    processImage,
    deleteImage
  }
}
