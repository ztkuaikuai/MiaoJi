<template>
	<view class="bill-card">
		<view class="header" v-if="pageType == 'index'">
			<text>一共记了{{userBillsCount}}笔账单</text>
			<text>支出:{{totalExpenditure}} 收:{{totalIncome}}</text>
		</view>
		<view class="header" v-else>
			<text>8月29日 今天</text>
			<text>支出:40.00 收:40.00</text>
		</view>
		<!-- 这里需要循环 -->
		<view class="content">
			<!-- 滑动单元格 -->
			<u-swipe-action>
				<u-swipe-action-item :options="options" v-for="bill,index in userBills" :threshold="80" @click="clickSwipeActionItemBtn($event)">
					<view class="swipe-action-item">
						<view class="left">
							<mj-icon-with-background :type="bill.billStyle.icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
							<view class="info">
								<view>{{bill.billStyle.title}}</view>
								<view class="minor" v-if="bill.bill_notes"><u--text :lines="1" :text="bill.bill_notes" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view> <!-- 设置超过一行就... 可以使用u-text组件 -->
							</view>
						</view>
						<view class="right">
							<view class="money" v-if="bill.bill_type === 0">
								<u--text mode="price" :text="bill.bill_amount" color="#dd524d" size="32rpx"bold></u--text>
							</view>
							<view class="money" v-if="bill.bill_type === 1">
								<u--text mode="price" :text="bill.bill_amount" color="#219a6d" size="32rpx"bold></u--text>
							</view>
							<view class="money" v-if="bill.bill_type === 2">
								<u--text mode="price" :text="bill.bill_amount" color="#212121" size="32rpx"bold></u--text>
							</view>
							<view class="minor">{{bill.assetStyle.title}}</view>
						</view>
					</view>
					<view class="line" v-if="index != userBills.length - 1">
						<u-line length="80%"></u-line>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
	import ICONCONFIG from "@/utils/icon-config.js";
	export default {
		name: "mj-bill-card",
		props: ['pageType','userBillsFromDB','userBillsCount'],
		data() {
			return {
				options: [{
					text: "修改",
					style: {
						backgroundColor: '#9fcba7',
						padding: '0 40rpx'
					}
				}, {
					text: "删除",
					style: {
						backgroundColor: '#e94459',
						padding: '0 40rpx'
					}
				}],
				userBills: [],
				iconGather: [],
				assetsStyle: []
			};
		},
		methods: {
			clickSwipeActionItemBtn({index}) {  // 0 修改  1 删除
				console.log("点击了滑动选择器btn",index);
			}
		},
		onReady() {
			// 获取icon样式，并且拼接到一起
			const iconExpend = ICONCONFIG.getCategoryIconListForExpend()
			const iconIncome = ICONCONFIG.getCategoryIconListForIncome()
			this.iconGather = iconExpend.concat(iconIncome)
			const transfer = {
				icon: 'mj-zhuanzhang',
				title: '内部转账',
				type: 'transfer'
			}
			this.iconGather.push(transfer)
			// 获取资产样式
			this.assetsStyle = ICONCONFIG.getAssetsStyle()
		},
		watch: {
			userBillsFromDB: {
				handler(newValue) {
					this.userBills = newValue
					// 通过type给每一条添加对应billStyle
					this.userBills.forEach(bill => {
						bill.billStyle = this.iconGather.find(item => item.type === bill.category_type)
					})
					// 通过asset_id.asset_type给每一条添加对应的assetStyle
					this.userBills.forEach(bill => {
						bill.assetStyle = this.assetsStyle.find(item => item.type === bill.asset_id[0].asset_type)
					})
					console.log('userBills',this.userBills);
				}
			}
		},
		computed: {
			// 支出 = 支出 + 手续费
			totalExpenditure() {
				const expendBills = this.userBills.filter(bill => bill.bill_type === 0)
				const transferBills = this.userBills.filter(bill => bill.bill_type === 2)
				return (expendBills.reduce((prev,next) => prev + next.bill_amount ,0) + transferBills.reduce((prev,next) => prev + next.bill_amount ,0)).toFixed(2)
			},
			// 收入
			totalIncome() {
				const incomeBills = this.userBills.filter(bill => bill.bill_type === 1)
				return incomeBills.reduce((prev,next) => prev + next.bill_amount ,0).toFixed(2)
			}
			
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