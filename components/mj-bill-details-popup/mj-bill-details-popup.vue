<template>
	<u-popup :show="show" @close="close" round="20px" zIndex="10076" :safeAreaInsetBottom="safeAreaInsetBottom" >
		<view class="user-assets-list">
			<view class="top">
				<view class="btn del" @click="deleteBill">
					删除
				</view>
				<view class="btn edit" @click="updateBill">
					修改
				</view>
			</view>
			<view class="content">
				<mj-card title="分类">
					<view class="category">
						<mj-icon-with-background :type="billDetails.billStyle.icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
						<text>{{billDetails.billStyle.title}}</text>
					</view>
				</mj-card>
				<mj-card title="账单">
					<view class="row">
						<view>
							金额
						</view>
						<view v-if="billDetails.bill_type === 0">
							<u--text mode="price" :text="billDetails.bill_amount" color="#dd524d" size="32rpx" bold></u--text>
						</view>
						<view v-if="billDetails.bill_type === 1">
							<u--text mode="price" :text="billDetails.bill_amount" color="#219a6d" size="32rpx" bold></u--text>
						</view>
						<view v-if="billDetails.bill_type === 2">
							<u--text mode="price" :text="billDetails.transfer_amount" color="#212121" size="32rpx" bold></u--text>
						</view>
					</view>
					<view class="row" v-if="billDetails.bill_type === 2">
						<view>
							手续费
						</view>
						<view>
							<u--text mode="price" :text="billDetails.bill_amount" color="#212121" size="32rpx" bold></u--text>
						</view>
					</view>
					<view class="row">
						<view>
							时间
						</view>
						<view>
							{{billDate}}
						</view>
					</view>
				</mj-card>
				<mj-card title="资产">
					<view class="row">
						<view>
							资产账户
						</view>
						<view class="highlight">
							{{billDetails.assetStyle.title || '资产已删除'}}
						</view>
					</view>
					<view class="row" v-if="billDetails.bill_type === 2">
						<view>
							入账账户
						</view>
						<view class="highlight">
							{{billDetails.transferAssetStyle.title || '资产已删除'}}
						</view>
					</view>
				</mj-card>
				<mj-card title="备注" v-if="billDetails.bill_notes">
					<view style="text-align: center;">
						{{billDetails.bill_notes}}
					</view>
				</mj-card>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import {getAssetsStyle} from '@/utils/icon-config.js'
	export default {
		name: "mj-bill-details-popup",
		// 获取账单信息
		props: {
			show: {
				type: Boolean,
				default: false
			},
			bill: {
				type: Object
			},
			safeAreaInsetBottom : {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			close() {
				this.$emit('close')
			},
			deleteBill() {
				this.$emit('deleteBill')
			},
			updateBill() {
				this.$emit('updateBill')
			}
		},
		computed: {
			billDetails() {
				const bill = this.bill
				// console.log("computed billDetails",bill);
				if(bill.bill_type === 2) {
					// 如果类型为转账  将转账金额转换为元
					bill.transfer_amount /= 100
					const assetsStyle = getAssetsStyle()
					bill.transferAssetStyle = assetsStyle.find(item => item.type === bill.destination_asset_id[0]?.asset_type)
				}
				return bill
			},
			billDate() {
				return uni.$u.timeFormat(this.billDetails.bill_date, 'yyyy-mm-dd hh:MM:ss')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.user-assets-list {
		height: 640rpx;
		box-sizing: border-box;
		padding: 10px;
		background-color: $mj-bg-color;
		overflow: hidden;
		border-radius: 20px;

		.top {
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.btn {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 4px 8px;
				margin-right: 8px;
				border-radius: 16px;
				font-size: 28rpx;
				
			}
			.del {
				color: $mj-color-red;
				border: 1px solid $mj-color-red;
			}
			.edit {
				color: $mj-bg-color;
				background-color: $mj-theme-color-2;
			}
		}
		.content {
			max-height: 580rpx;
			overflow-y: auto;
			.category {
				display: flex;
				justify-content: start;
				align-items: center;
				text {
					margin-left: 16rpx;
				}
			}
			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-sizing: border-box;
				padding: 0 8rpx;
				font-size: 32rpx;
				color: $mj-text-color;
				margin-bottom: 24rpx;
				.highlight {
					color: $mj-theme-color;
				}
			}
		}
	}
</style>