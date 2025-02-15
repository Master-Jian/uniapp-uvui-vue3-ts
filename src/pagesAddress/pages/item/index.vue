<template>
  <view class="addressItem">
    <view class="form">
      <view class="form-item">
        <text class="label">姓名</text>
        <uv-input
          class="input"
          v-model="formModel.receiverName"
          placeholderStyle="color: #666"
          placeholder="请输入收货人真实姓名"
          :fontSize="14"
          border="none"
        />
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <uv-input
          v-model="formModel.receiverPhone"
          placeholderStyle="color: #666"
          type="number"
          maxlength="11"
          placeholder="请输入收货人手机号"
          :fontSize="14"
          border="none"
        />
      </view>

      <view class="form-item" @tap="showCityPicker">
        <text class="label">所在街道</text>
        <view class="input" v-if="formModel.address" style="padding-left: 16rpx">
          <uv-text :size="14" :lines="2" :text="formModel.address" />
        </view>
        <view class="input" v-else style="padding-left: 24rpx">
          <uv-text color="#666" :size="14" text="请选择省市区" />
        </view>
        <uv-icon name="arrow-right" size="13px" style="flex-shrink: 0" />
      </view>

      <view class="form-item">
        <text class="label">详细地址</text>
        <uv-input
          v-model="formModel.detailAddress"
          placeholderStyle="color: #666"
          :maxlength="-1"
          placeholder="请输入小区、楼栋、门牌号等等"
          :fontSize="14"
          border="none"
        />
        <!-- <view class="form-item">
          <text class="label">详细地址</text>
        </view>
        <uv-textarea
          v-model="formModel.detailAddress"
          :maxlength="-1"
          placeholderStyle="color: #666"
          placeholder="请输入小区、楼栋、门牌号等等"
          fontSize="28rpx"
          border="none"
          :customStyle="{ paddingTop: '15px' }"
        /> -->
      </view>
    </view>

    <view class="ifDefault">
      <text class="label">设置默认地址</text>
      <uv-switch v-model="formModel.ifDefault" />
    </view>

    <view class="footer">
      <view class="submit" @tap="submit">
        <text class="txt">保存地址</text>
      </view>
      <uv-gap height="68rpx"></uv-gap>
    </view>

    <uv-picker
      ref="cityPicker"
      :columns="addressList"
      keyName="name"
      @change="handleCityChange"
      @confirm="handleCityConfirm"
    />
  </view>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { regions } from '../../status/regions'
  import { AddAddressApi, getAddressItemApi, updateAddressApi } from '@/api/address'
  import { AddressItem } from '@/api/model/address'
  import { onReady, onUnload } from '@dcloudio/uni-app'
