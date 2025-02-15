<template>
  <view class="my">
    <view class="pageList">
      <PageList
        style="height: 100%"
        layout="horizontal"
        :params="params"
        :api="getSpuListApi"
        resultField="list"
      >
        <template #item="{ item }">
          <view style="margin-right: 20rpx">
            <view class="item">{{ item }}</view>
          </view>
        </template>
      </PageList>
    </view>
  </view>
</template>

<script setup lang="ts">
  const params = {}
  function getSpuListApi() {
    return new Promise<T>((resolve, reject) => {
        return resolve({
            list: []
        })
    })
  }
</script>

<style lang="scss" scoped>
  .my {
  }
</style>
