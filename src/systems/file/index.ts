import './init'
import {
  deleteAllOriginalImage,
  deleteImage,
  deleteOriginalImage,
  getImageConfig,
  processImage,
  updateImageConfig
} from './services'

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
