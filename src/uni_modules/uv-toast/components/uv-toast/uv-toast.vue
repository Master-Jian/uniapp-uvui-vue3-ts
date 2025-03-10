<template>
	<view class="uv-toast">
		<uv-overlay :show="isShow && tmpConfig.overlay" :custom-style="overlayStyle"></uv-overlay>
		<uv-transition :show="isShow" mode="fade" :custom-style="aniStyle">
			<view
				class="uv-toast__content"
				ref="uvToastContent"
				:style="[contentStyle]"
				:class="['uv-type-' + tmpConfig.type, (tmpConfig.type === 'loading' || tmpConfig.loading) ?  'uv-toast__content--loading' : '']"
			>
				<uv-loading-icon
					v-if="tmpConfig.type === 'loading'"
					mode="circle"
					color="rgb(255, 255, 255)"
					inactiveColor="rgb(120, 120, 120)"
					size="25"
				></uv-loading-icon>
				<uv-icon
					v-else-if="tmpConfig.type !== 'defalut' && iconName"
					:name="iconName"
					size="17"
					:color="tmpConfig.type"
					:customStyle="iconStyle"
				></uv-icon>
				<uv-gap
					v-if="tmpConfig.type === 'loading' || tmpConfig.loading"
					height="12"
					bgColor="transparent"
				></uv-gap>
				<text
					class="uv-toast__content__text"
					:class="['uv-toast__content__text--' + tmpConfig.type]"
					style="max-width: 400rpx;"
				>{{ tmpConfig.message }}</text>
			</view>
		</uv-transition>
	</view>
