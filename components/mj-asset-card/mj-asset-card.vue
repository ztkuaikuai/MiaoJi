<template>
	<view class="asset-card">
		<!-- 这里需要循环 -->
		<view class="content">
			<!-- 滑动单元格 -->
			<u-swipe-action>
				<u-swipe-action-item :options="options" v-for="item in 3" :threshold="80" @click="clickBtn" >
					<view class="swipe-action-item">
						<view class="left">
							<u-avatar icon="zhifubao" fontSize="24"></u-avatar>
							<view class="info">
								<view>交通银行</view>
							</view>
						</view>
						<view class="right">
							<view class="money"><u--text mode="price" text="250.02" color="#dd524d" size="32rpx"
									bold></u--text></view>
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
		name: "mj-asset-card",
		data() {
			return {
				options: [{
					text: "编辑",
					style: {
						backgroundColor: '#959595',
						padding: '0 40rpx'
					}
				}, {
					text: "删除",
					style: {
						backgroundColor: '#e94459',
						padding: '0 40rpx'
					}
				}]
			};
		},
		methods: {
			clickBtn({index}) { // 0 点击了编辑  1 点击了删除
				if(index == 0) {
					uni.navigateTo({
						// 需要传递的参数  type  资产金额 是否隐藏 是否计入总资产 用户名？ 
						url:"/pagesAccount/set-asset/set-asset?type=wx"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.asset-card {
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