import { baseURL } from '@/config'
import { useUserStore } from '@/store/modules/user'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL() + options.url
    }
    // 2. 请求超时, 默认 60s
    options.timeout = 60000
    // 3. 添加小程序端请求头标识
    options.header = { ...options.header }
    // 4. 添加 token 请求头标识
    const token = useUserStore().getToken
    if (token) {
      options.header.Authorization = token
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

export const defHttp = <T>(requestOptions: UniApp.RequestOptions, options: any = {}) => {
  // 用于页面代码可能需要直接获取code，data，message这些信息时开启
  const { isTransformResponse } = options
  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...requestOptions,
      // 响应成功
      success(res: any) {
        if (isTransformResponse) {
          resolve(res.data as T)
          return
        }
        if (res.data?.code != 200) {
          if (canMessage(res)) {
            reject(res.data as T)
          }
          return
        }
        resolve(res.data.data as T)
      },
      // 响应失败
      fail(res: any) {
        uni.hideLoading()
        if (canMessage(res)) {
          reject(res.data as T)
        }
      },
      complete(res: any) {
        // 前往 登录
        if ([401].includes(res.statusCode) || [401].includes(res.data?.code)) {
          // 避免多次调用
          setTimeout(() => {
            uni.$uv.throttle(() => {
              const userStore = useUserStore()
              userStore.loginOut()
              uni.showModal({
                title: '登录失效',
                content: '是否前往登录',
                success: ({ confirm }) => {
                  if (confirm) {
                    uni.navigateTo({ url: '/pages/login/index' })
                  }
                },
              })
            }, 1000)
          }, 1000)
        }
      },
    })
  })
}

/**
 * 判断提示
 */
function canMessage(res: any) {
  const msg = res.data?.message
  // 这样可以去自己定义一个toast组件显示，因为文字太长导致文本显示缺失
  // if (msg.length < 16) {
  //   uni.showToast({ icon: 'none', title: msg || '网络错误，换个网络试试' })
  //   return false
  // }
  uni.showToast({ icon: 'none', title: msg || '网络错误，换个网络试试' })
  return true
}
