<template>
  <scroll-view
    class="scrrollView"
    :scroll-y="true"
    :lower-threshold="200"
    @scrolltolower="loadMore"
  >
    <template v-if="layout === 'horizontal'">
      <view class="horizontal">
        <template v-for="(item, index) in list" :key="index">
          <slot name="item" :item="item" />
        </template>
      </view>
    </template>
    <template v-else>
      <template v-for="(item, index) in list" :key="index">
        <slot name="item" :item="item" />
      </template>
    </template>
    <view class="empty" v-if="!list.length">
      <uv-empty :mode="emptyMode" :text="emptyText" :icon="emptyIcon" />
    </view>
    <uv-load-more v-if="list.length && loadStatus == 'nomore'" :status="loadStatus" />
    <view style="height: 40rpx"></view>
  </scroll-view>
</template>

<script lang="ts">
  //  此组件是以vben框架有感而做的,如果看了demo不熟悉，可以看看vben的table封装,玩法一样
  import { emptyDataIcon } from '@/utils/icon/empty/empty'
  import { cloneDeep } from '@/utils/tools'
  import { isFunction } from '@/utils/tools/is'
  import { defineComponent, onMounted, ref, watch } from 'vue'

  export default defineComponent({
    name: 'PageList',
    props: {
      api: {
        type: Function,
        default: null,
      },
      params: {
        type: Object,
        default: () => ({}),
      },
      limit: {
        type: Number,
        default: 20,
      },
      afterFetch: {
        type: Function,
        default: null,
      },
      resultField: {
        type: String,
        default: 'list',
      },
      layout: {
        type: String,
        default: 'vertical', // horizontal or vertical
      },
      // 空提示文总
      emptyMode: {
        type: String,
        default: 'data',
      },
      // 空提示文总
      emptyText: {
        type: String,
        default: ' ',
      },
      // 空数据图标
      emptyIcon: {
        type: String,
        default: emptyDataIcon,
      },
    },
    setup(props) {
      const list = ref<any>([])
      const loadStatus = ref('loadmore') // 可以加载更多

      const params = ref<any>({
        cursor: 1,
        pageIndex: 1, // 后端的坑 两个参数某个可以
        limit: props.limit,
        pageSize: props.limit,
        ...props.params,
      })

      function refresh() {
        params.value.cursor = 1
        params.value.pageIndex = params.value.cursor
        loadStatus.value = 'loadmore'
        list.value = []
        fetch()
      }

      function loadMore() {
        if (loadStatus.value == 'nomore') return
        params.value.cursor = params.value.cursor + 1
        params.value.pageIndex = params.value.cursor
        fetch()
      }

      onMounted(() => {
        refresh()
      })

      watch(
        () => props.params,
        () => {
          params.value = {
            ...params.value,
            ...props.params,
          }
          refresh()
        },
        { deep: true },
      )

      async function fetch() {
        const { api, resultField, afterFetch } = props
        if (!api || !isFunction(api)) return
        try {
          uni.showLoading({
            title: '加载中',
          })
          let res = await api(params.value)
          const data = cloneDeep(res)
          uni.hideLoading()
          if (resultField) {
            res = res[resultField]
          }
          if (afterFetch && isFunction(afterFetch)) {
            res = (await afterFetch(res)) || res
          }

          if (params.value.cursor == 1) {
            list.value = res
          } else {
            list.value = [...list.value, ...res]
          }
          if (list.value.length >= data.total) {
            loadStatus.value = 'nomore'
          }
        } catch (error) {
          console.log(error)
        } finally {
          uni.hideLoading()
        }
      }
      return { loadStatus, refresh, loadMore, list }
    },
  })
</script>

<style lang="scss" scoped>
  .scrrollView {
    display: flex;
    flex-direction: column;
    height: 100%;

    .horizontal {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .empty{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-text {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20rpx 0 env(safe-area-inset-bottom);

      .txt {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
</style>
