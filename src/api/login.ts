import { defHttp } from '@/utils/request/http'
import type {
  AlipayParams,
  AlipayResult,
  LoginCodeCheckResult,
  LoginCodeParams,
  LoginResult,
  OtherParams,
  WeChatParams,
  WeChatResult,
} from './model/login'

/**
 * 登录 - 获取验证码校验
 */
export const getLoginCodeCheckApi = () => {
  return defHttp<LoginCodeCheckResult>({
    method: 'GET',
    url: `/applet/sendSm/captcha`,
  })
}
/**
 * 登录 - 获取验证码
 */
export const getLoginCodeApi = (data: LoginCodeParams) => {
  return defHttp<LoginResult>({
    method: 'GET',
    url: `/applet/sendSm/${data.loginName}`,
    data,
  })
}

/**
 * 登录 - 验证码登录
 */
export const setLoginCodeApi = (data: LoginCodeParams) => {
  return defHttp<LoginResult>({
    method: 'POST',
    url: '/applet/loginSms',
    data,
  })
}

/**
 * 登录 - 获取微信登录code
 */
export const getWeChatCodeApi = (data: WeChatParams) => {
  return defHttp<WeChatResult>({
    method: 'GET',
    url: '/applet/codeWeChat',
    data,
  })
}

/**
 * 登录 - 获取支付宝登录code
 */
export const getAlipayCodeApi = (data: AlipayParams) => {
  return defHttp<AlipayResult>({
    method: 'POST',
    url: '/applet/codeAlipay',
    data,
  })
}

/**
 * 登录 - 微信/支付宝登录，用code去登录
 */
export const setLoginOhterCode = (data: OtherParams) => {
  return defHttp<LoginResult>({
    method: 'POST',
    url: `/applet/loginCode`,
    data,
  })
}