import { handleErrorToast } from '@/utils/tools'

  const props = defineProps<{
    id: string
  }>()

  const timeOunt = ref<any>()

  const cityPicker = ref<any>()

  // 选择城市的组件数据
  const province = ref<any>(JSON.parse(regions)) // 省
  const city = ref<any>([]) // 市
  const district = ref<any>([]) // 区

  const pickerValue = ref<any>([0, 0, 0]) // 默认picker 所选位置Index
  const defaultValue = ref<any>(['北京', '北京市', '东城区']) // 默认值 根据id

  const formModel = ref<any>({
    receiverName: '', // 姓名
    receiverPhone: '', // 手机号
    address: '', // 展示省市区
    detailAddress: '', // 详细地址
    ifDefault: false,
  })

  const addressList = computed(() => {
    const address: string[] = []
    if (province.value) {
      address.push(province.value)
      if (city.value) {
        address.push(city.value)
        if (district.value) {
          address.push(district.value)
        }
      }
    }
    return address
  })

  function init() {
    if (props.id) {
      uni.showLoading({ title: '加载中' })
      getAddressItemApi(props.id).then((res) => {
        formModel.value.receiverName = res?.receiverName || ''
        formModel.value.receiverPhone = res?.receiverPhone || ''
        formModel.value.detailAddress = res?.detailAddress || ''
        formModel.value.ifDefault = !!res?.ifDefault

        const defaultData: string[] = []
        if (res.province) {
          defaultData.push(res.province)
          if (res.city) {
            defaultData.push(res.city)
            if (res.district) {
              defaultData.push(res.district)
            }
          }
        }
        defaultValue.value = defaultData
        formModel.value.address = defaultData.join('')
        uni.hideLoading()
        handlePickValueDefault()
      })
    } else {
      handlePickValueDefault()
    }
  }

  function handleCityChange(e: any) {
    const { columnIndex, index, indexs } = e
    // 改变了省
    if (columnIndex === 0) {
      city.value = province.value[index]?.children || []
      district.value = city.value[0]?.children || []
      cityPicker.value.setIndexs([index, 0, 0], true)
    } else if (columnIndex === 1) {
      district.value = city.value[index]?.children || []
      cityPicker.value.setIndexs(indexs, true)
    }
  }

  function handlePickValueDefault() {
    // 设置省
    pickerValue.value[0] = province.value.findIndex(
      (item: any) => String(item.id) === defaultValue.value[0],
    )
    // 设置市
    city.value = province.value[pickerValue.value[0]]?.children || []
    pickerValue.value[1] = city.value.findIndex(
      (item: any) => String(item.id) === defaultValue.value[1],
    )
    // 设置区
    district.value = city.value[pickerValue.value[1]]?.children || []
    pickerValue.value[2] = district.value.findIndex(
      (item: any) => String(item.id) === defaultValue.value[2],
    )
    // 重置下位置
    cityPicker.value.setIndexs(
      [pickerValue.value[0], pickerValue.value[1], pickerValue.value[2]],
      true,
    )
  }

  function showCityPicker() {
    if (cityPicker.value) {
      cityPicker.value.open()
      handlePickValueDefault()
    }
  }

  function handleCityConfirm(e: any) {
    const { value, indexs } = e
    pickerValue.value = indexs
    defaultValue.value = value.filter((v: any) => v).map((v: any) => v.name)
    formModel.value.address = defaultValue.value.join('')
  }

  async function submit() {
    try {
      if (uni.$uv.test.empty(formModel.value.receiverName)) {
        throw '请输入姓名'
      }
      if (!uni.$uv.test.mobile(formModel.value.receiverPhone)) {
        throw '请输入正确的手机号码'
      }
      if (uni.$uv.test.empty(formModel.value.address)) {
        throw '请选择所在街道'
      }
      if (uni.$uv.test.empty(formModel.value.detailAddress)) {
        throw '请输入详细地址'
      }

      const values: AddressItem = { ...formModel.value }
      values['ifDefault'] = formModel.value.ifDefault ? 1 : 0
      if (defaultValue.value[0]) {
        values['province'] = defaultValue.value[0] || ''
      }
      if (defaultValue.value[1]) {
        values['city'] = defaultValue.value[1] || ''
      }
      if (defaultValue.value[2]) {
        values['district'] = defaultValue.value[2] || ''
      }
      if (props.id) {
        values['id'] = props.id
        await updateAddressApi(values)
      } else {
        await AddAddressApi(values)
      }
      uni.showToast({ title: `${props.id ? '编辑' : '新增'}成功`, icon: 'none' })
      timeOunt.value = setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } catch (error) {
      console.log(error)
      handleErrorToast(error)
    }
  }

  onReady(() => {
    init()
  })
  onUnload(() => {
    clearTimeout(timeOunt.value)
  })
</script>

<style lang="scss" scoped>
  @use '@/static/styles/index.scss';
  .addressItem {
    background-color: #f3f3f3;
    .form {
      padding: 0 32rpx;
      background-color: #fff;

      .form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        min-height: 104rpx;
        border-bottom: 2rpx solid #f8f8f8;
        .label {
          flex-shrink: 0;
          width: 136rpx;
          font-size: 26rpx;
          color: #999999;
        }
        .input {
          display: flex;
          flex: 1;
        }
      }
      .items-start {
        align-items: flex-start;
      }
    }

    .ifDefault {
      margin-top: 16rpx;
      padding: 0 32rpx;
      height: 120rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;

      .label {
        font-size: 28rpx;
        color: #666666;
      }
    }
  }
</style>
