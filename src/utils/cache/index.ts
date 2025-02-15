/**
 * 持久化数据
 */
export class Persistent {
  static getLocal(key: string) {
    return uni.getStorageSync(key)
  }

  static setLocal(key: string, value: any): void {
    return uni.setStorageSync(key, value)
  }

  static removeLocal(key: string): void {
    return uni.removeStorageSync(key)
  }


  static clearLocal(): void {
    uni.clearStorageSync()
  }
}
