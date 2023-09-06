<template>
	<view class="mj-icon" :style="{'background-color': bgcColor}">
		<uni-icons :type="type" :size="size" :color="color" :customPrefix="customPrefix" ></uni-icons>
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
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	
}
</style>