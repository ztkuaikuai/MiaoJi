<template>
	<view class="charts">
		<view class="header-fixed">
			<!-- 日期类型选择器 需要输出选择类型和时间戳，之后数据库进行筛选，拿到数据进行渲染 -->
			<mj-datetype-picker @pickDate="pickDate"></mj-datetype-picker>
			<!-- 先只考虑饼图 -->
			<!-- <view class="tabs"><u-tabs :list="[{name:'饼图'},{name: '日历'}]" @click="clickTab" lineColor="#2e3548"></u-tabs></view> -->
			<view v-if="false" class="filter" @click="toFilterBills">
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
						<u--text mode="price" :text="monthlyExpend" color="#dd524d" margin="0 0 0 20rpx" bold></u--text>
					</view>
					<view class="income" @tap="tapIncome">
						<u--text mode="price" :text="monthlyIncome" color="#219a6d" margin="0 0 0 20rpx" bold></u--text>
					</view>
				</view>
			</view>
			<view class="ucharts">
				<qiun-data-charts type="ring" :opts="opts" :chartData="chartData" canvasId="uchartsring1"
					:canvas2d="true" />
			</view>
		</view>
		<!-- 组件放置位置，传递分类，分类支出，交易数量信息进去，渲染分类百分比卡片 -->
		<view v-if="type === '月支出'" class="card-category">
			<mj-category-card :categoryListFromChart="expendCategoryList" ></mj-category-card>
			<view v-show="!expendCategoryList.length">
				<u-empty mode="list" text="没有找到符合条件的账单哦,快去记一笔吧"></u-empty>
			</view>
		</view>
		<view v-if="type === '月收入'" class="card-category">
			<mj-category-card :categoryListFromChart="incomeCategoryList" ></mj-category-card>
			<view v-show="!incomeCategoryList.length">
				<u-empty mode="list" text="没有找到符合条件的账单哦,快去记一笔吧"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import UT from '@/utils/user-state.js'
	import {getAllIconList} from '@/utils/icon-config.js'
	const db = uniCloud.database()
	export default {
		data() {
			return {
				type: '月支出',
				chartData: {},
				opts: {
					color: ["#f78121", "#df4402", "#fde801", "#ffbb02", "#fa5207"],
					padding:[14,0,0,0],
					dataLabel: true,
					legend: {
						show: true,
						position: "bottom",
						fontColor: "#212121",
						fontSize: 12,
						lineHeight: 12,
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
				},
				month: uni.$u.timeFormat(Date.now(), 'yyyy-mm'),
				monthlyBalance: {
					monthlyExpend: 0,
					monthlyIncome: 0
				},
				userBills: [],
				expendCategoryList: [],
				incomeCategoryList: [],
				initChart: true,
			};
		},
		computed: {
			monthlyExpend(){
				return this.monthlyBalance.monthlyExpend
			},
			monthlyIncome(){
				return this.monthlyBalance.monthlyIncome
			}
		},
		watch: {
			type(newValue){
				if(newValue==="月收入") {
					this.getChartData(this.incomeCategoryList)
				}
				if(newValue==="月支出") {
					this.getChartData(this.expendCategoryList)
				}
			}
		},
		async onReady() {
			const state = UT.checkUserTokenExpierd() // 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
			if (state) return
			// console.log("用户token没过期，继续执行下面的逻辑");

			// 如果用户登录了，进行初始化
			const {uid} = uniCloud.getCurrentUserInfo()
			if (uid) {
				// 获得用户当月账单
				await this.getUserBills()
				this.getChartData(this.expendCategoryList);
			}
		},
		async onShow() {
			// 判断用户是否登录，如果未登录 则跳转到登录页
			const {uid} = uniCloud.getCurrentUserInfo()
			if (!uid) {
				uni.redirectTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
				})
				return
			}
			if(!this.initChart) {
				// 如果不是初始化，执行
				// console.log("不是初始化，执行");
				await this.getMonthCategoryBills(this.month)
				if(this.type==="月收入") {
					this.getChartData(this.incomeCategoryList)
				}
				if(this.type==="月支出") {
					this.getChartData(this.expendCategoryList)
				}
			}
			
		},
		methods: {
			clickTab(e) {
				console.log(e);
			},
			toFilterBills() {
				uni.showToast({
					title: "功能开发中~",
					icon: "none"
				})
				return
				uni.navigateTo({
					url: "/pagesFilter/filter-bills/filter-bills"
				})
			},
			// 点击了月支出下方金额的文字
			tapExpend() {
				this.type = '月支出'
			},
			tapIncome() {
				this.type = '月收入'
			},
			async getUserBills(type = 'month') {
				// 判断是获取年账单还是月账单
				if (type == 'month') {
					await this.getMonthCategoryBills(this.month)
				} else {
					// 按年账单：功能开发中
				}
			},
			async getMonthCategoryBills(month) {
				// 按月份获取账单 记账日期降序排列
				const userMonthBills = db.collection("mj-user-bills").where(
					`user_id == $cloudEnv_uid && dateToString(add(new Date(0),bill_date),"%Y-%m","+0800") == "${month}"`
				).orderBy('bill_date desc').getTemp()
				const userAssets = db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').field(
					'_id,asset_type,user_id').getTemp()
				const res = await db.collection(userMonthBills, userAssets).get()
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
					const {
						bill_type,
						bill_amount
					} = bill;
					categorizedBillsByBillType[bill_type] += bill_amount
				}
				this.monthlyBalance.monthlyExpend = categorizedBillsByBillType[0] + categorizedBillsByBillType[2]
				this.monthlyBalance.monthlyIncome = categorizedBillsByBillType[1]

				// 根据账单类型bill_type进行分组  0 2:group0 ;  1 group1 
				// 根据分类category_type进行分组
				// 使用对象来分组账单并计算总和和帐单数
				const groupedBills = {};

				for (const bill of this.userBills) {
					const {
						bill_type,
						category_type,
						bill_amount
					} = bill;

					// 将bill_type为0和2的账单放在一组，bill_type为1的账单放在另一组
					const groupKey = bill_type === 1 ? 'group1' : 'group0';

					if (!groupedBills[groupKey]) {
						groupedBills[groupKey] = {};
					}

					if (!groupedBills[groupKey][category_type]) {
						groupedBills[groupKey][category_type] = {
							total_amount: 0,
							bill_count: 0,
							category_type: category_type,
							total_amount_percent: 0
						};
					}

					// 累加bill_amount到对应category_type的总和中
					groupedBills[groupKey][category_type]['total_amount'] += bill_amount;
					groupedBills[groupKey][category_type]['bill_count'] += 1;
				}
				// 将group0, group1转换成数组
				for (const groupName in groupedBills) {
					const data = Object.values(groupedBills[groupName])
					groupedBills[groupName] = data
				}
				// 计算出每个分类总支出占月支出的百分比
				for (const groupName in groupedBills) {
					const group = groupedBills[groupName]
					if (groupName === 'group0') {
						group.forEach(item => item.total_amount_percent = (item.total_amount / this.monthlyBalance
							.monthlyExpend).toFixed(4))
					}
					if (groupName === 'group1') {
						group.forEach(item => item.total_amount_percent = (item.total_amount / this.monthlyBalance
							.monthlyIncome).toFixed(4))
					}
				}
				
				// 进行排序
				for (const groupName in groupedBills) {
					if (groupedBills.hasOwnProperty(groupName)) {
						groupedBills[groupName].sort((a, b) => b.total_amount - a.total_amount);
					}
				}
				// 存入相应数组
				this.expendCategoryList = groupedBills.group0 || []
				this.incomeCategoryList = groupedBills.group1 || []
				
				
			},
			// 整理数据，渲染图表
			getChartData(categoryData) {
				let res = {}
				if(categoryData.length) {
					// 如果传递过来的值不为空数组
					const allIconList = getAllIconList()
					// 整理好的数据放入data内
					let data = []
					for (const categoryList of categoryData) {
						const objTemp = {}
						// 固定2位小数
						objTemp['value'] = parseFloat(categoryList.total_amount.toFixed(2))
						objTemp['name'] = allIconList.filter(item => item.type === categoryList.category_type)[0].title
						data.push(objTemp)
					}
					// 只存储前5个数据
					data = data.slice(0,5)
					res = {
						series: [{
							data
						}]
					}
				} else {
					res = {
						series: [{
							data: [{
								name: '暂无数据，快去记一笔吧',
								value: 0
							}]
						}]
					}
				}
				
				// 修改图表设置
				if(this.type === '月支出') {
					this.opts.title.name = '月支出'
					// 固定2位小数
					this.opts.subtitle.name = `￥${this.monthlyBalance.monthlyExpend.toFixed(2)}`
				}
				if(this.type === '月收入') {
					this.opts.title.name = '月收入'
					this.opts.subtitle.name = `￥${this.monthlyBalance.monthlyIncome.toFixed(2)}`
				}
				this.chartData = JSON.parse(JSON.stringify(res))
				
				if(this.initChart) {
					// 如果是初始化，则赋值结束初始化
					this.initChart = false
				}
			},
			// 触发日期选择器
			async pickDate(res) {
				// 用户选择了月账单
				// 1 格式化日期，获得月份 如2023-09
				// 2 告知getMonthBills 非初始化，更新图表
				const {value} = res
				this.month = uni.$u.timeFormat(value, 'yyyy-mm')
				await this.getMonthCategoryBills(this.month)
				if(this.type==="月收入") {
					this.getChartData(this.incomeCategoryList)
				}
				if(this.type==="月支出") {
					this.getChartData(this.expendCategoryList)
				}
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