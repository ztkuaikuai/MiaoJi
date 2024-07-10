<!-- 添加or修改定时任务 -->
<template>
	<view class="cron-accounting-edit">
		<view class="linear-gradient"></view>
		<mj-card title="任务规则">
			<div class="form-wrapper">
				<u--input
					placeholder="任务名称"
					border="surround"
					v-model="cronName"
					shape="circle"
					fontSize="24rpx"
					maxlength="20"
					:clearable="true"
				></u--input>
				<mj-section title="重复周期" subTitle="根据规则执行自动记账" iconType="mj-reloadtime" :customStyle="{'marginTop': '12px'}">
					<template #right>
						<view class="section-right">
							<view class="section-text">
								每3天
							</view>
							<view class="section-icon">
								<u-icon name="arrow-right" size="24rpx" bold color="#d0d0d0"></u-icon>
							</view>
						</view>
					</template>
				</mj-section>
				<mj-section title="开始时间" subTitle="2024年7月11日" iconType="mj-second">
					<template #right>
						<view class="section-right">
							<view class="section-icon">
								<u-icon name="arrow-right" size="24rpx" bold color="#d0d0d0"></u-icon>
							</view>
						</view>
					</template>
				</mj-section>
				<mj-section title="结束方式" subTitle="根据规则结束任务" iconType="mj-loop">
					<template #right>
						<view class="section-right">
							<view class="section-text">
								永不结束
							</view>
							<view class="section-icon">
								<u-icon name="arrow-right" size="24rpx" bold color="#d0d0d0"></u-icon>
							</view>
						</view>
					</template>
				</mj-section>
			</div>
		</mj-card>
		<mj-card title="账单模板">
			<template #right>
				<view class="btn choose">
					选取
				</view>
			</template>
			<mj-bill-one-template :oneTemplate="testTemplete"></mj-bill-one-template>
		</mj-card>
		<mj-card title="任务状态">
			<mj-section title="开启任务" subTitle="是否启用此周期任务" :showIcon="false">
				<template #right>
					<u-switch v-model="isStart" :activeColor="mjThemeColor"></u-switch>
				</template>
			</mj-section>
		</mj-card>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="保存" :color="mjThemeColor" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	import { themeColor } from '@/uni.scss'
	
	export default {
		mounted() {
		},
		data() {
			return {
				cronName: '',
				isStart: true,
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
			}
		},
		computed: {
			mjThemeColor() {
				return themeColor
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.cron-accounting-edit {
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
	
	.form-wrapper {
		box-sizing: border-box;
		padding: 20rpx;
		.section-right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100%;
			.section-text {
				color: $mj-text-color-grey;
				font-size: 24rpx;
				padding-right: 8rpx;
			}
		}
	}
	
	.btn {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 4px 8px;
		margin-right: 4px;
		border-radius: 16px;
		font-size: 24rpx;
	}
	.choose {
		color: $mj-text-color-grey;
		background-color: $mj-bg-color-grey;
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
}
</style>
