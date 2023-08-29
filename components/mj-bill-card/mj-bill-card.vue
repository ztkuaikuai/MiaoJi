<template>
	<view class="bill-card">
		<view class="header">
			<text>8月29日 今天</text>
			<text>支出:40.00 收:40.00</text>
		</view>
		<!-- 这里需要循环 -->
		<view class="content" v-for="item in 3">
			<!-- 滑动单元格 -->
			<u-swipe-action>
				<u-swipe-action-item :options="options">
					<view class="swipe-action-item">
						<view class="left">
							<u-avatar icon="red-packet-fill" fontSize="24"></u-avatar>
							<view class="info">
								<view>餐饮</view>
								<!-- 设置超过一行就... -->
								<view class="minor">备注信备备注信备备注信备</view>
							</view>
						</view>
						<view class="right">
							<view class="money">￥11.00</view>
							<view class="minor">微信钱包</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="line" v-if="item != 2">
				<u-line length="80%"></u-line>
			</view>
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
					}
				}]
			};
		}
	}
</script>

<style lang="scss">
	.bill-card {
		margin-bottom: 36rpx;
		.header {
			display: flex;
			justify-content: space-between;
			color: $mj-text-color-grey;
			font-size: 28rpx;
		}
		.content {
			.swipe-action-item {
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				color: $mj-text-color;
				font-size: 32rpx;
				padding: 16rpx 0;
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