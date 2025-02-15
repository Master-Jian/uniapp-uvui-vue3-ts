import { defHttp } from '@/utils/request/http'
import type { UserInfo } from './model/user'

/**
 * 用户 - 获取用户信息
 */
export const getUserInfoApi = () => {
  return defHttp<UserInfo>({
    method: 'GET',
    url: ``,
  })
}