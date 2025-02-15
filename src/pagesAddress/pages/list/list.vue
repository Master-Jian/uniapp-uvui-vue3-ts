<template>
  <view class="addressList">
    <template v-if="list && list.length">
      <uv-list>
        <uv-list-item v-for="item in list" :key="item.id">
          <view>
            <view class="item" @tap="handleItemClick(item)">
              <view class="up">
                <text class="txt">收货人: {{ item.receiverName }}</text>
                <text class="txt">{{ item.receiverPhone }}</text>
              </view>
              <text class="con">{{
                `${item.province} ${item.city} ${item.district} ${item.detailAddress}`
              }}</text>
              <view class="down">
                <view class="flex" style="flex: 1" @tap.stop="handleIfDefault(item)">
                  <image v-if="item.ifDefault" class="icon" :src="selectIcon" />
                  <image v-else class="icon" :src="unSelectIcon" />
                  <uv-text
                    :color="item.ifDefault ? '#4E85F6' : '#666'"
                    size="26rpx"
                    text="默认地址"
                  />
                </view>

                <view
                  class="flex"
                  style="margin-right: 30rpx"
                  @tap.stop="toPage(`/pagesAddress/pages/item/index?id=${item.id}`)"
                >
                  <image class="icon" :src="editIcon" />
                  <uv-text color="#666" size="26rpx" text="编辑" />
                </view>

                <view class="flex" @tap.stop="handleDel(item)">
                  <image class="icon" :src="delIcon" />
                  <uv-text color="#666" size="26rpx" text="删除"></uv-text>
                </view>
              </view>
            </view>
            <uv-gap height="16rpx" bgColor="#f3f3f3" />
          </view>
        </uv-list-item>
        <uv-list-item><uv-gap height="176rpx" bgColor="#f3f3f3" /></uv-list-item>
      </uv-list>

      <view class="footer">
        <view class="group">
          <view class="submitBg" @tap="handlePayAddress">
            <text class="txt">导入支付宝地址</text>
          </view>
          <view class="submitBorder" @tap="toPage('/pagesAddress/pages/item/index')">
            <text class="txt">新增收货地址</text>
          </view>
        </view>
        <uv-gap height="68rpx"></uv-gap>
      </view>
    </template>

    <template v-else>
      <view class="empty">
        <uv-empty width="440rpx" height="440rpx" text=" " :icon="emptyAddressIcon" />

        <view>
          <!-- #ifdef MP-ALIPAY -->
          <view class="b1" @tap="handlePayAddress">
            <text class="txt">导入支付宝地址</text>
          </view>
          <!-- #endif -->
          <view class="b2" @tap="toPage('/pagesAddress/pages/item/index')">
            <text class="txt">添加收货地址</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
  import {
    AddAddressApi,
    delAddressApi,
    getAddressListApi,
    updateDefaultAddressApi,
  } from '@/api/address'
  import { AddressItem } from '@/api/model/address'
  import { useAddressStore } from '@/store/modules/address'
  import { delIcon, editIcon } from '@/utils/icon/address/address'
  import { emptyAddressIcon } from '@/utils/icon/empty/empty'
  import { selectIcon, unSelectIcon } from '@/utils/icon/login/login'
  import { onLoad, onShow } from '@dcloudio/uni-app'
  import { ref } from 'vue'
  
  const props = defineProps<{
    pre?: number // 是否是预下单
  }>()

  const list = ref<AddressItem[]>([])

  function init() {
    uni.showLoading({ title: '加载中' })
    getAddressListApi().then((res) => {
      list.value = res
      uni.hideLoading()
      if(!res || !res.length){
        useAddressStore().setAddressItem(null)
      }
    })
  }

  async function handleIfDefault(item: AddressItem) {
    try {
      uni.showLoading({ title: '设置中', mask: true })
      await updateDefaultAddressApi({ ...item, ifDefault: 1 })
      uni.showToast({ title: `默认地址设置成功`, icon: 'none', mask: true })
      init()
    } catch (err) {
      console.log(err)
      uni.showToast({ title: `默认地址设置失败`, icon: 'none', mask: true })
    } finally {
      uni.hideLoading()
    }
  }

  async function handleDel(item: AddressItem) {
    uni.showModal({
      title: '提示',
      content: '是否确认删除该地址',
      showCancel: true,
      success: async ({ confirm }) => {
        if (confirm) {
          try {
            uni.showLoading({ title: '删除中', mask: true })
            await delAddressApi(item)
            uni.showToast({ title: `删除成功`, icon: 'none', mask: true })
            const addressStore = useAddressStore()
            const address = addressStore.getAddressItem
            if(address && address.id == item.id){
              addressStore.setAddressItem(null)
            }
            init()
          } catch (err) {
            console.log(err)
            uni.showToast({ title: `删除失败`, icon: 'none', mask: true })
          } finally {
            uni.hideLoading()
          }
        }
      },
    })
  }

  /**
   * 支付宝地址簿 - 导入
   */
  function handlePayAddress() {
    // #ifdef MP-ALIPAY
    my.getAddress({
      success: async function (res: any) {
        // 6000.用户未做选择直接返回 9000.用户选择了一个地址
        if (res.resultStatus == '9000') {
          const result = res.result
          try {
            uni.showLoading({ title: '导入中', mask: true })
            const address = String(result.address).split('-')
            const values: AddressItem = {
              receiverName: result.fullname,
              receiverPhone: result.mobilePhone,
              province: result.prov || '',
              city: result.city || '',
              district: result.area || '',
              detailAddress: address[address.length - 1],
              ifDefault: 0,
            }
            await AddAddressApi(values)
            uni.showToast({ title: `新增成功`, icon: 'none' })
            init()
          } catch (err) {
            console.log(err)
            uni.showToast({ title: `新增失败`, icon: 'none', mask: true })
          } finally {
            uni.hideLoading()
          }
        }
      },
      fail: function (err: any) {
        console.log(err)
      },
    })
    // #endif
  }

  function handleItemClick(item: AddressItem) {
    if (props.pre == 1) {
      useAddressStore().setAddressItem(item)
      uni.navigateBack()
    } else {
      toPage(`/pagesAddress/pages/item/index?id=${item.id}`)
    }
  }

  function toPage(url: string) {
    uni.navigateTo({ url })
  }

  onLoad(() => {
    // #ifdef MP-ALIPAY
    my.setNavigationBar({
      borderBottomColor: '#f0f0f0',
    })
    // #endif
  })
  onShow(() => {
    init()
  })
