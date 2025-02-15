import { defineStore } from 'pinia'
import { store } from '@/store'

interface AppState {
  statusBarHeight: number
  menuButton: Nullable<UniNamespace.GetMenuButtonBoundingClientRectRes>
  environment?: string
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
  },
  actions: {
    setStatusBarHeight(info: number | undefined) {
      this.statusBarHeight = info || 0
    },
    setMenuButton(info: UniNamespace.GetMenuButtonBoundingClientRectRes) {
      this.menuButton = info
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
