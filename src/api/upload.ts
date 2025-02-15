import { baseURL } from '@/config'
import { useUserStore } from '@/store/modules/user'

/**
 * ocr上传 - 身份证识别
 */
export const uploadOcrApi = (data: any) => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        uni.uploadFile({
          url: baseURL() + '/ocr/upload',
          name: 'file',
          filePath: tempFilePath,
          formData: {
            ...data,
          },
          success: async (res: any) => {
            const result = JSON.parse(res.data)?.data
            uni.hideLoading()
            if (result?.code == 1000) {
              resolve({
                ...result.info,
                pic: result.pic,
              })
            } else {
              uni.showToast({ title: '识别失败', con: 'none' })
              reject(new Error('上传失败')) // Promise 失败
            }
          },
        })
      },
    })
  })
}

/**
 * 普通图片上传
 */
export const uploadImageApi = () => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        uni.uploadFile({
          url: baseURL() + '/storage/upload/',
          name: 'file',
          filePath: tempFilePath,
          formData: { },
          success: async (res) => {
            let result = JSON.parse(res.data)
            uni.hideLoading()
            if (result?.code === 200) {
              resolve(result)
            } else {
              uni.showToast({ title: '上传失败', icon: 'none' })
              reject(new Error('上传失败')) // Promise 失败
            }
          },
        })
      },
    })
  })
}
