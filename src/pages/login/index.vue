<template>
  <view class="login">
    <uv-popup ref="popup" mode="bottom" :closeOnClickOverlay="false" :round="16">
      <view class="box">
        <image @tap="handleBack" class="closeImg" :src="closeIcon" />

        <image class="logo" style="background-color: gray;" src="" />
        <text class="title">name</text>

        <view class="form" v-if="method == 'codeLogin'">
          <uv-input
            border="none"
            fontSize="16px"
            v-model="mobile"
            maxlength="11"
            placeholder="请输入您的手机号码"
            :customStyle="{
              backgroundColor: '#F5F6FA',
              borderRadius: '88rpx',
              width: '654rpx',
            }"
          >
            <template v-slot:prefix>
              <image class="icon" :src="phoneIcon" />
            </template>
          </uv-input>
          <uv-input
            border="none"
            fontSize="16px"
            type="number"
            v-model="code"
            maxlength="6"
            placeholder="请输入验证码"
            :customStyle="{
              marginTop: '40rpx',
              backgroundColor: '#F5F6FA',
              borderRadius: '88rpx',
              width: '654rpx',
            }"
          >
            <template v-slot:prefix>
              <image class="icon" :src="codeIcon" />
            </template>
            <template v-slot:suffix>
              <uv-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取" />
              <view class="uCodeButton">
                <text
                  class="txt"
                  :style="{ color: ['获取验证码', '重新获取'].includes(tips) ? '#4e85f6' : '#999' }"
                  @tap="handleCodeChange"
                >
                  {{ tips }}
                </text>
              </view>
            </template>
          </uv-input>
        </view>

        <button v-if="!agree || method == 'codeLogin'" class="submit" @tap="handleSubmit">
          <text class="txt" v-if="method == 'oneLogin'">手机号一键登录</text>
          <text class="txt" v-else-if="method == 'codeLogin'">登录</text>
        </button>
        <!-- #ifdef MP-WEIXIN -->
        <button
          v-else-if="agree && method == 'oneLogin'"
          class="submit"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <text class="txt">手机号一键登录</text>
        </button>
        <!-- #endif -->

        <!-- #ifdef MP-ALIPAY -->
        <button
          v-else-if="agree && method == 'oneLogin'"
          class="submit"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <text class="txt">手机号一键登录</text>
        </button>
        <!-- #endif -->

        <view class="agree" @tap="handleAgree">
          <image v-if="agree" class="icon" :src="selectIcon" />
          <image v-else class="icon" :src="unSelectIcon" />
          <text class="txt">已阅读并同意</text>
          <text class="txt atxt" @tap.stop="toAgreement(11)">《注册协议》</text>
          <text class="txt">和</text>
          <text class="txt atxt" @tap.stop="toAgreement(10)">《隐私协议》</text>
        </view>
        <view class="currentTxt" v-if="method == 'oneLogin'" @tap="handleCurrent('codeLogin')">
          <text class="txt">验证码登录</text>
        </view>
        <view class="currentTxt" v-if="method == 'codeLogin'" @tap="handleCurrent('oneLogin')">
          <text class="txt">手机号一键登录</text>
        </view>
      </view>
    </uv-popup>

    <uv-modal ref="uModal" @confirm="getCode">
      <div class="uModal">
        <image class="imgCode" :src="codeImg" mode="widthFix"></image>
        <input class="input" v-model="captchaCode" type="text" placeholder="请输入验证码" />
      </div>
    </uv-modal>
  </view>
</template>

