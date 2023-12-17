<template>
	<view
		class="u-keyboard"
		@touchmove.stop.prevent="noop"
	>
		<view
			class="u-keyboard__button-wrapper"
			v-for="(item, index) in numList"
			:key="index"
		>
			<view
				v-if="index != 3"
				class="u-keyboard__button-wrapper__button"
				:style="[itemStyle(index)]"
				@tap="keyboardClick(item)"
				hover-class="u-hover-class"
				:hover-stay-time="100"
			>
				<text class="u-keyboard__button-wrapper__button__text">{{ item }}</text>
			</view>
			
			<view
				v-else
				class="u-keyboard__button-wrapper__button u-keyboard__button-wrapper__button--gray"
				hover-class="u-hover-class"
				:hover-stay-time="100"
				@touchstart.stop="backspaceClick"
				@touchend="clearTimer"
			>
				<u-icon
					name="backspace"
					color="#303133"
					size="28"
				></u-icon>
			</view>
			
		</view>
		<!-- 取消的盒子 -->
		<!-- <view
			class="u-keyboard__button-wrapper"
		>
			<view
				class="u-keyboard__button-wrapper__button u-keyboard__button-wrapper__button--gray"
				hover-class="u-hover-class"
				:hover-stay-time="200"
				@touchstart.stop="backspaceClick"
				@touchend="clearTimer"
			>
				<u-icon
					name="backspace"
					color="#303133"
					size="28"
				></u-icon>
			</view>
		</view> -->
	</view>
</template>

<script>
	import props from './props.js';

	/**
	 * keyboard 键盘组件
	 * @description
	 * @tutorial
	 * @property {String}	mode		键盘的类型，number-数字键盘，card-身份证键盘
	 * @property {Boolean}	dotDisabled	是否显示键盘的"."符号
	 * @property {Boolean}	random		是否打乱键盘按键的顺序
	 * @event {Function} change		点击键盘触发
	 * @event {Function} backspace	点击退格键触发
	 * @example
	 */
	export default {
		mixins: [uni.$u.mpMixin, uni.$u.mixin, props],
		data() {
			return {
				backspace: 'backspace', // 退格键内容
				dot: '.', // 点
				timer: null, // 长按多次删除的事件监听
				cardX: 'X' ,// 身份证的X符号
			};
		},
		computed: {
			// 键盘需要显示的内容
			numList() {
				let tmp = [];
				if (this.dotDisabled && this.mode == 'number') {
					if (!this.random) {
						return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
					} else {
						return uni.$u.randomArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
					}
				} else if (!this.dotDisabled && this.mode == 'number') {
					if (!this.random) {
						return [1, 2, 3, this.backspace, 4, 5, 6, this.secondOne, 7, 8, 9, this.secondTwo, '再记', 0, this.dot, '保存'];
					} else {
						return uni.$u.randomArray([1, 2, 3, 4, 5, 6, 7, 8, 9, this.dot, 0]);
					}
				} else if (this.mode == 'card') {
					if (!this.random) {
						return [1, 2, 3, 4, 5, 6, 7, 8, 9, this.cardX, 0];
					} else {
						return uni.$u.randomArray([1, 2, 3, 4, 5, 6, 7, 8, 9, this.cardX, 0]);
					}
				}
			},
			// 按键的样式，在非乱序&&数字键盘&&不显示点按钮时，index为9时，按键占位两个空间
			itemStyle() {
				return index => {
					let style = {};
					if (this.mode == 'number' && this.dotDisabled && index == 9) style.width = '464rpx';
					return style;
				};
			},
			// 是否让按键显示灰色，只在非乱序&&数字键盘&&且允许点按键的时候
			btnBgGray() {
				return index => {
					if (!this.random && index == 9 && (this.mode != 'number' || (this.mode == 'number' && !this
							.dotDisabled))) return true;
					else return false;
				};
			},
		},
		created() {

		},
		methods: {
			// 点击退格键
			backspaceClick() {
				this.$emit('backspace');
				clearInterval(this.timer); //再次清空定时器，防止重复注册定时器
				this.timer = null;
				this.timer = setInterval(() => {
					this.$emit('backspace');
				}, 250);
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			// 获取键盘显示的内容
			keyboardClick(val) {
				// 允许键盘显示点模式和触发非点按键时，将内容转为数字类型
				// if (!this.dotDisabled && val != this.dot && val != this.cardX) val = Number(val);
				this.$emit('change', val);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	$u-number-keyboard-background-color:#9fcba7 !default;
	$u-number-keyboard-padding:0 !default;
	$u-number-keyboard-button-width:187.5rpx !default;
	$u-number-keyboard-button-margin:0 !default;
	$u-number-keyboard-button-height: 90rpx!default;
	$u-number-keyboard-button-background-color:#9fcba7 !default;
	$u-number-keyboard-button-box-shadow: none !default;
	$u-number-keyboard-text-font-size:36rpx !default;
	$u-number-keyboard-text-font-weight:500 !default;
	$u-number-keyboard-text-color:$u-main-color !default;
	$u-number-keyboard-gray-background-color:#9fcba7 !default;
	$u-number-keyboard-u-hover-class-background-color: rgba(255,255,255,0.5) !default;

	.u-keyboard {
		@include flex;
		flex-direction: row;
		justify-content: space-around;
		background-color: $u-number-keyboard-background-color;
		flex-wrap: wrap;
		padding: $u-number-keyboard-padding;
		border-radius: 40rpx 40rpx 0 0 ;
		overflow: hidden;

		&__button-wrapper {
			box-shadow: $u-number-keyboard-button-box-shadow;
			margin: $u-number-keyboard-button-margin;
			border-radius: 4px;
			
			&__button {
				width: $u-number-keyboard-button-width;
				height: $u-number-keyboard-button-height;
				background-color: $u-number-keyboard-button-background-color;
				@include flex;
				justify-content: center;
				align-items: center;
				border-radius: 4px;
				padding: 8rpx 0;
				
				&__text {
					font-size: $u-number-keyboard-text-font-size;
					font-weight: $u-number-keyboard-text-font-weight;
					color: rgba(0,0,0, 0.6);
				}

				&--gray {
					background-color: $u-number-keyboard-gray-background-color;
				}
			}
		}
	}

	.u-hover-class {
		background-color: $u-number-keyboard-u-hover-class-background-color;
	}
</style>
