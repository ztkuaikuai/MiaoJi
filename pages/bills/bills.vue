<template>
	<view class="bills">
		<view class="header-fixed">
			<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
			<mj-datetype-picker @pickDate="pickDate"></mj-datetype-picker>
			<view v-if="false" class="filter" @click="toFilterBills">
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
			<view class="right">
				月收入：<u--text mode="price" :text="monthlyBalance.monthlyIncome" color="#dd524d" size="24rpx" bold></u--text>
			</view>
		</view>
		<view class="bill-list">
			<view class="header">
				<u-icon name="order" size="48rpx" color="#212121"></u-icon>
				<text>账单明细</text>
			</view>
			<!-- 需要 到达底部钩子，按需加载 -->
			<view v-for="index in 31" :key="index">
				<mj-bill-card :userBillsFromDB="userBillsByDay[index]" :userAssetsFromDB="userAssets" :indexTemp="index"></mj-bill-card>
			</view>
			<view v-show="userBillsCount === 0">
				<u-empty mode="list" text="没有找到符合条件的账单哦,快去记一笔吧"></u-empty>
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
					color: ['#dd524d','#009c63'],
					yAxis: {
						disabled: true,
						disableGrid: true
					},
					xAxis: {
						itemCount: 10,
						labelCount: 5,
						fontSize: 10,
						min: 0
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
				firstEntry: true
			};
		},
		computed: {
			// 计算账单个数
			userBillsCount() {
				let count = 0
				// console.log('userBills',this.userBills);
				for (const bills of this.userBills) {
					// 如果有账单，则count++
					count ++
				}
				return count
			}
		},
		async onReady() {
			const state = UT.checkUserTokenExpierd() // 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
			if(state) return
			// console.log("用户token没过期，继续执行下面的逻辑");
			
			// 如果用户登陆了，进行初始化
			const {uid} = uniCloud.getCurrentUserInfo()
			if (uid) {
				// 获取用户月账单，按天排序
				await this.getUserBills()
				// 获取用户资产列表
				this.getUserAssets()
				// 获取报表数据
				this.getChartData()
				uni.$on('updateBillPage',this.upDateMonthBills)
			}
			
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
			if(this.firstEntry) {
				// 用户第一次进入账单页面
				this.firstEntry = false
			} else {
				// 用户再次进入账单页面
				this.getMonthBills(this.month)
			}
			
		},
		methods: {
			toFilterBills() {
				uni.showToast({
					title:"功能开发中~",
					icon:"none"
				})
				return
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
				// 按月份获取账单 记账日期降序排列
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
				
				let numberOfDays = 31
				// 按天对bill进行分类
				if(this.initBillCard) {
					// 如果是初始化
					// 创建一个二维数组，元素个数按1号到今天 9号创建9个
					const today = new Date();
					numberOfDays = today.getDate();
				} else {
					// 如果用户点击了按月筛选，创建一个二维数组，元素个数为当月天数
					numberOfDays = this.getTotalDaysInMonth(this.month)
				}
				const twoDimensionalArray = [];
				for (let i = 0; i < numberOfDays; i++) {
					twoDimensionalArray.push([]);
				}
				// 判断 每个bill中的bill_date的记账日 例如 09  08  07
				// 用numberOfDays 减去 bill_date得到索引
				// 根据索引 push 此bill 进入对应的数组 arr[index].push(bill)
				this.userBills.forEach(bill => {
					let billDay = uni.$u.timeFormat(bill.bill_date, 'dd')
					const index = numberOfDays - billDay
					twoDimensionalArray[index].push(bill)
				})
				// console.log('更新后userBillsByDay',twoDimensionalArray);
				this.userBillsByDay = twoDimensionalArray
				// 倒序排列
				// [[今天的账单],[昨天的账单],[前天账单],[9月6日账单]……[9月1日账单]]
				// [[月末的账单],…………[月初的账单]]
				
				
				// 非初始化，重新渲染账单和图表
				if(!this.initBillCard) this.getChartData()
			},
			upDateMonthBills() {
				// 用户点击确认删除账单触发
				// initBillCard为false，告知getMonthBills 非初始化，更新图表
				this.initBillCard = false
				this.getMonthBills(this.month)
			},
			getUserAssets() {
				this.userAssets = uni.getStorageSync('mj-user-assets')
			},
			getChartData() {
				// 处理userBills的数据
				// console.log('userBillsByDay',this.userBillsByDay)
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
			// 触发日期选择器
			pickDate(res) {
				// 用户选择了月账单
				// 1 格式化日期，获得月份 如2023-09
				// 2 initBillCard为false，告知getMonthBills 非初始化，更新图表
				const {value} = res
				this.month = uni.$u.timeFormat(value, 'yyyy-mm')
				this.initBillCard = false
				this.getMonthBills(this.month)
				
			},
			// 获取当月的总天数
			getTotalDaysInMonth(yearmonth) {
				const [year,month] = yearmonth.split('-')
				// console.log(year,month);
				// 创建一个日期对象，将月份设置为所输入的月份，日期设置为1号
				const date = new Date(year, month - 1, 1);
				// 将日期设置为下个月的第0天（即本月的最后一天）
				date.setMonth(date.getMonth() + 1, 0);
				// 获取日期对象中的日期部分，即本月的总天数
				const totalDays = date.getDate();
				return totalDays;
			},
		},
		// 分享功能
		onShareAppMessage () {
			return {
				title: "妙记——记录你的生活",
				path: "/pages/index/index",
				imageUrl: "/static/share.png"
			}
		},
		// 分享到朋友圈功能
		onShareTimeline(){
			return {
				title: '妙记——记录你的生活'
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
