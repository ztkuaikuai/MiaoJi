<template>
	<view class="cron-accounting">
		<view class="linear-gradient"></view>
		<mj-card title="食用说明">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				定时记账可<span style="font-weight: 700;">用于记录定期重复的账单，配置好规则即可自动记账</span>。如每30天买一张月卡花费30元，每天通勤花费8元等等，类似上述情况可设置为定时记账。
			</view>
		</mj-card>
		<!-- 定时任务卡片：遍历展示用户定时任务 -->
		<mj-card title="定时任务名称" v-for="n in 10">
			<template #right>
				<view class="edit">
					修改
				</view>
			</template>
			
			<mj-bill-one-template :oneTemplate="testTemplete"></mj-bill-one-template>
			<view class="cron-info-wrapper">
				<div class="left">
					<div class="next-time">
						预计2024年07月10日执行
					</div>
					<div class="info">
						<span>执行2次结束</span>
						<span>每5天</span>
						<span>已执行1次</span>
					</div>
				</div>
				<div v-if="true" class="right start">
					进行中
				</div>
			</view>
		</mj-card>
		
		<!-- 防挡 -->
		<view style="height: 64px;"></view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="添加" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				testTemplete: {
					assetStyle: {
						color: "#6bcc03",
						icon: "mj-wechat",
						title: "微信钱包",
						type: "weixin"
					},
					asset_id: [{
						asset_name: "生活微信",
						asset_type: "weixin",
						user_id: "64fe8b5abd0220bf8c6552b5",
						_id: "6500776ffe975fba5a9b8cd7"
					}],
					billStyle: {
						icon: "mj-other-income",
						title: "其他收入",
						type: "other-income"
					},
					bill_amount: 40,
					bill_notes: "代肝",
					bill_type: 1,
					category_type: "other-income",
					destinationAssetStyle: {
						title: "资产已删除"
					},
					destination_asset_id: [],
					hasAsset: true,
					hasDestinationAsset: false,
					template_creation_date: 1697943655841,
					user_id: "64fe8b5abd0220bf8c6552b5",
					_id: "6534906799c6248d8023d50d"
				}
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.cron-accounting {
	position: relative;
	.linear-gradient {
		position: absolute;
		top: -24rpx;
		left: 0;
		right: 0;
		height: 130rpx;
		background-image: linear-gradient(#9fcba7, #fafafa);
		z-index: -1;
	}
	
	.cron-info-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16rpx;
		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			color: $mj-text-color-grey;
			font-size: 24rpx;
			.info {
				margin-top: 8rpx;
				span {
					border: 1px solid $mj-text-color-grey;
					margin-right: 8rpx;
					font-size: 20rpx;
				}
			}
		}
		.right {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 4px 8px;
			margin-right: 4px;
			border-radius: 16px;
			font-size: 24rpx;
		}
		.start {
			border: 2rpx solid $mj-theme-color-black;
		}
		.pause {
			border: 2rpx solid $uni-color-warning;
		}
		.end {
			border: 2rpx solid $uni-color-error;
		}
	}
	
	.bottom-btn {
		box-sizing: border-box;
		z-index: 999;
		position: fixed;
		width: 100%;
		padding: 0 24rpx 12px;
		bottom: 20rpx;
		opacity: 0.98;
	}
	
	.edit {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 4px 8px;
		margin-right: 4px;
		border-radius: 16px;
		font-size: 24rpx;
		color: $mj-bg-color;
		background-color: $mj-theme-color-2;
	}
}
</style>