</template>
<script>
	import { hexToRgb } from '@/uni_modules/uv-ui-tools/libs/function/colorGradient.js'
	import mpMixin from '@/uni_modules/uv-ui-tools/libs/mixin/mpMixin.js'
	import mixin from '@/uni_modules/uv-ui-tools/libs/mixin/mixin.js'
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom')
	// #endif
	/**
	 * toast 消息提示
	 * @description 此组件表现形式类似uni的uni.showToastAPI，但也有不同的地方。
	 * @tutorial https://www.uvui.cn/components/toast.html
	 * @property {Boolean}	loading		是否加载中 （默认 false ）
	 * @property {String | Number}	zIndex	toast展示时的zIndex值 (默认 10090 )
	 * @property {String | Number}	message		显示的文字内容
	 * @property {String} icon 图标，或者绝对路径的图片
	 * @property {String} type 主题类型 （默认 default）
	 * @property {Boolean} overlay 是否显示透明遮罩，防止点击穿透 （默认 false ）
	 * @property {String} position 位置 （默认 'center' ）
	 * @property {Object} params 跳转的参数 
	 * @property {String | Number}  duration	展示时间，单位ms （默认 2000 ）
	 * @property {Function} complete 执行完后的回调函数 
	 * 
	 * @event {Function} show 显示toast，如需一进入页面就显示toast，请在onReady生命周期调用
	 * @example <uv-toast ref="uvToastRef" />
	 */
	export default {
		name: 'uv-toast',
		mixins: [mpMixin, mixin],
		data() {
			return {
				isShow: false,
				timer: null, // 定时器
				config: {
					message: '', // 显示文本
					type: '', // 主题类型，primary，success，error，warning，black
					duration: 2000, // 显示的时间，毫秒
					icon: true, // 显示的图标
					position: 'center', // toast出现的位置
					complete: null, // 执行完后的回调函数
					overlay: true, // 是否防止触摸穿透
					loading: false ,// 是否加载中状态
					zIndex: 10090 //弹出的层级
				},
				tmpConfig: {}, // 将用户配置和内置配置合并后的临时配置变量
				rect: {},
				opacity: 0
			}
		},
		computed: {
			iconName() {
				// 只有不为none，并且type为error|warning|succes|info时候，才显示图标
				if (!this.tmpConfig.icon || this.tmpConfig.icon == 'none') {
					return '';
				}
				if (['error', 'warning', 'success', 'primary'].includes(this.tmpConfig.type)) {
					return this.$uv.type2icon(this.tmpConfig.type)
				} else {
					return ''
				}
			},
			overlayStyle() {
				const style = {
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					zIndex: this.tmpConfig.zIndex
				}
				// 将遮罩设置为100%透明度，避免出现灰色背景
				style.backgroundColor = 'rgba(0, 0, 0, 0)'
				return style
			},
			iconStyle() {
				const style = {}
				// 图标需要一个右边距，以跟右边的文字有隔开的距离
				style.marginRight = '4px'
				// #ifdef APP-NVUE
				// iOSAPP下，图标有1px的向下偏移，这里进行修正
				if (this.$uv.os() === 'ios') {
					style.marginTop = '-1px'
				}
				// #endif
				return style
			},
			aniStyle() {
				const style = {
					position: 'fixed',
					zIndex: this.tmpConfig.zIndex
				}
				return style
			},
			// 内容盒子的样式
			contentStyle() {
				const { windowWidth, windowHeight } = this.$uv.sys();
				const style = {
					position: 'fixed',
					top: '50%',
					left: '50%',
					// #ifdef APP-NVUE
					opacity: this.opacity
					// #endif
				};
				let value = 0
				// #ifndef APP-NVUE
				// 根据top和bottom，对Y轴进行窗体高度的百分比偏移
				if (this.tmpConfig.position === 'top') {
					style.top = '25%'
				} else if (this.tmpConfig.position === 'bottom') {
					style.top = '75%'
				} else {
					value = '-50%'
				}
				style.transform = `translate(-50%,${value})`
				// #endif
				// #ifdef APP-NVUE
				const { width = 0, height = 0 } = this.rect ? this.rect : {};
				if (width && height) {
					style.left = `${windowWidth*0.5 - width/2}px`
					if (this.tmpConfig.position === 'top') {
						style.top = `${windowHeight*0.5- height/2 - windowHeight*0.25}px`
					} else if (this.tmpConfig.position === 'bottom') {
						style.top = `${windowHeight*0.5- height/2 + windowHeight*0.25}px`
					} else {
						style.top = `${windowHeight*0.5- height/2}px`
					}
				}
				// #endif
				return style
			}
		},
		created() {
			// 通过主题的形式调用toast，批量生成方法函数
			['primary', 'success', 'error', 'warning', 'default', 'loading'].map(item => {
				this[item] = message => this.show({
					type: item,
					message
				})
			})
		},
		methods: {
			// 显示toast组件，由父组件通过this.$refs.xxx.show(options)形式调用
			show(options) {
				// 不将结果合并到this.config变量，避免多次调用uv-toast，前后的配置造成混乱
				this.tmpConfig = this.$uv.deepMerge(this.config, options)
				// 清除定时器
				this.clearTimer()
				this.isShow = true
				//#ifdef APP-NVUE
				this.$nextTick(() => {
					this.$uv.sleep(100).then(async res => {
						this.rect = await this.queryRect();
						this.$nextTick(() => {
							this.opacity = 1;
						})
					})
				})
				// #endif
				this.timer = setTimeout(() => {
					// 倒计时结束，清除定时器，隐藏toast组件
					this.clearTimer()
					// 判断是否存在callback方法，如果存在就执行
					typeof(this.tmpConfig.complete) === 'function' && this.tmpConfig.complete()
				}, this.tmpConfig.duration)
			},
			// 查询内容高度
			queryRect() {
				return new Promise(resolve => {
					const ref = this.$refs['uvToastContent'];
					dom.getComponentRect(ref, res => {
						resolve(res.size)
					})
				})
			},
			// 隐藏toast组件，由父组件通过this.$refs.xxx.hide()形式调用
			hide() {
				this.clearTimer()
			},
			clearTimer() {
				// #ifdef APP-NVUE
				this.opacity = 0;
				// #endif
				this.isShow = false
				// 清除定时器
				clearTimeout(this.timer)
				this.timer = null
			}
		},
		// #ifdef VUE2
		beforeDestroy() {
			this.clearTimer()
		},
		// #endif
		// #ifdef VUE3
		unmounted() {
			this.clearTimer()
		}
		// #endif
	}
