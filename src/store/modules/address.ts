import { defineStore } from 'pinia'
import { store } from '@/store'
import type { AddressItem } from '@/api/model/address'

interface AddressState {
  address: Nullable<AddressItem>
}
// 定义 Store
export const useAddressStore = defineStore('address', {
  state: (): AddressState => ({
    address: null,
  }),
  getters: {
    /**
     * 获取 选中的地址
     */
    getAddressItem(): AddressItem {
      return this.address || {}
    },
  },
  actions: {
    setAddressItem(info: AddressItem | null) {
      this.address = info || null
    },
    clearAddressItem() {
      this.setAddressItem(null)
    },
  },
})

export function useAddressStoreWithOut() {
  return useAddressStore(store)
}
