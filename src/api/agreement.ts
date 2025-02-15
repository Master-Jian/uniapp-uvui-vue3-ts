import { defHttp } from '@/utils/request/http'
import type { AgreementResult } from './model/agreement'

/**
 * 协议
 */
export const getAgreementAPI = (type: string | number) => {
  return defHttp<AgreementResult[]>({
    method: 'GET',
    url: `applet/agreement`,
    data: {
      type,
    },
  })
}
