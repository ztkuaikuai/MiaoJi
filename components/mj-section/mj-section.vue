<template>
	<view class="section" :style="[customStyle]">
		<view class="left">
			<mj-icon-with-background v-if="showIcon" :type="iconType" :translateY="translateY" size="48rpx" customPrefix="miaoji" color="#a3a3a3" iconWrapperSize="64rpx" />
			<view class="info">
				<view>{{title}}</view>
				<view class="minor"><u--text :lines="1" :text="subTitle" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view>
			</view>
		</view>
		<view>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mj-section",
		props: {
			customStyle: {
				type: Object,
				default: {}
			},
			title: {
				type: String,
				default: ''
			},
			subTitle: {
				type: String,
				default: ''
			},
			iconType: {
				type: String,
				default: 'mj-flower'
			},
			showIcon: {
				type: Boolean,
				default: true
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
.section {
	display: flex;
	justify-content: space-between;
	color: $mj-text-color;
	
	font-size: 32rpx;
	padding: 8px 0;
	
	.left {
		display: flex;
		justify-content: right;
		align-items: center;
	
		.info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 24rpx;
		}
	}
	.minor {
		color: $mj-text-color-grey;
		font-size: 24rpx;
	}
}
</style>