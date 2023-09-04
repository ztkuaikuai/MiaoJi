<template>
	<view class="bill-card">
		<view class="header">
			<text>8月29日 今天</text>
			<text>支出:40.00 收:40.00</text>
		</view>
		<!-- 这里需要循环 -->
		<view class="content" >
			<!-- 滑动单元格 -->
			<u-swipe-action>
				<u-swipe-action-item :options="options"  v-for="item in 3" :threshold="80">
					<view class="swipe-action-item" >
						<view class="left">
							<mj-icon-with-background type="heart" size="48rpx"></mj-icon-with-background>
							<view class="info">
								<view>餐饮</view>
								<view class="minor">备注信备备注信备备注信备</view> <!-- 设置超过一行就... 可以使用u-text组件 -->
							</view>
						</view>
						<view class="right">
							<view class="money"><u--text mode="price" text="250.02" color="#dd524d" size="32rpx" bold></u--text></view>
							<view class="minor">微信钱包</view>
						</view>
					</view>
					<view class="line" v-if="item != 2">
						<u-line length="80%"></u-line>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
	export default {
		name: "mj-bill-card",
		data() {
			return {
				options: [{
					text: "删除",
					style: {
						backgroundColor: '#e94459',
						padding: '0 40rpx'
					}
				}]
			};
		}
	}
</script>

<style lang="scss" scoped>
	.bill-card {
		padding-right: 24rpx;
		margin-bottom: 36rpx;
		.header {
			padding-left: 24rpx;
			display: flex;
			justify-content: space-between;
			color: $mj-text-color-grey;
			font-size: 28rpx;
		}
		.content {
			.swipe-action-item {
				background-color: $mj-bg-color;
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				color: $mj-text-color;
				font-size: 32rpx;
				padding: 8rpx 0;
				.left {
					padding-left: 24rpx;
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
				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-end;
					padding-right: 20rpx;
				}
				.minor {
					color: $mj-text-color-grey;
					font-size: 24rpx;
				}
			}
			.line {
				display: flex;
				justify-content: center;
			}
		
			
		}
	}
</style>