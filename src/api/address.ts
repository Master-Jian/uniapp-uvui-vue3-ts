import { defHttp } from '@/utils/request/http'
import type { AddressItem } from './model/address'

enum Api {
  GetAddressList = '/applet/address/list',
  GetAddressDefault = '/applet/address/default',
  SetAddress = '/applet/address',
}

/**
 * 地址 - 列表
 */
export const getAddressListApi = (data = {} as AddressItem) => {
  return defHttp<AddressItem[]>({
    method: 'GET',
    url: Api.GetAddressList,
    data,
  })
}

/**
 * 地址 - 根据id获取地址
 */
export const getAddressItemApi = (id: string) => {
  return defHttp<AddressItem>({
    method: 'GET',
    url: `${Api.SetAddress}/${id}`,
  })
}

/**
 * 地址 - 获取默认地址
 */
export const getDefaultAddressApi = () => {
  return defHttp<AddressItem>({
    method: 'GET',
    url: Api.GetAddressDefault,
  })
}

/**
 * 地址 - 新增
 */
export const AddAddressApi = (data: AddressItem) => {
  return defHttp<any>({
    method: 'POST',
    url: Api.SetAddress,
    data,
  })
}

/**
 * 地址 - 修改
 */
export const updateAddressApi = (data: AddressItem) => {
  return defHttp<any>({
    method: 'PUT',
    url: `${Api.SetAddress}/${data.id}`,
    data,
  })
}

/**
 * 地址 - 修改默认地址
 */
export const updateDefaultAddressApi = (data: AddressItem) => {
  return defHttp<any>({
    method: 'PUT',
    url: `${Api.SetAddress}/default`,
    data,
  })
}
/**
 * 地址 - 删除
 */
export const delAddressApi = (data: AddressItem) => {
  return defHttp<any>({
    method: 'DELETE',
    url: `${Api.SetAddress}/${data.id}`,
    data,
  })
}
