export interface LoginCodeParams {
  code?: number | string // 验证码
  loginName: number | string // 登录名
  captchaUuid?: string // uuid
  captchaCode?: string // 图像验证码
}
export interface LoginResult {
  token: string // Token
  uid: number // 账号ID
  newUser: number // 是否是新用户
}
export interface LoginCodeCheckResult {
  imageBase64?: string // 验证码图
  uuid: string // 唯一id
}
export interface AlipayParams {
  response?: number // 支付宝密文
}
export interface AlipayResult {
  code: string
  mobile: string
  msg: string
}
export interface WeChatParams {
  code?: number // 微信code
}
export interface WeChatResult {
  phoneNumber: string // 分类 id
}
export interface OtherParams {
  ipAddr?: string // IP地址
  loginName: string // 登录名
}
