<script setup lang="ts">
  import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
  import { useAppStore } from './store/modules/app'
  import { handleRouteQueryAlipay } from './utils/tools'

  onLaunch((options) => {
    console.log('App Launch')
    const appStore = useAppStore()
    appStore.setStatusBarHeight(uni.getSystemInfoSync().statusBarHeight)
    appStore.setMenuButton(uni.getMenuButtonBoundingClientRect())

    // #ifdef MP-ALIPAY
    handleRouteQueryAlipay(options)
    // #endif
  })
  onShow(() => {
    console.log('App Show')
  })
  onHide(() => {
    console.log('App Hide')
  })
</script>
<style lang="scss">
  @use '@/uni_modules/uv-ui-tools/index.scss' as *;
  @use '@/static/styles/flex.scss' as *;

  .pageList {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
</style>
