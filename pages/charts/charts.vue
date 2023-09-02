<template>
	<view class="charts">
		<view class="header-fixed">
			<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
			<mj-datetype-picker></mj-datetype-picker>
			<!-- 先只考虑饼图 -->
			<!-- <view class="tabs"><u-tabs :list="[{name:'饼图'},{name: '日历'}]" @click="clickTab" lineColor="#2e3548"></u-tabs></view> -->
			<view class="filter" @tap="toFilterBills">
				筛选
			</view>
		</view>
		<view class="card-chart">
			<view class="radio">
				<view>
					<u-radio-group v-model="type" placement="row" shape="circle" activeColor="#9fcba7"
						labelColor="#212121" iconSize="0" labelSize="28rpx">
						<u-radio size="24rpx" label="月支出" name="月支出" style="margin-right: 20rpx;"></u-radio>
						<u-radio size="24rpx" label="月收入" name="月收入"></u-radio>
					</u-radio-group>
				</view>
				<view class="money">
					<view class="expend" @tap="tapExpend">
						<u--text mode="price" text="964.32" color="#dd524d" margin="0 0 0 20rpx" bold></u--text>
					</view>
					<view class="income" @tap="tapIncome">
						<u--text mode="price" text="2150.02" color="#219a6d" margin="0 0 0 20rpx" bold></u--text>
					</view>
				</view>
			</view>
			<view class="ucharts">
				<qiun-data-charts type="ring" :opts="opts" :chartData="chartData" canvasId="uchartsring1" :canvas2d="true" />
			</view>
		</view>
		<!-- 组件放置位置，传递分类，分类支出，交易数量信息进去，渲染分类百分比卡片 -->
		<view class="card-category">
			<mj-category-card></mj-category-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '月支出',
				chartData: {},
				opts: {
					color: ["#f78121", "#df4402", "#fde801", "#ffbb02", "#fa5207"],
					dataLabel: true,
					legend: {
						show: true,
						position: "bottom",
						fontColor: "#212121",
						fontSize: 12,
						lineHeight: 16,
						margin: 0
					},
					title: {
						name: "月支出",
						color: "#212121",
						fontSize: 22,
						offsetY: -4
					},
					subtitle: {
						name: "￥16638.32",
						color: "#dd524d",
						fontSize: 20,
						offsetY: -4
					},
					extra: {
						ring: {
							ringWidth: 30,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: -90,
							labelWidth: 15,
							border: false,
							borderColor: "#FFFFFF",
							activeOpacity: 0.3
						},
						tooltip: {
							showArrow: false,
							borderRadius: 10
						}
					}
				}
			};
		},
		onReady() {
			this.getServerData();
		},
		methods: {
			clickTab(e) {
				console.log(e);
			},
			getServerData() {
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						series: [{
							data: [{
								"name": "餐饮",
								"value": 50,
								// 自定义标签文字
								"labelText": "餐饮"
							}, {
								"name": "住宿",
								"value": 30
							}, {
								"name": "通讯",
								"value": 20
							}, {
								"name": "游戏",
								"value": 18
							}, {
								"name": "学习",
								"value": 23
							}]
						}]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				}, 500);
			},
			toFilterBills() {
				uni.navigateTo({
					url:"/pagesFilter/filter-bills/filter-bills"
				})
			},
			// 点击了月支出下方金额的文字
			tapExpend() {
				this.type = '月支出'
			},
			tapIncome() {
				this.type = '月收入'
			}
		}
	}
</script>

<style lang="scss">
	.charts {
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

			// .tabs {
			// 	padding-right: 120rpx;
			// }
		}

		.card-chart {
			margin: 0 28rpx;
			margin-top: 96rpx;
			box-sizing: border-box;
			background-color: #fff;
			height: 660rpx;
			border-radius: 36rpx;
			padding: 20rpx;
			box-shadow: rgba(0, 0, 0, 0.03) 0px 20px 25px -5px, rgba(0, 0, 0, 0.01) 0px 10px 10px -5px;

			.radio {
				height: 100rpx;
				.u-radio:first-child {
					margin-right: 140rpx;
				}
				.money {
					display: flex;
					justify-content: start;
					align-items: center;
					.expend {
						width: 166rpx;
						margin-right: 100rpx;
					}
				}
			}

			.ucharts {
				height: 520rpx;
				width: 100%;
			}
		}

		.card-category {
			margin-top: 8rpx;
		}
	}
</style>