import { defineStore } from 'pinia'
import { store } from '@/store'

type paramsType = {
  id: string
}

interface AppState {
  statusBarHeight: number
  menuButton: Nullable<UniNamespace.GetMenuButtonBoundingClientRectRes>
  environment?: string
  alipayParams?: paramsType
}
// 定义 Store
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    statusBarHeight: 0,
    menuButton: null,
    environment: undefined,
  }),
  getters: {
    /**
     * 获取 状态栏高度
     */
    getStatusBarHeight(): number {
      return this.statusBarHeight || uni.getSystemInfoSync().statusBarHeight || 0
    },
    /**
     * 获取 胶囊宽高以及位置 - 默认标题高度
     */
    getMenuButton(): UniNamespace.GetMenuButtonBoundingClientRectRes {
      return this.menuButton || uni.getMenuButtonBoundingClientRect()
    }, 
    /**
     * 获取 支付宝扫码解析后的参数
     */
    getAliapyParmas(): paramsType {
      return this.alipayParams || { id: '' }
    },
  },
  actions: {
    setStatusBarHeight(info: number | undefined) {
      this.statusBarHeight = info || 0
    },
    setMenuButton(info: UniNamespace.GetMenuButtonBoundingClientRectRes) {
      this.menuButton = info
    },
    setAlipayParmas(info: paramsType) {
      this.alipayParams = info || undefined
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