<script setup lang="ts">
  import {
    getAlipayCodeApi,
    getLoginCodeApi,
    getLoginCodeCheckApi,
    getWeiXinCodeApi,
    setLoginCodeApi,
    setLoginOhterCode,
  } from '@/api/login'
  import { getUserInfoApi } from '@/api/user'
  import { useOrderStore } from '@/store/modules/order'
  import { useUserStore } from '@/store/modules/user'
  import { closeIcon, codeIcon, phoneIcon, selectIcon, unSelectIcon } from '@/utils/icon/login/login'
  import { richParamsToEncodeURIComponent } from '@/utils/tools'
  import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
  import { onMounted, ref } from 'vue'
  
  const popup = ref<any>()
  const agree = ref<boolean>(false)
  // oneLogin.一键登录  codeLogin.验证码登录
  const method = ref<string>('oneLogin')

  const uCode = ref<any>()
  const uModal = ref<any>()
  const tips = ref<string>('')
  const codeImg = ref<string>('') // 展示图像验证
  const captchaCode = ref<string>('') // 图像验证码
  const captchaUuid = ref<string>('') // 图像验证码 唯一id 发送验证码用到

  const mobile = ref<string>('')
  const code = ref<string>('')

  const timeOunt = ref<any>()

  function handleCurrent(index: string) {
    method.value = index
  }

  function handleAgree() {
    agree.value = !agree.value
  }

  function toAgreement(type: number) {
    const params = richParamsToEncodeURIComponent({ type })
    uni.navigateTo({ url: `/pages/rich/index?type=agreement&params=${params}` })
  }

  /**
   * 更换校验的验证码
   */
  const handleCodeChange = async () => {
    if (!mobile.value) {
      uni.showToast({
        title: '请输入手机号码',
        icon: 'none',
      })
      return
    }
    codeImg.value = ''
    captchaUuid.value = ''
    captchaCode.value = ''
    uni.showLoading({ title: '加载中' })
    const res: any = await getLoginCodeCheckApi()
    uni.hideLoading()
    codeImg.value = `data:image/png;base64,${res.imageBase64}`
    captchaUuid.value = res.uuid
    uModal.value.open()
  }

  /**
   * 倒计时文字
   * @param text
   */
  function codeChange(text: string) {
    tips.value = text
  }

  /**
   * 获取 手机-验证码
   */
  async function getCode() {
    if (!['获取验证码', '重新获取'].includes(tips.value)) return
    if (!uni.$uv.test.mobile(mobile.value)) {
      uni.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      })
      return
    }
    uni.showLoading({
      title: '正在获取验证码',
    })
    try {
      await getLoginCodeApi({
        loginName: mobile.value,
        captchaUuid: captchaUuid.value,
        captchaCode: captchaCode.value,
      })
      uCode.value.start()
    } catch (error) {
      uni.showToast({
        title: '获取验证码失败',
        icon: 'none',
      })
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 登录 - 手机验证码
   */
  function handleSubmit() {
    if (!agree.value) {
      uni.showToast({
        title: '请先阅读并同意《注册协议》和《隐私协议》',
        icon: 'none',
      })
      return
    }
    if (method.value == 'codeLogin') {
      if (!uni.$uv.test.mobile(mobile.value)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
        })
        return
      }
      if (!uni.$uv.test.code(code.value)) {
        uni.showToast({
          title: '请输入短信验证码',
          icon: 'none',
        })
        return
      }
      setLoginCodeApi({ loginName: mobile.value, code: code.value }).then((res) => {
        const userStore = useUserStore()
        userStore.setToken(res.token)
        userStore.setNewUser(res.newUser)
        uni.showToast({ title: '登录成功', icon: 'none' })
        // 获取当前页面栈
        let pages = getCurrentPages()
        // 获取上一级页面
        let prevPage = pages[pages.length - 2]
        // 如果有上级页面则返回，否则跳转 首页
        timeOunt.value = setTimeout(() => {
          if (prevPage) {
            useOrderStore().setRefresh(true)
            uni.navigateBack()
          } else {
            uni.switchTab({ url: '/pages/index/index' })
          }
        }, 1000)
      })
    }
  }

  /**
   * 登录 - 一键登录
   */
  function getPhoneNumber(e: any) {
    // #ifdef MP-WEIXIN
    getWeiXinCodeApi({ code: e.detail.code }).then((res) => {
      if (res?.phoneNumber) {
        mobile.value = res.phoneNumber
        handleOtherLogin()
      }
    })
    // #endif
    // #ifdef MP-ALIPAY
    my.getPhoneNumber({
      success: async (res: any) => {
        console.log(res)
        if (uni.$uv.test.jsonString(res.response)) {
          const data = JSON.parse(res.response)
          getAlipayCodeApi({ response: data.response }).then((result) => {
            if (result.code == '10000') {
              mobile.value = result.mobile
              handleOtherLogin()
            } else {
              uni.showToast({ title: '登录失败', icon: 'none' })
            }
          })
        }
      },
      fail: (res: any) => {
        console.log(res)
        uni.showToast({ title: '登录失败', icon: 'none' })
      },
    })
    // #endif
  }

  /**
   * 登录 - 一键登录 - 统一处理
   */
  async function handleOtherLogin() {
    setLoginOhterCode({ loginName: mobile.value }).then((res) => {
      const userStore = useUserStore()
      userStore.setToken(res.token)
      userStore.setNewUser(res.newUser)
      uni.showToast({ title: '登录成功', icon: 'none' })

      getUserInfoApi().then((res) => {
        userStore.setUserInfo(res)
      })

      // 获取当前页面栈
      let pages = getCurrentPages()
      // 获取上一级页面
      let prevPage = pages[pages.length - 2]
      // 如果有上级页面则返回，否则跳转 首页
      timeOunt.value = setTimeout(() => {
        if (prevPage) {
          useOrderStore().setRefresh(true)
          uni.navigateBack()
        } else {
          uni.switchTab({ url: '/pages/index/index' })
        }
      }, 1000)
    })
  }

  function handleBack() {
    if (popup.value) {
      popup.value.close()
    }
    uni.navigateBack()
  }

  onLoad(() => {
    // #ifdef MP-ALIPAY
    my.hideBackHome()
    my.setNavigationBar({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    // #endif
  })

  onShow(() => {
    useUserStore().loginOut()
  })

  onMounted(() => {
    if (popup.value) {
      popup.value?.open()
    }
  })

  onUnload(() => {
    clearTimeout(timeOunt.value)
  })
</script>

<style lang="scss" scoped>
  .login {
    .box {
      padding: 160rpx 0 64rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-items: center;
      position: relative;

      .closeImg {
        position: absolute;
        z-index: 10;
        top: 16rpx;
        right: 16rpx;
        width: 48rpx;
        height: 48rpx;
      }

      .logo {
        width: 162rpx;
        height: 162rpx;
        border-radius: 8rpx;
      }
      .title {
        margin-top: 16rpx;
        font-weight: 500;
        font-size: 36rpx;
        color: #333333;
        line-height: 52rpx;
      }

      .form {
        margin-top: 92rpx;
        .icon {
          margin-left: 24rpx;
          width: 40rpx;
          height: 40rpx;
        }

        .uCodeButton {
          margin-right: 24rpx;
          .txt {
            font-weight: 400;
            font-size: 32rpx;
          }
        }
      }

      .submit {
        margin-top: 90rpx;
        width: 654rpx;
        height: 88rpx;
        background: #4e85f6;
        border-radius: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .txt {
          font-weight: 500;
          font-size: 36rpx;
          color: #ffffff;
        }
      }

      .agree {
        margin-top: 32rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        .icon {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }

        .txt {
          font-size: 26rpx;
          color: #999999;
        }

        .atxt {
          color: #4e85f6;
        }
      }

      .currentTxt {
        margin-top: 120rpx;
        .txt {
          font-size: 32rpx;
          color: #4e85f6;
        }
      }
    }

    .uModal {
      width: 500rpx;
      background-color: #fff;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40rpx 40rpx 0;

      .imgCode {
        width: 460rpx;
        height: 60rpx;
      }

      .input {
        margin: 30rpx 0;
        width: 460rpx;
        height: 80rpx;
        font-size: 28rpx;
        border-bottom: 1px solid #ddd;
        padding: 0 !important;
        text-align: center;
      }
    }
  }

  ::v-deep .uv-input__content__field-wrapper__field {
    background-color: transparent !important;
    height: 44px !important;
  }
</style>
