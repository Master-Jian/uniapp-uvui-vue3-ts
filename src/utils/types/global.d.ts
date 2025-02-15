declare type Nullable<T> = T | null

declare type NonNullable<T> = T extends null | undefined ? never : T

declare module '@climblee/uv-ui' // 处理报错

/**
 * dev: 测试环境
 * pro: 正式环境环境
 */
declare type Env = 'dev' | 'pro'

declare function requirePlugin(pluginName: string): any // 处理有时候确实要这样调用插件提示报错,如支付宝

declare var wx: any; // 处理微信wx.的报错
declare var my: any; // 处理支付宝my.的报错