</script>

<style lang="scss" scoped>
  @use '@/static/styles/index.scss';
  .addressList {
    height: 100vh;
    background-color: #f3f3f3;
    display: flex;
    flex-direction: column;
    .item {
      background: #ffffff;
      display: flex;
      flex-direction: column;
      padding: 32rpx 32rpx 0;

      .up {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .txt {
          font-size: 32rpx;
          color: #333333;
          line-height: 46rpx;
        }
      }
      .con {
        margin: 16rpx 0 24rpx;
        word-break: break-all;
        font-size: 26rpx;
        color: #999999;
        line-height: 38rpx;
      }

      .flex {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 94rpx;
      }

      .down {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-top: 1px solid #f8f8f8;
        height: 94rpx;
        .icon {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
      }
    }

    .footer {
      .group {
        .submitBg {
          border-radius: 8rpx;
        }
        .submitBorder {
          border-radius: 8rpx;
          .txt {
            color: #333;
          }
        }
      }
    }

    .empty {
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      .b1 {
        width: 412rpx;
        height: 88rpx;
        border-radius: 88rpx;
        background-color: #4e85f6;
        display: flex;
        align-items: center;
        justify-content: center;
        .txt {
          font-size: 36rpx;
          color: #ffffff;
        }
      }
      .b2 {
        margin-top: 48rpx;
        width: 412rpx;
        height: 88rpx;
        border-radius: 88rpx;
        border: 2rpx solid #999999;
        display: flex;
        align-items: center;
        justify-content: center;
        .txt {
          font-size: 36rpx;
          color: #333;
        }
      }
    }
  }
</style>
