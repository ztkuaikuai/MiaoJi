<template>
	<view class="bills">
		<view class="header-fixed">
			<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
			<mj-datetype-picker></mj-datetype-picker>
			<view class="filter" @tap="toFilterBills">
				<!-- 当有筛选条件时，加粗 -->
				筛选
			</view>
		</view>
		<view class="card-chart">
			<view class="ucharts">
				<qiun-data-charts type="column" :opts="opts" :chartData="chartsDataColumn" :ontouch="true" canvasId="uchartscolumn1" :canvas2d="true" />
			</view>
		</view>
		<view class="card-money">
			<view class="left">
				月结余：<u--text mode="price" text="2150.02" color="#219a6d" size="24rpx" bold></u--text>
			</view>
			<view class="right">
				日均支出：<u--text mode="price" text="250.02" color="#dd524d" size="24rpx" bold></u--text>
			</view>
		</view>
		<view class="bill-list">
			<view class="header">
				<u-icon name="order" size="48rpx" color="#212121"></u-icon>
				<text>账单明细</text>
			</view>
			<!-- 需要 到达底部钩子，按需加载 -->
			<mj-bill-card v-for="item in 3"></mj-bill-card>
		</view>
	</view>
</template>

<script>
	import demodata from "@/mockdata/demodata.json"
	export default {
		data() {
			return {
				// 图表数据
				chartsDataColumn: {},
				// 图表配置
				opts: {
					dataLabel: false,
					enableScroll: true,
					fontSize: 10,
					enableMarkLine: true,
					color: ['#fa424e','#16a168'],
					yAxis: {
						disabled: true,
						disableGrid: true
					},
					xAxis: {
						itemCount: 10,
						labelCount: 5,
						fontSize: 10,
					},
					// 图例配置（下方的支出，收入）
					legend: {
						margin: 0
					},
					extra: {
						tooltip: {
							showArrow: false,
							bgOpacity: 0.5,
							fontSize: 12,
							lineHeight: 16,
							legendShape: 'circle'
						},
						column: {
							width: 10,
							seriesGap: 4,
							barBorderCircle: true,
							activeBgOpacity: 0.04
						}
					},
				}
			};
		},
		onReady() {
			this.getServerData()
		},
		onShow() {
			// 判断用户是否登录，如果未登录 则跳转到登录页
			const {uid} = uniCloud.getCurrentUserInfo()
			if (!uid) {
				uni.navigateTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
				})
				return
			}
		},
		methods: {
			getServerData() {
				setTimeout(()=> {
					this.chartsDataColumn=JSON.parse(JSON.stringify(demodata.Column))
				}, 1000)
			},
			toFilterBills() {
				uni.navigateTo({
					url:"/pagesFilter/filter-bills/filter-bills"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.bills {
	.header-fixed {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		box-sizing: border-box;
		padding: 0 28rpx;
		background-color: $mj-theme-color;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color: $mj-text-color;
		z-index: 999;
	}
	.card-chart {
		margin: 0 28rpx;
		box-sizing: border-box;
		margin-top: 96rpx;
		background-color: #fff;
		height: 368rpx;
		border-radius: 36rpx;
		padding: 8rpx;
		box-shadow: rgba(0, 0, 0, 0.03) 0px 20px 25px -5px, rgba(0, 0, 0, 0.01) 0px 10px 10px -5px;
		.ucharts {
			width: 100%;
			height: 100%;
		}
	}
	.card-money {
		margin: 20rpx 28rpx 0;
		box-sizing: border-box;
		background-color: #fff;
		height: 88rpx;
		border-radius: 36rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: $mj-text-color;
		box-shadow: rgba(0, 0, 0, 0.03) 0px 20px 25px -5px, rgba(0, 0, 0, 0.01) 0px 10px 10px -5px;
		.left {
			display: flex;
			justify-content: start;
		}
		.right {
			display: flex;
			justify-content: start;
		}
	}
	.bill-list {
		.header {
			margin: 16rpx 0;
			padding-left: 12rpx;
			display: flex;
			align-items: center;
			color: #000;
			font-size: 32rpx;
		}
	}
}
</style>
