<template>
	<view class="mj-icon" :style="{'background-color': bgcColor, 'height': iconWrapperSize, 'width': iconWrapperSize}">
		<view :style="{'transform': translateY}">
			<uni-icons :type="type" :size="size" :color="color" :customPrefix="customPrefix"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mj-icon-with-background",
		props: {
			type: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#333333'
			},
			size: {
				type: [Number, String],
				default: '32rpx'
			},
			customPrefix:{
				type: String,
				default: ''
			},
			bgcColor: {
				type: String,
				default: '#f0f0f0'
			},
			iconWrapperSize: {
				type: String,
				default: '80rpx'
			},
			// 图标Y轴偏移距离
			translateY: {
				type: String,
				default: 'translateY(0rpx)'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.mj-icon {
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>