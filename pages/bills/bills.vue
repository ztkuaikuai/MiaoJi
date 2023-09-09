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
				月支出：<u--text mode="price" :text="monthlyBalance.monthlyExpend" color="#219a6d" size="24rpx" bold></u--text>
			</view>
			<view v-if="false" class="left">
				年支出：<u--text mode="price" text="2150.02" color="#219a6d" size="24rpx" bold></u--text>
			</view>
			<view class="right">
				月收入：<u--text mode="price" :text="monthlyBalance.monthlyIncome" color="#dd524d" size="24rpx" bold></u--text>
			</view>
			<view v-if="false" class="right">
				年收入：<u--text mode="price" text="250.02" color="#dd524d" size="24rpx" bold></u--text>
			</view>
		</view>
		<view class="bill-list">
			<view class="header">
				<u-icon name="order" size="48rpx" color="#212121"></u-icon>
				<text>账单明细</text>
			</view>
			<!-- 需要 到达底部钩子，按需加载 -->
			<view v-for="index in Number(dayForBillCard)" :key="index">
				<mj-bill-card :userBillsFromDB="userBillsByDay[index]" :userAssetsFromDB="userAssets" :indexTemp="index"></mj-bill-card>
			</view>
		</view>
	</view>
</template>

<script>
	import UT from '@/utils/user-state.js'
	const db = uniCloud.database()
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
				},
				month: uni.$u.timeFormat(Date.now(), 'yyyy-mm'),
				userAssets: [],
				userBills: [],
				// 按日分组的账单，给mj-bill-card使用
				userBillsByDay: [],
				initBillCard: true,
				monthlyBalance: {
					monthlyExpend: 0,
					monthlyIncome: 0
				},
				dayForBillCard: uni.$u.timeFormat(Date.now(), 'dd'),
			};
		},
		async onReady() {
			const state = UT.checkUserTokenExpierd() // 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
			if(state) return
			// console.log("用户token没过期，继续执行下面的逻辑");
			// 获取用户月账单，按天排序
			await this.getUserBills()
			// 获取用户资产列表
			this.getUserAssets()
			// 获取报表数据
			this.getServerData()
		},
		onShow() {
			// 判断用户是否登录，如果未登录 则跳转到登录页
			const {uid} = uniCloud.getCurrentUserInfo()
			if (!uid) {
				uni.redirectTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
				})
				return
			}
		},
		methods: {
			toFilterBills() {
				uni.navigateTo({
					url:"/pagesFilter/filter-bills/filter-bills"
				})
			},
			async getUserBills(type='month') {
				// 判断是获取年账单还是月账单
				if(type == 'month') {
					await this.getMonthBills(this.month)
				} else {
					// 按年账单：功能开发中
				}
			},
			async getMonthBills(month) {
				// 按月份获取账单
				const userMonthBills = db.collection("mj-user-bills").where(`user_id == $cloudEnv_uid && dateToString(add(new Date(0),bill_date),"%Y-%m","+0800") == "${month}"`).orderBy('bill_date desc').getTemp()
				const userAssets = db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').field('_id,asset_type,user_id').getTemp()
				const res = await db.collection(userMonthBills,userAssets).get()
				
				// 根据账单计算月支出和月收入
				this.userBills = res.result.data
				// 统一修改金额为 元
				this.userBills.forEach(bill => bill.bill_amount /= 100)
				const categorizedBillsByBillType = {
				  0: 0, // bill_type为0的总和
				  1: 0, // bill_type为1的总和
				  2: 0, // bill_type为2的总和
				}
				// 遍历账单数组，根据bill_type分类并计算总和
				for (const bill of this.userBills) {
				  const { bill_type, bill_amount } = bill;
				  categorizedBillsByBillType[bill_type] += bill_amount
				}
				this.monthlyBalance.monthlyExpend = categorizedBillsByBillType[0] + categorizedBillsByBillType[2]
				this.monthlyBalance.monthlyIncome = categorizedBillsByBillType[1]
				
				
				// 按天对bill进行分类
				if(this.initBillCard) {
					// 如果是初始化
					// 创建一个二维数组，按今天 9号创建9个
					const today = new Date();
					const numberOfDays = today.getDate();
					const twoDimensionalArray = [];
					for (let i = 0; i < numberOfDays; i++) {
						twoDimensionalArray.push([]);
					}
					// 判断 每个bill中的bill_date的记账日  09  08  07
					// 用今天 09 日 减去 bill_date得到索引
					// 根据索引 push 此bill 进入对应的数组 arr[index].push(bill)
					this.userBills.forEach(bill => {
						let billDay = uni.$u.timeFormat(bill.bill_date, 'dd')
						const index = numberOfDays - billDay
						twoDimensionalArray[index].push(bill)
					})
					// console.log(twoDimensionalArray);
					this.userBillsByDay = twoDimensionalArray
					// [[今天的账单],[昨天的账单],[前天账单],[9月6日账单]……[9月1日账单]]
				} else {
					// 如果用户点击了按月筛选
				}
				
			},
			getUserAssets() {
				this.userAssets = uni.getStorageSync('mj-user-assets')
			},
			getServerData() {
				// 处理userBills的数据
				console.log('userBillsByDay',this.userBillsByDay)
				const result = {
				  categories: [], // 存储日期
				  series: [
				    {
				      name: "支出",
				      data: [], // 存储支出数据
				    },
				    {
				      name: "收入",
				      data: [], // 存储收入数据
				    },
				  ],
				}
				
				// 计算出月份和天数
				let chartMonth = this.month.slice(-2)
				if (/^0\d+$/.test(chartMonth)) {
					// 如果是以0开头，则去除开头的0
					chartMonth = chartMonth.replace(/^0+/, '');
				}
				let chartDay = this.userBillsByDay.length
				
				// 遍历账单数据，计算每天的支出和收入总额
				for (const dayData of this.userBillsByDay) {
				  let dayExpense = 0;
				  let dayIncome = 0;
				  
				
				  for (const bill of dayData) {
				    if (bill.bill_type === 0 || bill.bill_type === 2) {
				      dayExpense += bill.bill_amount;
				    } else if (bill.bill_type === 1) {
				      dayIncome += bill.bill_amount;
				    }
				  }
				  // 将计算结果添加到结果对象中 
				  result.categories.push(`${chartMonth}月${chartDay}日`);
				  chartDay --
				  result.series[0].data.push(dayExpense);
				  result.series[1].data.push(dayIncome);
				}
				
				this.chartsDataColumn=result
			},
		},
		computed: {
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
