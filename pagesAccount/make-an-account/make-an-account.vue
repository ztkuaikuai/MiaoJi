<template>
	<view class="keep-accounts">
		<view class="header-tabs">
			<view class="tabs"><u-tabs :list="tabList" @click="clickTab" lineColor="#2e3548" :itemStyle="{ height: '76rpx' }"></u-tabs></view>
		</view>
		<view class="icon-grid">
			<view class="icon-expend" v-show="showExpend">
				<!-- 支出icon -->
				<u-grid :border="false" @click="clickCategoryExpend" col="5">
					<u-grid-item v-for="item,index in categoryIconListForExpend" :key="item.type">
						<view class="content">
							<view class="grid-item">
								<mj-icon-with-background v-if="index !== currentExpendIndex" :type="item.icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
								<mj-icon-with-background v-if="index === currentExpendIndex" :type="item.icon" size="48rpx" customPrefix="miaoji" color="#65915b" bgcColor="#efea9b"></mj-icon-with-background>
								<view class="grid-text">{{item.title}}</view>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
			<!-- 收入icon -->
			<view class="icon-income" v-show="showIncome">
				<u-grid :border="false" @click="clickCategoryIncome" col="5">
					<u-grid-item v-for="item,index in categoryIconListForIncome" :key="item.type">
						<view class="content">
							<view class="grid-item">
								<mj-icon-with-background v-if="index !== currentIncomeIndex" :type="item.icon" size="48rpx" customPrefix="miaoji" ></mj-icon-with-background>
								<mj-icon-with-background v-if="index === currentIncomeIndex" :type="item.icon" size="48rpx" customPrefix="miaoji" color="#65915b" bgcColor="#efea9b"></mj-icon-with-background>
								<view class="grid-text">{{item.title}}</view>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="transfer-accounts" v-if="showTransferAccounts">
				<!-- 转入账户 -->
				<view class="asset-card" >
					<view class="left">
						<view class="left-icon">
							<uni-icons type="wallet" color="#6d6d6d" size="40rpx"></uni-icons>
						</view>
						<view class="asset-type" :style="assetName ? '' : 'color: #6d6d6d;'" >
							{{assetName  || '转出账户'}}
						</view>
					</view>
					<view class="asset-icon">
						<uni-icons type="mj-weixinzhifu" color="#6bcc03" customPrefix="miaoji"></uni-icons>
					</view>
				</view>
				<!-- 转出账户 -->
				<view class="asset-card" >
					<view class="left">
						<view class="left-icon">
							<uni-icons type="wallet" color="#6d6d6d" size="40rpx"></uni-icons>
						</view>
						<view class="asset-type" :style="assetName ? '' : 'color: #6d6d6d;'" >
							{{destinationAssetName || '转入账户'}}
						</view>
					</view>
					<view class="asset-icon">
						<uni-icons type="mj-weixinzhifu" color="#6bcc03" customPrefix="miaoji"></uni-icons>
					</view>
				</view>
				
				<view style="color: #6d6d6d;padding-left: 8rpx;font-size: 24rpx;">
					手续费——从转出账户转出的钱=转出金额+手续费
				</view>
				<u--form :model="transferAccountInfo" :borderBottom="false" ref="uForm" errorType="toast">
					<u-form-item prop="bill_amount" :borderBottom="false">
						<u--input v-model="transferAccountInfo.bill_amount" placeholder="手续费" placeholderStyle="color: #6d6d6d" type="digit" border="surround" clearable
							shape="circle" maxlength="10" fontSize="13px" :customStyle="inputStyle" prefixIcon="rmb-circle"
							prefixIconStyle="color: #6d6d6d"></u--input>
					</u-form-item>
				</u--form>
				<button @click="test">点我验证</button>
			</view>
		</view>
		<view class="mj-keyboard">
			<view class="fixed">
				<view class="tags">
					<view class="item" @click="chooseAsset" v-if="!showTransferAccounts">
						<view><uni-icons type="wallet" size="28rpx"></uni-icons></view>
						<view>{{currentAssetTitle}}</view>
					</view>
					<view class="item" @click="chooseDate">
						<view><uni-icons type="calendar" size="28rpx"></uni-icons></view>
						<view>{{userChooseDate}}</view>
					</view>
					<view class="item">
						<view><uni-icons type="mj-layout" size="28rpx" customPrefix="miaoji"></uni-icons></view>
						<view>模板</view>
					</view>
				</view>
				<view class="bgc">
					<view class="header">
						<view class="textarea">
							<u--textarea v-model="keyboardInfo.notes" placeholder="备注信息(最多输入60字)" autoHeight border="none" :fixed="true" maxlength="60"></u--textarea>
						</view>
						<view class="num">
							<!-- <u--text mode="price" :text="keyboardInfo.balance" color="#dd524d" bold size="36rpx"></u--text> -->
							￥{{keyboardInfo.balance}}
						</view>
					</view>
				</view>
				<!-- 安全区适配 配置底部安全区 -->
				<u-safe-bottom></u-safe-bottom>
			</view>
			<view class="keyboard">
				<!-- 修改了u-number-keyboard中的样式,逻辑 -->
				<u-keyboard mode="number" zIndex="1" :show="true" :tooltip="false" :overlay="false" @change="tapKeyboard" @backspace="tapBackspace"></u-keyboard>
			</view>
		</view>
		
		<!-- 展示资产页的popup -->
		<u-popup :show="showUserAssetsList" @close="showUserAssetsList = false" round="20px" zIndex="10076">
			<view class="user-assets-list">
				<view class="top">
					<view class="add">
						添加
					</view>
				</view>
				<view class="content">
					<u-cell-group :border="false" >
						<u-cell :title="asset.assetStyle.title" :clickable="true" @click="clickOneAsset(asset)" v-for="asset in userAssets" :key="asset._id" >
							<uni-icons slot="icon" :type="asset.assetStyle.icon" size="36rpx" custom-prefix="miaoji" :color="asset.assetStyle.color"></uni-icons>
							<view slot="value">
								<u--text mode="price" :text="asset.asset_balance" color="#219a6d" size="28rpx" bold></u--text>
							</view>
						</u-cell>
					</u-cell-group>
				</view>
			</view>
		</u-popup>
		
		<!-- 展示日期选择器的组件 -->
		<u-datetime-picker
		                :show="showDatetimePicker"
		                v-model="currentDate"
		                mode="datetime"
						:maxDate="Date.now()"
						confirmColor="#9fcba7"
						closeOnClickOverlay="true"
						@close="showDatetimePicker = false"
						@cancel="showDatetimePicker = false"
						@confirm="getBillDate"
		></u-datetime-picker>
	</view>
