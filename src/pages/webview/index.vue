<template>
  <view>
    <web-view :src="url" @message="handleGetMessage"></web-view>
  </view>
</template>

<script lang="ts" setup>
  const props = defineProps<{
  }>()


  const handleGetMessage = (message: any) => {
    console.log(message);
  }
