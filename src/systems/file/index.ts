import { useSetup } from './init'
import {
  deleteAllOriginalImage,
  deleteImage,
  deleteOriginalImage,
  getImageConfig,
  processImage,
  updateImageConfig
} from './service'

useSetup()

export const useImageSystem = () => {
  return {
    getImageConfig,
    updateImageConfig,
    processImage,
    deleteImage,
    deleteOriginalImage,
    deleteAllOriginalImage
  }
}