</template>

<script>
	import ICONCONFIG from "@/utils/icon-config.js";
	const db = uniCloud.database()
	export default {
		data() {
			return {
				tabList: [{
					name: '支出'
				}, {
					name: '收入'
				}, {
					name: '转账'
				}],
				categoryIconListForExpend: [],
				categoryIconListForIncome: [],
				showExpend: true,
				showIncome: false,
				showTransferAccounts: false,
				// 用户资产列表
				userAssets: [],
				assetsStyle: [],
				showUserAssetsList: false,
				showDatetimePicker: false,
				currentDate: Date.now(),
				userChooseDate: uni.$u.timeFormat(Date.now(), 'mm月dd日'),
				assetName: '',
				destinationAssetName: '',
				rules: {
					'bill_amount': [
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.amount(value)
							},
							message: '最多填写两位小数'
						},
					]
				},
				inputStyle: {
					'background-color': '#f1f1f1',
					'border-radius': '20px',
					'border': 'none',
					'height': '80rpx',
					'padding-left': '20px',
					'padding-right': '20px',
				},
				// 支出页||收入页表单信息
				expendOrIncomeInfo: {
					category_type: 'dining',
					bill_type: 0,
					bill_amount: 0.00,
					asset_id: '',
					bill_date: Date.now(),
					bill_notes: ''
				},
				// 转账页表单信息
				transferAccountInfo: {
					category_type: 'transfer',
					bill_type: 2,
					bill_amount: 0.00,  // 手续费
					asset_id: '',
					bill_date: '',
					bill_notes: '',
					transfer_amount: 0.00,  //转账金额
					destination_asset_id: ''  // 转入资产id
				},
				//  keyboard相关数据
				keyboardInfo: {
					notes: '',
					balance: '0.00'
				},
				// 分类index
				currentExpendIndex: 0,
				currentIncomeIndex: 0,
				currentTabIndex: 0,
				currentAssetTitle: '未选择资产'  // 默认为用户第一个资产
			};
		},
		methods: {
			clickTab({index}) {  // 0 支出  1 收入  2 转账
				// 如果点击的不是当前所在tab
				if(this.currentTabIndex === index) return
				const tabs = [
					{ showExpend: true, showIncome: false, showTransferAccounts: false, bill_type : 0, category_type : 'dining', currentIncomeIndex: 0},
					{ showExpend: false, showIncome: true, showTransferAccounts: false, bill_type : 1, category_type : 'primary-income', currentExpendIndex: 0},
					{ showExpend: false, showIncome: false, showTransferAccounts: true},
				];
				Object.assign(this, tabs[index] || {});
				this.currentTabIndex = index
				// console.log(this.expendOrIncomeInfo);
			},
			// 点击分类-支出icon触发
			clickCategoryExpend(index) {
				if(this.currentExpendIndex === index) return
				// 高亮并给表单的 分类类型 赋值
				this.currentExpendIndex = index
				this.expendOrIncomeInfo.category_type = this.categoryIconListForExpend[index].type
			},
			// 点击分类-收入icon触发
			clickCategoryIncome(index) {
				if(this.currentIncomeIndex === index) return
				this.currentIncomeIndex = index
				this.expendOrIncomeInfo.category_type = this.categoryIconListForIncome[index].type
			},
			// 点击设置资产popup中的某一个资产
			clickOneAsset(asset) {
				// console.log('点击了资产列表',asset);
				// 1 隐藏pop框
				// 2 拿到资产id赋值给表单的 asset_id； 拿到assetStyle中title 渲染
				this.showUserAssetsList = false
				this.expendOrIncomeInfo.asset_id = asset._id
				this.currentAssetTitle = asset.assetStyle.title
				// console.log(this.expendOrIncomeInfo);
			},
			test() {
				this.$refs.uForm.setRules(this.rules)
				this.$refs.uForm.validate().then( res => {
					console.log(res)
				}).catch(errors => {
					console.log(errors)
				})
			},
			
			
			
			// keyboard 相关方法
			
			chooseAsset() {
				this.showUserAssetsList = true
			},
			chooseDate() {
				this.showDatetimePicker = true
			},
			// 用户选择的日期，返回值为时间戳（毫秒）
			getBillDate({value}) {
				this.showDatetimePicker = false
				// 1 用户选择日期点击确定
				// 2 时间戳赋值给表单的 bill_date ，格式化时间  x月x日，赋值给 userChooseDate
				this.expendOrIncomeInfo.bill_date = value
				this.userChooseDate = uni.$u.timeFormat(value, 'mm月dd日')
				console.log(this.expendOrIncomeInfo);
			},
			// keyboard被点击（不包含退格键）
			tapKeyboard(e) {
				// 允许最大8位整数
				if(this.keyboardInfo.balance.length >= 9) {
					uni.showToast({
						title:"金额长度不能超过8位",
						icon: "none"
					})
					return
				}
				let balance = this.keyboardInfo.balance
				if(e === '保存') {
					if(!uni.$u.test.amount(balance)) return
					this.addOneBill()
				} else if (e === '.') {
					if(balance.indexOf('.') !== -1) return // 如果含有 .  return
					balance += e
				} else if (e === '再记' || e === '秒记1' || e === '秒记2') {  // 再记：保存数据，上传数据库，提示用户，并清空重置
					uni.showToast({title:"正在开发中~",icon: 'none'})
				} else {
					// 用户输入0-9
					if(balance === '0.00' || balance === '0') {
						balance = e
					}  else if (balance.endsWith('.',balance.length - 2)) {
						// 如果是 .xx形式，不继续添加
						return
					} else {
						balance += e
					}
				}
				// console.log('更新后的balance',balance);
				this.keyboardInfo.balance = balance.toString()
			},
			// 退格键被点击
			tapBackspace() {
				let balance = this.keyboardInfo.balance
				if(balance.length === 0) return 
				// 删除最后一个字符
				balance = balance.slice(0, -1)
				// console.log('更新后的balance',balance)
				this.keyboardInfo.balance = balance.toString()
			},
			
			// 添加支出||收入账单
			async addOneBill() {
				this.expendOrIncomeInfo.bill_amount = Math.round(this.keyboardInfo.balance * 100)
				this.expendOrIncomeInfo.bill_notes =this.keyboardInfo.notes
				await db.collection("mj-user-bills").add({
					...this.expendOrIncomeInfo
				})
				uni.switchTab({
					url:"/pages/index/index"
				})
				this.upDateUserAssetBalance()
			},
			// 更新用户资产金额   0  支出    1  收入
			async upDateUserAssetBalance() {
				let assetBalance = this.userAssets.find(item => item._id === this.expendOrIncomeInfo.asset_id).asset_balance
				assetBalance = Math.round(assetBalance * 100)  // 转换单位为分
				// console.log(assetBalance);
				if(this.expendOrIncomeInfo.bill_type === 0) {
					const asset_balance = assetBalance - this.expendOrIncomeInfo.bill_amount
					await db.collection("mj-user-assets").doc(this.expendOrIncomeInfo.asset_id).update({
						asset_balance
					})
				} else {
					const asset_balance = assetBalance + this.expendOrIncomeInfo.bill_amount
					await db.collection("mj-user-assets").doc(this.expendOrIncomeInfo.asset_id).update({
						asset_balance
					})
				}
				uni.$emit('updateAssetsList')
			},
			
			
			
			// 初始化相关方法         （可以封装）
			// 获取分类icon列表
			getCategoryIconList() {
				// 缓存中是否有分类-支出样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
				if(uni.getStorageSync('mj-category-style-for-expend')) {
					this.categoryIconListForExpend = uni.getStorageSync('mj-category-style-for-expend')
				} else {
					this.categoryIconListForExpend = ICONCONFIG.categoryIconListForExpend()
					uni.setStorage({
						key:'mj-category-style-for-expend',
						data: this.categoryIconListForExpend
					})
				}
				// 缓存中是否有分类-收入样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
				if(uni.getStorageSync('mj-category-style-for-income')) {
					this.categoryIconListForIncome = uni.getStorageSync('mj-category-style-for-income')
				} else {
					this.categoryIconListForIncome = ICONCONFIG.categoryIconListForIncome()
					uni.setStorage({
						key:'mj-category-style-for-income',
						data: this.categoryIconListForIncome
					})
				}
			},
			getAssetsStyle() {
				// 缓存中是否有资产样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
				if(uni.getStorageSync('mj-assets-style')) {
					this.assetsStyle = uni.getStorageSync('mj-assets-style')
				} else {
					this.assetsStyle = ICONCONFIG.assetIconList()
					uni.setStorage({
						key:'mj-assets-style',
						data: this.assetsStyle
					})
				}
			},
			// 给userAssets添加type值对应的assetStyle
			addAssetStyle() {
				this.userAssets.forEach(asset => {
					asset.assetStyle = this.assetsStyle.find(item => item.type == asset.asset_type)
				})
				// console.log('addAssetStyle',this.assets);
			}
		},
		onLoad() {
			// 获取分类列表，该用户所有资产信息，将用户资产信息添加对应资产icon样式
			this.getCategoryIconList()
			this.userAssets = uni.getStorageSync('mj-user-assets')
			this.currentAssetTitle = this.userAssets[0].asset_name
			this.expendOrIncomeInfo.asset_id = this.userAssets[0]._id
			this.getAssetsStyle()
			this.addAssetStyle()
			console.log(this.userAssets);
		},
		computed: {
			bill_type: {
				get() {
					return this.expendOrIncomeInfo.bill_type
				},
				set(value) {
					this.expendOrIncomeInfo.bill_type = value
				}
			},
			category_type: {
				get() {
					return this.expendOrIncomeInfo.category_type
				},
				set(value) {
					this.expendOrIncomeInfo.category_type = value
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.keep-accounts {
		.header-tabs {
			position: fixed;
			top: 0;
			width: 100%;
			height: 80rpx;
			background-color: $mj-theme-color;
			display: flex;
			justify-content: center;
			z-index: 99;
		}

		.icon-grid {
			box-sizing: border-box;
			padding: 48rpx;
			margin-top: 80rpx;
			margin-bottom: 568rpx;
			.content {
				padding-bottom: 14px;

				.grid-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 148rpx;
					height: 124rpx;
					color: $mj-text-color;
					.icon {
						width: 80rpx;
						height: 80rpx;
						background-color: #f1f1f1;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.grid-text {
						font-size: 28rpx;
					}
				}
			}
			.transfer-accounts {
				.asset-card {
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #f1f1f1;
					border-radius: 20px;
					height: 80rpx;
					box-sizing: border-box;
					padding: 0 20px;
					margin-bottom: 32rpx;
					.left {
						display: flex;
						justify-content: start;
						align-items: center;
						.left-icon {
							margin-right: 10px;
						}
					}
				}
			}
		}
		.user-assets-list {
			min-height: 750rpx;
			max-height: 1200rpx;
			box-sizing: border-box;
			padding: 10px;
			background-color: $mj-bg-color;
			overflow: hidden;
			border-radius: 20px;
			.top {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.add {
					color: #fff;
					background-color: #2e3548;
					font-size: 24rpx;
					box-sizing: border-box;
					padding: 4px 8px;
					border-radius: 12px;
				}
			}
		}
		.mj-keyboard {
			.fixed {
				position: fixed;
				bottom: 424rpx;
				left: 0;
				right: 0;
				.tags {
					display: flex;
					justify-content: start;
					background-color: $mj-bg-color;
					padding: 4px 0;
					.item {
						margin-right: 20rpx;
						display: flex;
						justify-content: start;
						align-items: center;
						box-sizing: border-box;
						padding: 12rpx;
						border-radius: 36rpx;
						background-color: #f1f1f1;
						font-size: 24rpx;
					}
					// 父级选择器 & 可以选中当前的父元素
					&:first-child {
						margin-left: 20rpx;
					}
				}
				.bgc {
					background-color: #fff;
					border-top: 1px solid #f3f3f3;
					// margin-top: 8rpx;
					.header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.textarea {
							min-width: 430rpx;
						}
						.num {
							max-width: 320rpx;
							text-align: right;
							color: #dd524d;
							font-size: 36rpx;
							font-weight: 700;
						}
					}
				}
			}
		}
	}
</style>