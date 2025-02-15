import type { UserInfo } from '@/api/model/user'
import { TOKEN_KEY, USER_INFO_KEY } from '@/enum/cacheEnum'
import { Persistent } from '@/utils/cache'
import { defineStore } from 'pinia'
import { store } from '@/store'
interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  newUser?: number
}
// 定义 Store
export const useUserStore = defineStore('app-user', {
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    newUser: 0, // 新用户 1.是 0.不是
  }),
  getters: {
    getToken(): string {
      return this.token || Persistent.getLocal(TOKEN_KEY)
    },
    getUserInfo(): UserInfo {
      return this.userInfo || Persistent.getLocal(USER_INFO_KEY) || {}
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info || '' // for null or undefined value
      Persistent.setLocal(TOKEN_KEY, info)
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      Persistent.setLocal(USER_INFO_KEY, info)
    },
    loginOut() {
      this.setToken(undefined)
      this.setUserInfo(null)
    },
  },
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