</script>
<style lang="scss" scoped>
	@use '@/uni_modules/uv-ui-tools/libs/css/components.scss' as *;
	@use '@/uni_modules/uv-ui-tools/theme.scss' as *;
	$uv-toast-color: #fff !default;
	$uv-toast-border-radius: 4px !default;
	$uv-toast-border-background-color: #585858 !default;
	$uv-toast-border-font-size: 14px !default;
	$uv-toast-border-padding: 12px 20px !default;
	$uv-toast-loading-border-padding: 20px 20px !default;
	$uv-toast-content-text-color: #fff !default;
	$uv-toast-content-text-font-size: 15px !default;
	$uv-toast-uv-icon: 10rpx !default;
	$uv-toast-uv-type-primary-color: $uv-primary !default;
	$uv-toast-uv-type-primary-background-color: #ecf5ff !default;
	$uv-toast-uv-type-primary-border-color: rgb(215, 234, 254) !default;
	$uv-toast-uv-type-primary-border-width: 1px !default;
	$uv-toast-uv-type-success-color: $uv-success !default;
	$uv-toast-uv-type-success-background-color: #dbf1e1 !default;
	$uv-toast-uv-type-success-border-color: #BEF5C8 !default;
	$uv-toast-uv-type-success-border-width: 1px !default;
	$uv-toast-uv-type-error-color: $uv-error !default;
	$uv-toast-uv-type-error-background-color: #fef0f0 !default;
	$uv-toast-uv-type-error-border-color: #fde2e2 !default;
	$uv-toast-uv-type-error-border-width: 1px !default;
	$uv-toast-uv-type-warning-color: $uv-warning !default;
	$uv-toast-uv-type-warning-background-color: #fdf6ec !default;
	$uv-toast-uv-type-warning-border-color: #faecd8 !default;
	$uv-toast-uv-type-warning-border-width: 1px !default;
	$uv-toast-uv-type-default-color: #fff !default;
	$uv-toast-uv-type-default-background-color: #585858 !default;
	.uv-toast {
		&__content {
			@include flex;
			padding: $uv-toast-border-padding;
			border-radius: $uv-toast-border-radius;
			background-color: $uv-toast-border-background-color;
			color: $uv-toast-color;
			align-items: center;
			/* #ifndef APP-NVUE */
			max-width: 600rpx;
			/* #endif */
			position: relative;
			&--loading {
				flex-direction: column;
				padding: $uv-toast-loading-border-padding;
			}
			&__text {
				color: $uv-toast-content-text-color;
				font-size: $uv-toast-content-text-font-size;
				line-height: $uv-toast-content-text-font-size;
				&--default {
					color: $uv-toast-content-text-color;
				}
				&--error {
					color: $uv-error;
				}
				&--primary {
					color: $uv-primary;
				}
				&--success {
					color: $uv-success;
				}
				&--warning {
					color: $uv-warning;
				}
			}
		}
	}
	.uv-type-primary {
		color: $uv-toast-uv-type-primary-color;
		background-color: $uv-toast-uv-type-primary-background-color;
		border-color: $uv-toast-uv-type-primary-border-color;
		border-width: $uv-toast-uv-type-primary-border-width;
	}
	.uv-type-success {
		color: $uv-toast-uv-type-success-color;
		background-color: $uv-toast-uv-type-success-background-color;
		border-color: $uv-toast-uv-type-success-border-color;
		border-width: 1px;
	}
	.uv-type-error {
		color: $uv-toast-uv-type-error-color;
		background-color: $uv-toast-uv-type-error-background-color;
		border-color: $uv-toast-uv-type-error-border-color;
		border-width: $uv-toast-uv-type-error-border-width;
	}
	.uv-type-warning {
		color: $uv-toast-uv-type-warning-color;
		background-color: $uv-toast-uv-type-warning-background-color;
		border-color: $uv-toast-uv-type-warning-border-color;
		border-width: 1px;
	}
	.uv-type-default {
		color: $uv-toast-uv-type-default-color;
		background-color: $uv-toast-uv-type-default-background-color;
	}
</style>