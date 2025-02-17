import { useAppStore } from "@/store/modules/app"

/**
 * 深拷贝
 */
export function cloneDeep(data: any) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 处理富文本参数
 */
export function richParamsToEncodeURIComponent(params: any) {
  return encodeURIComponent(JSON.stringify(params))
}
/**
 * 解析富文本参数
 */
export function richParamsToDecodeURIComponent(params: any) {
  return JSON.parse(decodeURIComponent(params))
}

/**
 * 分转元
 */
export function fenToYuan(num: number) {
  return Number((Number(num) / 100).toFixed(2))
}

/**
 * 元转分
 */
export function yuanToFen(num: number) {
  return Number((Number(num) * 100).toFixed(0))
}

/**
 * 处理身份证地址转换
 */
export function handleIdCardAddress(address: any) {
  const regex =
    /(.*?自治区|.*?省|.*?行政区|.*?市|.*?新疆)(.*?自治州|.*?地区|.*?行政单位|.*?盟|市辖区|.*?市|.*?县)(.*?县|.*?区|.*?市|.*?旗|.*?海域|.*?岛)?(.*)/
  const result = address.match(regex)
  // const province = result[1]
  // const city = result[2]
  // const county = result[3]
  // const village = result[4]
  return result
}

/**
 * https://uniapp.dcloud.net.cn/api/file/file.html#opendocument
 * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
 */
export const openDoc = (url: any) => {
  uni.showLoading({
    title: '正在加载文档',
    mask: true,
  })
  uni.downloadFile({
    url,
    success: function (res) {
      const filePath = res.tempFilePath
      uni.openDocument({
        filePath: filePath,
        showMenu: true,
        success: function (res) {
          uni.hideLoading()
        },
        fail: function (res) {
          uni.hideLoading()
          uni.showToast({ title: '打开失败', icon: 'none' })
        },
      })
    },
    fail: function () {
      uni.hideLoading()
      uni.showToast({ title: '下载文档失败', icon: 'none' })
    },
  })
}

export function copy(message: string) {
  uni.setClipboardData({
    data: message,
    success: function () {
      uni.showToast({ title: '复制成功', icon: 'none' })
    },
  })
}

/**
 * 处理支付宝小程序 - 外接进小程序参数接收处理
 * 例如扫码进入小程序
 */
export function handleRouteQueryAlipay(options: any) {
  try {
    if (options?.path && options?.path.indexOf('goods/goods') != -1) {
      const appStore = useAppStore()
      const query = String(options?.query?.qrCode || '')
      if (query) {
        // 支付宝传参里有个type,最好不要冲突
        const arg = ['id']
        const params = query.split('?')
        if (params && params.length && params[1]) {
          const arr = params[1].split('&').filter((v: any) => arg.some((o) => v.indexOf(o) != -1))
          const obj: any = {}
          arr.forEach((v: any) => {
            const value = v.split('=')
            obj[value[0]] = value[1]
          })
          appStore.setAlipayParmas(obj)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 处理微信小程序 - 外接进小程序参数接收处理
 * 例如扫码进入小程序
 */
export function handleRouteQueryWeiXin(props: any) {
  try {
    const q = props?.q
    if (!q) {
      return props
    }
    const query = decodeURIComponent(props.q)
    const str = query.split('?')[1]
    const params: any = {}
    if (str) {
      const strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        const item: any = strs[i].split('=')
        params[item[0]] = item[1]
      }
      return params
    }
    return params
  } catch (error) {
    return props
  }
}

/**
 * 处理扫码 - 二维码参数接收处理
 */
export function handleRouteQuery(props: any) {
  try {
    // 支付宝
    const alipayParams = useAppStore().getAliapyParmas
    if (alipayParams && alipayParams?.id) {
      return alipayParams
    }
    // 微信
    return handleRouteQueryWeiXin(props)
  } catch (error) {
    return props
  }
}
