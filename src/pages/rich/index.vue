<template>
  <view class="rich">
    <uv-parse :content="content"></uv-parse>
  </view>
</template>

<script setup lang="ts">
  import { getAgreementAPI } from '@/api/agreement'
  import { getCustomerServiceArticleDetailApi } from '@/api/customerService'
  import { richParamsToDecodeURIComponent } from '@/utils/tools'
  import { onLoad } from '@dcloudio/uni-app'
  import { ref } from 'vue'

  const props = defineProps<{
    type: string // agreement.协议 custom.客服详情
    params: string // 参数 JSON 格式
  }>()

  const content = ref<string>('')

  async function init() {
    const params = richParamsToDecodeURIComponent(props.params)
    // 协议数据
    if (props.type == 'agreement') {
      const res = await getAgreementAPI(params.type)
      if (res && res.length) {
        content.value = res[0].content
        uni.setNavigationBarTitle({ title: res[0].descs || '' })
      }
    } 
  }

  onLoad(() => {
    init()
  })
</script>

<style lang="scss" scoped>
  .rich {
    padding: 32rpx;
  }
</style>
