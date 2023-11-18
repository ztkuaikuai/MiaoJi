<template>
	<view class="keep-accounts">
		<view class="header-tabs">
			<view class="tabs"><u-tabs ref="tabs" :list="tabList" @click="clickTab" lineColor="#2e3548" :itemStyle="{ height: '76rpx' }"></u-tabs></view>
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
				<!-- 转出账户 -->
				<view class="asset-card" @click="chooseTransferAsset(0)">
					<view class="left">
						<view class="left-icon">
							<uni-icons type="wallet" color="#6d6d6d" size="40rpx"></uni-icons>
						</view>
						<view class="asset-type" :style="transferOutAssetStyle.title ? '' : 'color: #6d6d6d;'" >
							{{transferOutAssetStyle.asset_name || transferOutAssetStyle.title  || '转出账户'}}
						</view>
					</view>
					<view class="asset-icon" v-show="transferOutAssetStyle">
						<uni-icons :type="transferOutAssetStyle.icon" :color="transferOutAssetStyle.color" customPrefix="miaoji"></uni-icons>
					</view>
				</view>
				<!-- 转入账户 -->
				<view class="asset-card" @click="chooseTransferAsset(1)">
					<view class="left">
						<view class="left-icon">
							<uni-icons type="wallet" color="#6d6d6d" size="40rpx"></uni-icons>
						</view>
						<view class="asset-type" :style="transferIntoAssetStyle.title ? '' : 'color: #6d6d6d;'" >
							{{transferIntoAssetStyle.asset_name || transferIntoAssetStyle.title || '转入账户'}}
						</view>
					</view>
					<view class="asset-icon" v-show="transferIntoAssetStyle">
						<uni-icons :type="transferIntoAssetStyle.icon" :color="transferIntoAssetStyle.color" customPrefix="miaoji"></uni-icons>
					</view>
				</view>
				
				<view style="color: #6d6d6d;padding-left: 8rpx;font-size: 24rpx;">
					手续费——从转出账户转出的钱=转出金额+手续费
				</view>
				<u--form :model="transferInfo" :borderBottom="false" ref="uForm" errorType="toast">
					<u-form-item prop="serviceCharge" :borderBottom="false">
						<u--input v-model="transferInfo.serviceCharge" placeholder="手续费" placeholderStyle="color: #6d6d6d" type="digit" border="surround" clearable
							shape="circle" maxlength="8" fontSize="13px" :customStyle="inputStyle" prefixIcon="rmb-circle"
							prefixIconStyle="color: #6d6d6d"></u--input>
					</u-form-item>
				</u--form>
			</view>
		</view>
		<view class="mj-keyboard">
			<view class="fixed">
				<view class="tags">
					<view class="item" @click="chooseAsset" v-if="!showTransferAccounts">
						<view><uni-icons type="wallet" size="28rpx"></uni-icons></view>
						<view>{{currentAssetTitle}}</view>
					</view>
					<view class="item" @click="chooseDate" v-if="!isTemplate">
						<view><uni-icons type="calendar" size="28rpx"></uni-icons></view>
						<view>{{userChooseDate}}</view>
					</view>
					<view class="item" @click="chooseTemplate" v-if="!isTemplate">
						<view><uni-icons type="mj-layout" size="28rpx" customPrefix="miaoji"></uni-icons></view>
						<view>模板</view>
					</view>
				</view>
				<view class="bgc">
					<view class="header">
						<view class="textarea">
							<u--textarea v-model="keyboardInfo.notes" placeholder="备注信息(最多输入60字)" autoHeight border="none" :fixed="true" maxlength="60"></u--textarea>
						</view>
						<view class="num" :style="bill_type === 1 ? 'color:#219a6d;' : ''" v-show="!showTransferAccounts">
							￥{{keyboardInfo.balance}}
						</view>
						<view class="num numForTransfer" v-show="showTransferAccounts">
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
						请选择账户
					</view>
				</view>
				<view class="content">
					<u-cell-group :border="false" >
						<u-cell :title="asset.asset_name ? asset.asset_name : asset.assetStyle.title" :clickable="true" @click="clickOneAsset(asset)" v-for="asset in userAssets" :key="asset._id" >
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
		
		<!-- 模板的popup -->
		<u-popup :show="showTemplate" @close="showTemplate = false" round="20px" zIndex="10076">
			<view class="user-template-list">
				<view class="header">
					<view class="left">
						占位
					</view>
					<view class="middle">
						帐单模板
					</view>
					<view class="right" @click="goTemplatePage">
						添加
					</view>
				</view>
				<view class="template-list">
					<mj-bill-template :templateList="templateList" @updateList="getUserTemplate" pageType="account" @getTemp="getTemp"></mj-bill-template>
				</view> 
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { getCategoryIconListForExpend, getCategoryIconListForIncome, getAssetsStyle } from "@/utils/icon-config.js";
	import { throttle } from '@/utils/throttle.js'
	const db = uniCloud.database()
	export default {
		data() {
			return {
				pageType: 'add', // 页面类型，默认为添加； 还有 edit：编辑；template：添加模板；templateEdit：编辑模板；
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
				// 转出转入账户的渲染样式
				transferOutAssetStyle: {},
				transferIntoAssetStyle: {},
				// 转账页用户点击的账户，用于clickOneAsset方法判断。 0 转出账户   1 转入账户
				userClickAsset: 0,
				rules: {
					'serviceCharge': [
						{
							type: 'number',
							message: '请输入数字金额'
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.amount(value)
							},
							message: '手续费格式有误，最多填写两位小数'
						},
					]
				},
				isSetRules: false,
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
					bill_date: Date.now(),
					bill_notes: '',
					transfer_amount: 0.00,  //转账金额
					destination_asset_id: ''  // 转入资产id
				},
				// 转账页手续费
				transferInfo: {
					serviceCharge: 0.00
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
				currentAssetTitle: '未选择资产',// 默认为用户第一个资产
				
				// 修改账单相关数据
				// 账单的初始数据
				editInitBill: {},
				isEdit: false,
				
				// 模板管理相关数据
				showTemplate: false,
				isTemplate: false,
				isTemplateEdit: false,
				templateEditId: '',
				templateList: [],
				// 再记标识
				isAddAgain: false,
				// 保存按钮触发函数：使用节流
				throttleTapSaveBtn: throttle(this.tapSaveBtn, 5000),
				// 再记按钮触发函数：使用节流
				throttleAddAgain: throttle(this.addAgain, 50000)
			};
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
		},
		onLoad({type,tab}) {
			this.pageType = type ?? 'add'
			this.initPage()
			this.initEditPage(type,tab)
		},
		onShow() {
			this.getUserTemplate()
		},
		methods: {
			// 初始化相关方法
			initPage() {
				// 获取分类列表，该用户所有资产信息，将用户资产信息添加对应资产icon样式
				this.categoryIconListForExpend = getCategoryIconListForExpend()
				this.categoryIconListForIncome = getCategoryIconListForIncome()
				this.userAssets = uni.getStorageSync('mj-user-assets')
				this.expendOrIncomeInfo.asset_id = this.userAssets.filter(asset => asset.default_asset === true)[0]?._id ?? ''
				this.assetsStyle = getAssetsStyle()
				this.addAssetStyle()
				const currentAsset = this.userAssets.filter(asset => asset.default_asset === true)
				this.currentAssetTitle = currentAsset[0]?.asset_name || currentAsset[0]?.assetStyle.title || '未选择资产'
				// console.log('onLoad,initPage:用户资产列表',this.userAssets);
				// 获取用户模板列表
				this.getUserTemplate()
			},
			// 给userAssets添加type值对应的assetStyle
			addAssetStyle() {
				this.userAssets.forEach(asset => {
					asset.assetStyle = this.assetsStyle.find(item => item.type == asset.asset_type)
				})
				// console.log('addAssetStyle',this.assets);
			},
			// 编辑账单||编辑模板 初始化
			initEditPage(type,tab) {
				if(type === 'edit') {
					// 赋值账单初始数据
					this.editInitBill = uni.getStorageSync('mj-bill-edit')
					this.isEdit = true
					uni.removeStorage({
						key: 'mj-bill-edit',
						success: () => {}
					})
					// 触发clickTab事件，index为tab
					this.$refs.tabs.clickHandler({},tab)
					
					if(tab != 2) {
						// 如果为收入 || 支出
						// 修改左下资产标题
						this.currentAssetTitle =  this.editInitBill.asset_id[0].asset_name || this.editInitBill.assetStyle?.title || '未选择资产'
					} else {
						// 如果为转账，获取转出账户的资产名
						this.transferOutAssetStyle = {asset_name: this.editInitBill.asset_id[0].asset_name}
					}
					// 清洗editInitBill的asset_id和destination_asset_id，使其从array => string
					this.editInitBill.asset_id = this.editInitBill.asset_id[0]?._id ?? ''
					this.editInitBill.destination_asset_id = this.editInitBill.destination_asset_id[0]?._id ?? ''
					// 修改transfer_amount的单位
					this.editInitBill.transfer_amount ? this.editInitBill.transfer_amount /= 100 : ''
					// console.log('editInitBill',this.editInitBill);
					// 修改keyboard的数据
					// 修改日期事件
					this.userChooseDate = uni.$u.timeFormat(this.editInitBill.bill_date, 'mm月dd日')
					// 修改备注
					this.keyboardInfo.notes = this.editInitBill.bill_notes
					if(tab != 2) {
						// 如果是支出 和 收入 ，存入支出||收入表单信息
						this.expendOrIncomeInfo = uni.$u.deepClone(this.editInitBill)
						// 修改keyboard金额
						this.keyboardInfo.balance = this.editInitBill.bill_amount.toFixed(2)
						// 高亮选择的icon
						if(tab == 0) {
							this.currentExpendIndex = this.categoryIconListForExpend.findIndex(item => item.type === this.editInitBill.billStyle.type)
						} else {
							this.currentIncomeIndex = this.categoryIconListForIncome.findIndex(item => item.type === this.editInitBill.billStyle.type)
						}
					} else {
						// 如果是转账，存入转账表单信息
						this.transferAccountInfo = uni.$u.deepClone(this.editInitBill)
						this.keyboardInfo.balance = this.editInitBill.transfer_amount.toFixed(2)
						// 修改转账信息，只拿到了转出的资产信息
						this.transferOutAssetStyle = Object.assign(this.transferOutAssetStyle, this.editInitBill.assetStyle)
						// 将表单中转入账户id清空
						this.transferAccountInfo.destination_asset_id = ''
					}
				}
				if(type === 'template' || type === 'templateEdit') {
					// 如果是添加或修改模板
					// 标记为 模板页面
					this.isTemplate = true
					if(type === 'templateEdit') {
						// 修改模板
						this.isTemplateEdit = true
						const temp = uni.getStorageSync('mj-user-temp-template')
						// 设置编辑模板的id
						this.templateEditId = temp._id
						this.getTemp(temp)
						// 删除缓存的数据
						uni.removeStorage({
							key: 'mj-user-temp-template',
							success: () => {}
						})
					}
				}
			},
			clickTab({index}) {  // 0 支出  1 收入  2 转账
				// 如果点击的是当前所在tab,return
				if(this.currentTabIndex === index) return
				const tabs = [
					{ showExpend: true, showIncome: false, showTransferAccounts: false, bill_type : 0, category_type : 'dining', currentIncomeIndex: 0},
					{ showExpend: false, showIncome: true, showTransferAccounts: false, bill_type : 1, category_type : 'primary-income', currentExpendIndex: 0},
					{ showExpend: false, showIncome: false, showTransferAccounts: true, isSetRules: false},
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
			// 用户选择转入转出账户
			chooseTransferAsset(index) {
				this.userClickAsset = index
				this.showUserAssetsList = true
			},
			// 点击设置资产popup中的某一个资产
			clickOneAsset(asset) {
				// console.log('点击了资产列表',asset);
				// 1 隐藏pop框
				// 2 如果是 支出||收入 拿到资产id赋值给表单的 asset_id； 拿到assetStyle中title 渲染
				// 3 如果是转账， 用户点击转出账户，拿到资产id赋值给转账页表单的asset_id，拿到assetStyle渲染
				// 4 如果是转账， 用户点击转入账户，拿到资产id赋值给转账也表单的destination_asset_id，拿到assetStyle渲染
				this.showUserAssetsList = false
				if(this.showTransferAccounts) {
					if(!this.userClickAsset) {
						// 如果是转出
						this.transferAccountInfo.asset_id = asset._id
						this.transferOutAssetStyle = {...asset.assetStyle, asset_name: asset.asset_name}
					} else {
						this.transferAccountInfo.destination_asset_id = asset._id
						this.transferIntoAssetStyle = {...asset.assetStyle, asset_name: asset.asset_name}
					}
					return
				}
				this.expendOrIncomeInfo.asset_id = asset._id
				this.currentAssetTitle = asset.asset_name || asset.assetStyle.title
				// console.log(this.expendOrIncomeInfo);
			},
			
			
			
			// keyboard 相关方法
			
			chooseAsset() {
				this.showUserAssetsList = true
			},
			chooseDate() {
				this.showDatetimePicker = true
			},
			chooseTemplate() {
				this.showTemplate = true
				// 发起请求获取用户的模板列表数据
			},
			// 用户选择的日期，返回值为时间戳（毫秒）
			getBillDate({value}) {
				this.showDatetimePicker = false
				// 1 用户选择日期点击确定
				// 2 不管是什么页面，时间戳同时赋值给相应表单的bill_date
				// 3 格式化时间  x月x日，赋值给 userChooseDate
				this.expendOrIncomeInfo.bill_date = value
				this.transferAccountInfo.bill_date = value
				this.userChooseDate = uni.$u.timeFormat(value, 'mm月dd日')
			},
			// keyboard被点击（不包含退格键） e:用户在键盘点击的字符
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
					// 使用节流，防止用户持续点击导致的重复增加账单
					this.throttleTapSaveBtn()
				} else if (e === '再记') {
					// 再记：保存数据，上传数据库，更新资产缓存，并跳转到新的记一笔页面
					this.throttleAddAgain()
					return
				} else if (e === '.') {
					if(balance.indexOf('.') !== -1) return // 如果含有 .  return
					balance += e
				} else if (e === '秒记1' || e === '秒记2') {
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
			// 用户点击再记触发
			addAgain() {
				if(this.pageType !== 'add') {
					uni.showToast({title:"“再记”只可以在添加账单时使用",icon: 'none'})
					return
				}
				uni.showLoading({
					title: '生成账单中',
					mask: true
				})
				this.isAddAgain = true
				this.tapSaveBtn()
			},
			// 用户点击保存按钮触发  判断类型，并触发相应逻辑
			tapSaveBtn() {
				if(!uni.$u.test.amount(this.keyboardInfo.balance)) return
				if(this.isTemplate) {
					// 如果是添加或编辑模板
					if(this.isTemplateEdit) {
						// 如果是编辑模板
						// 通过模板id删除之前的模板
						db.collection('mj-user-templates').doc(this.templateEditId).remove()
					}
					// 添加新模板
					this.addOneTemplate()
					return
				}
				if(this.isEdit) {
					// 如果是编辑账单
					// console.log('editInitBill',this.editInitBill);
					// console.log('transferAccountInfo',this.transferAccountInfo);
					// console.log('expendOrIncomeInfo',this.expendOrIncomeInfo);
					this.updateUserBill()
					return
				}
				if(this.showTransferAccounts) {
					this.addOneTransfer()
					return
				}
				this.addOneBill()
			},
			// 添加支出||收入账单
			async addOneBill() {
				// 金额不能为0
				if(Number(this.keyboardInfo.balance) === 0) {
					uni.showToast({
						title:"请填写金额",
						icon:"none"
					})
					return
				}
				if(!this.expendOrIncomeInfo.asset_id) {
					uni.showToast({
						title:"请选择资产",
						icon:"none"
					})
					return
				}
				this.expendOrIncomeInfo.bill_amount = Math.round(this.keyboardInfo.balance * 100)
				this.expendOrIncomeInfo.bill_notes = this.keyboardInfo.notes
				await db.collection("mj-user-bills").add({
					...this.expendOrIncomeInfo
				})
				// 如果为再记
				if(this.isAddAgain) {
					await this.upDateUserAssetBalance()
					// 更新资产缓存
					await this.getUserAssets()
					uni.reLaunch({
						url:'/pagesAccount/make-an-account/make-an-account'
					})
					return
				}
				uni.switchTab({
					url:"/pages/index/index"
				})
				this.upDateUserAssetBalance()
			},
			
			// 添加转账账单
			// 1 验证手续费格式
			// 2 验证转出转入账户是否都存在，并且不相同
			// 3 存入bill_amount，存入keyboard信息，金额不准为0
			async addOneTransfer() {
				// 表单验证失败返回false，成功返回true
				const flag = await this.validatorTransferInfo()
				if(!flag) return
				this.transferAccountInfo.bill_amount = Math.round(this.transferInfo.serviceCharge * 100)
				this.transferAccountInfo.bill_notes = this.keyboardInfo.notes
				this.transferAccountInfo.transfer_amount = Math.round(this.keyboardInfo.balance * 100)
				// 组合备注
				const transferOutAsset = this.userAssets.find(item => item._id === this.transferAccountInfo.asset_id)
				const transferOutTitle = transferOutAsset.asset_name || transferOutAsset.assetStyle.title
				const transferInAsset = this.userAssets.find(item => item._id === this.transferAccountInfo.destination_asset_id)
				const transferInTitle = transferInAsset.asset_name || transferInAsset.assetStyle.title
				this.transferAccountInfo.bill_notes = `${this.transferAccountInfo.bill_notes + '-'}${transferOutTitle}转出至${transferInTitle},手续费${this.transferAccountInfo.bill_amount / 100}元`
				// console.log('数据整理完毕，准备存入数据库',this.transferAccountInfo);
				await db.collection("mj-user-bills").add({...this.transferAccountInfo})
				// 如果为再记
				if(this.isAddAgain) {
					await this.upDateUserTwoAssetBalance()
					// 更新资产缓存
					await this.getUserAssets()
					uni.reLaunch({
						url:'/pagesAccount/make-an-account/make-an-account'
					})
					return
				}
				uni.switchTab({
					url:"/pages/index/index"
				})
				this.upDateUserTwoAssetBalance()
			},
			// 转账账单表单验证
			async validatorTransferInfo() {
				if(!this.isSetRules) {
					this.$refs.uForm.setRules(this.rules)
					this.isSetRules = true
				}
				let flag = false
				// 如果手续费是0 不走验证，如果是其他，走验证
				this.transferInfo.serviceCharge == 0 ? '' : flag = true
				if(flag) {
					// 验证成功则继续执行，验证失败中断执行
					try{
						await this.$refs.uForm.validate()
					}catch(e){
						return false
					}
				} 
				if(!this.transferAccountInfo.asset_id || !this.transferAccountInfo.destination_asset_id) {
					// console.log('有资产没填');
					uni.showToast({
						title:"请填入账户",
						icon:"none"
					})
					return false
				}
				if(this.transferAccountInfo.asset_id === this.transferAccountInfo.destination_asset_id) {
					uni.showToast({
						title:"存在相同账户",
						icon:"none"
					})
					return false
				}
				if(Number(this.keyboardInfo.balance) === 0) {
					uni.showToast({
						title:"请填写转账金额",
						icon:"none"
					})
					return false
				}
				return true
			},
			
			
			// 更新用户资产金额   0  支出    1  收入
			async upDateUserAssetBalance() {
				let assetBalance = this.userAssets.find(item => item._id === this.expendOrIncomeInfo.asset_id).asset_balance
				assetBalance = Math.round(assetBalance * 100)  // 转换单位为分
				// console.log(assetBalance);
				console.log('bill_type',this.expendOrIncomeInfo.bill_type);
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
				uni.$emit('updateBillsList')
				uni.$emit('updateMonthlyBillBalance')
				if(!this.isAddAgain) {
					// 如果不是再记，则更新用户资产，并更新缓存
					uni.$emit('updateAssetsList')
				}
			},
			// 更新用户 转出与转入 资产金额
			async upDateUserTwoAssetBalance() {
				let transferOutAssetBalance = this.userAssets.find(item => item._id === this.transferAccountInfo.asset_id).asset_balance
				let transferIntoAssetBalance = this.userAssets.find(item => item._id === this.transferAccountInfo.destination_asset_id).asset_balance
				
				transferOutAssetBalance = Math.round(transferOutAssetBalance * 100)  // 转换单位为分
				transferIntoAssetBalance = Math.round(transferIntoAssetBalance * 100)  // 转换单位为分
				// 转出资产余额 = 转出资产余额 - 手续费 - 转账金额  注意单位为分
				transferOutAssetBalance = transferOutAssetBalance - this.transferAccountInfo.bill_amount - this.transferAccountInfo.transfer_amount
				// 转入资产余额 = 转入资产余额 + 转账金额
				transferIntoAssetBalance = transferIntoAssetBalance + this.transferAccountInfo.transfer_amount
				// 更新
				await db.collection("mj-user-assets").doc(this.transferAccountInfo.asset_id).update({
					asset_balance: transferOutAssetBalance
				})
				await db.collection("mj-user-assets").doc(this.transferAccountInfo.destination_asset_id).update({
					asset_balance: transferIntoAssetBalance
				})
				uni.$emit('updateBillsList')
				uni.$emit('updateMonthlyBillBalance')
				uni.$emit('updateAssetsList')
			},
			
			
			// 编辑账单相关方法
			// 更新用户账单bill
			async updateUserBill() {
				// 1 判断用户支出||收入||转账
				// 2 进行表单验证
				// 3 验证通过，更新bill，并更新资产
				if(this.showTransferAccounts) {
					// 类型为转账
					// 验证资产id对应的资产是否存在（未被用户删除）
					const hasAsset = this.userAssets.find(item => item._id === this.transferAccountInfo.asset_id) ?? 'none'
					if(hasAsset === 'none') {
						uni.showToast({
							title:"请更新资产",
							icon:"none"
						})
						return
					}
					// 表单验证失败返回false，成功返回true
					const flag = await this.validatorTransferInfo()
					if(!flag) return
					this.transferAccountInfo.bill_amount = Math.round(this.transferInfo.serviceCharge * 100)
					this.transferAccountInfo.bill_notes = this.keyboardInfo.notes
					this.transferAccountInfo.transfer_amount = Math.round(this.keyboardInfo.balance * 100)
					// console.log('数据整理完毕，准备更新数据库',this.transferAccountInfo);
					await db.collection("mj-user-bills").doc(this.editInitBill._id).update({
						asset_id: this.transferAccountInfo.asset_id,
						bill_amount: this.transferAccountInfo.bill_amount,
						bill_date: this.transferAccountInfo.bill_date,
						bill_notes: this.transferAccountInfo.bill_notes,
						bill_type: 2,
						category_type: 'transfer',
						destination_asset_id: this.transferAccountInfo.destination_asset_id,
						transfer_amount: this.transferAccountInfo.transfer_amount
					})
					// 返还资金模块
					// console.log('返还资金模块');
					await this.updateInitAssetsBalance()
					// 更新金额模块
					await this.upDateUserTwoAssetBalance()
				} else {
					// 类型为支出 || 收入
					// 验证资产id对应的资产是否存在（未被用户删除）
					const hasAsset = this.userAssets.find(item => item._id === this.expendOrIncomeInfo.asset_id) ?? 'none'
					if(hasAsset === 'none') {
						uni.showToast({
							title:"请更新资产",
							icon:"none"
						})
						return
					}
					// 金额不能为0
					if(Number(this.keyboardInfo.balance) === 0) {
						uni.showToast({
							title:"请填写金额",
							icon:"none"
						})
						return
					}
					this.expendOrIncomeInfo.bill_amount = Math.round(this.keyboardInfo.balance * 100)
					this.expendOrIncomeInfo.bill_notes =this.keyboardInfo.notes
					await db.collection("mj-user-bills").doc(this.editInitBill._id).update({
						asset_id: this.expendOrIncomeInfo.asset_id,
						bill_amount: this.expendOrIncomeInfo.bill_amount,
						bill_date: this.expendOrIncomeInfo.bill_date,
						bill_notes: this.expendOrIncomeInfo.bill_notes,
						bill_type: this.expendOrIncomeInfo.bill_type,
						category_type: this.expendOrIncomeInfo.category_type,
						transfer_amount: 0
					})
					
					// 返还资产金额模块
					console.log('返还资金模块');
					await this.updateInitAssetsBalance()
					// 更新资产金额模块
					await this.upDateUserAssetBalance()
				}
				uni.switchTab({
					url:"/pages/index/index"
				})
			},
			// 返还用户初始资产金额  1 判断用户初始资产类型 0 支出 1 收入 2转账
			async updateInitAssetsBalance() {
				if(this.editInitBill.bill_type == 2) {
					// 返还 转入转出账户的余额
					let transferOutAssetBalance = this.userAssets.find(item => item._id === this.editInitBill.asset_id)?.asset_balance ?? 'none'
					let transferIntoAssetBalance = this.userAssets.find(item => item._id === this.editInitBill.destination_asset_id)?.asset_balance ?? 'none'
					console.log('transferIntoAssetBalance',transferIntoAssetBalance);
					// 转换单位为分
					const bill_amount = Math.round(this.editInitBill.bill_amount * 100)
					const transfer_amount = Math.round(this.editInitBill.transfer_amount * 100)
					
					// 返还规则：用户账单对应资产没有被用户删除时，进行返还，如果删除了，不返还
					if(transferOutAssetBalance !== 'none') {
						transferOutAssetBalance = Math.round(transferOutAssetBalance * 100)
						// 返还转出资产余额 = 转出资产余额 + 手续费 + 转账金额  注意单位为分
						transferOutAssetBalance = transferOutAssetBalance +bill_amount + transfer_amount
						// 更新
						await db.collection("mj-user-assets").doc(this.editInitBill.asset_id).update({
							asset_balance: transferOutAssetBalance
						})
						console.log("返还转出账户");
						// 单位为元  更新用户资产列表的对应资产金额，以便后续 更新用户资产计算金额使用
						this.userAssets.find(item => item._id === this.editInitBill.asset_id).asset_balance += this.editInitBill.bill_amount + this.editInitBill.transfer_amount
					}
					if(transferIntoAssetBalance !== 'none') {
						transferIntoAssetBalance = Math.round(transferIntoAssetBalance * 100)
						// 返还转入资产余额 = 转入资产余额 - 转账金额
						transferIntoAssetBalance = transferIntoAssetBalance - transfer_amount
						await db.collection("mj-user-assets").doc(this.editInitBill.destination_asset_id).update({
							asset_balance: transferIntoAssetBalance
						})
						console.log("返还转入账户");
						this.userAssets.find(item => item._id === this.editInitBill.destination_asset_id).asset_balance -= this.editInitBill.transfer_amount
					}
					
				} else {
					// 返还 账户的余额
					// 如果初始bill中资产id找不到 为none，则不用返还
					let assetBalance = this.userAssets.find(item => item._id === this.editInitBill.asset_id)?.asset_balance ?? 'none'
					if(assetBalance === 'none') return
					console.log("返还");
					assetBalance = Math.round(assetBalance * 100)  // 转换单位为分
					const bill_amount = Math.round(this.editInitBill.bill_amount * 100)
					if(this.editInitBill.bill_type == 0) {
						const asset_balance = assetBalance + bill_amount
						await db.collection("mj-user-assets").doc(this.editInitBill.asset_id).update({
							asset_balance
						})
						// 单位为元  更新用户资产列表的对应资产金额，以便后续 更新用户资产计算金额使用
						this.userAssets.find(item => item._id === this.editInitBill.asset_id).asset_balance += this.editInitBill.bill_amount
					} else {
						const asset_balance = assetBalance - bill_amount
						await db.collection("mj-user-assets").doc(this.editInitBill.asset_id).update({
							asset_balance
						})
						// 单位为元
						this.userAssets.find(item => item._id === this.editInitBill.asset_id).asset_balance -= this.editInitBill.bill_amount
					}
				}
			},
			
			// 添加模板相关方法
			async addOneTemplate() {
				// 1 判断用户支出||收入||转账
				// 2 进行表单验证
				// 3 验证通过，保存模板，并回到上一页
				if(!this.showTransferAccounts) {
					// 类型为支出||收入
					// 金额不能为0
					if(Number(this.keyboardInfo.balance) === 0) {
						uni.showToast({
							title:"请填写金额",
							icon:"none"
						})
						return
					}
					if(!this.expendOrIncomeInfo.asset_id) {
						uni.showToast({
							title:"请选择资产",
							icon:"none"
						})
						return
					}
					this.expendOrIncomeInfo.bill_amount = Math.round(this.keyboardInfo.balance * 100)
					this.expendOrIncomeInfo.bill_notes = this.keyboardInfo.notes
					const {asset_id,bill_amount,bill_notes,bill_type,category_type} = this.expendOrIncomeInfo
					await db.collection("mj-user-templates").add({
						asset_id,bill_amount,bill_notes,bill_type,category_type
					})
					uni.navigateBack()
				} else {
					// 类型为转账
					// 添加转账账单
					// 1 验证手续费格式
					// 2 验证转出转入账户是否都存在，并且不相同
					// 3 存入bill_amount，存入keyboard信息，金额不准为0
					// 表单验证失败返回false，成功返回true
					const flag = await this.validatorTransferInfo()
					if(!flag) return
					this.transferAccountInfo.bill_amount = Math.round(this.transferInfo.serviceCharge * 100)
					this.transferAccountInfo.bill_notes = this.keyboardInfo.notes
					this.transferAccountInfo.transfer_amount = Math.round(this.keyboardInfo.balance * 100)
					// 组合备注
					const transferOutAsset = this.userAssets.find(item => item._id === this.transferAccountInfo.asset_id)
					const transferOutTitle = transferOutAsset.asset_name || transferOutAsset.assetStyle.title
					const transferInAsset = this.userAssets.find(item => item._id === this.transferAccountInfo.destination_asset_id)
					const transferInTitle = transferInAsset.asset_name || transferInAsset.assetStyle.title
					this.transferAccountInfo.bill_notes = `${this.transferAccountInfo.bill_notes + '-'}${transferOutTitle}转出至${transferInTitle},手续费${this.transferAccountInfo.bill_amount / 100}元`
					// console.log('数据整理完毕，准备存入数据库',this.transferAccountInfo);
					const {asset_id,bill_amount,bill_notes,bill_type,category_type,destination_asset_id,transfer_amount} = this.transferAccountInfo
					await db.collection("mj-user-templates").add({asset_id, bill_amount, bill_type, category_type, destination_asset_id, transfer_amount, bill_notes})
					uni.navigateBack()
				}
			},
			// 点击添加模板按钮
			goTemplatePage() {
				uni.navigateTo({
					url: `/pagesAccount/make-an-account/make-an-account?type=template`
				})
				this.showTemplate = false
			},
			// 获取用户的模板
			async getUserTemplate() {
				const temp = db.collection('mj-user-templates').where('user_id == $cloudEnv_uid').orderBy('template_creation_date desc').getTemp()
				const userAssets = db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').field('_id,asset_type,user_id,asset_name').getTemp()
				const res = await db.collection(temp, userAssets).get()
				this.templateList = res.result.data
			},
			// 点击模板卡片||编辑模板 触发，获取用户点击的模板数据，并赋值
			getTemp(temp) {
				console.log('temp: ',temp);
				const {bill_type, category_type, bill_notes, bill_amount, asset_id, hasAsset, transfer_amount, hasDestinationAsset, destination_asset_id} = temp
				this.clickTab({index: bill_type})
				if(bill_type !== 2) {
					// 支出||收入模板
					// 账单类型
					this.expendOrIncomeInfo.bill_type = bill_type
					// 分类
					this.expendOrIncomeInfo.category_type = category_type
					if(bill_type === 0) {
						const index = this.categoryIconListForExpend.findIndex(item => item.type === category_type)
						this.currentExpendIndex = index
					} else {
						const index = this.categoryIconListForIncome.findIndex(item => item.type === category_type)
						this.currentIncomeIndex = index
					}
					// 备注
					this.keyboardInfo.notes = bill_notes
					// 金额
					this.keyboardInfo.balance = bill_amount.toString()
					// 资产
					if(hasAsset) {
						this.expendOrIncomeInfo.asset_id = asset_id[0]._id
						this.currentAssetTitle = asset_id[0].asset_name || temp.assetStyle.title
					} else {
						this.expendOrIncomeInfo.asset_id = ''
						this.currentAssetTitle = '资产已删除'
					}
				} else {
					// 转账模板
					// 账单类型和分类类型不变
					// 备注 只截取 - 前面的值
					const regex = /^([^-\n]+)/
					const match = regex.exec(bill_notes)
					this.keyboardInfo.notes = match ? match[1] : ''
					// 金额
					this.keyboardInfo.balance = (transfer_amount / 100).toString()
					// 手续费
					this.transferInfo.serviceCharge = bill_amount
					// 转出账户
					if(hasAsset) {
						this.transferAccountInfo.asset_id = asset_id[0]._id
						this.transferOutAssetStyle = {...temp.assetStyle, asset_name: asset_id[0].asset_name}
					}
					if(hasDestinationAsset) {
						this.transferAccountInfo.destination_asset_id = destination_asset_id[0]._id
						this.transferIntoAssetStyle = {...temp.destinationAssetStyle, asset_name: destination_asset_id[0].asset_name}
					}
				}
				this.showTemplate = false
			},
			// 再记使用：更新用户资产列表，并存入缓存
			async getUserAssets() {
				// console.log("getUserAssets");
				const res = await db.collection("mj-user-assets").where(" user_id == $cloudEnv_uid ").get()
				const userAssetsTemp = res.result.data
				// 统一修改金额
				userAssetsTemp.forEach(item => item.asset_balance /= 100)
				// 保存在缓存中
				uni.setStorage({
					key:'mj-user-assets',
					data: userAssetsTemp
				})
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
					color: $mj-text-color;
					font-size: 24rpx;
					box-sizing: border-box;
					padding: 4px 8px;
					border-bottom: 2px solid $mj-theme-color;
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
							color: $mj-color-red;
							font-size: 36rpx;
							font-weight: 700;
						}
						.numForTransfer {
							color: $mj-text-color;
						}
					}
				}
			}
		}
		.user-template-list {
			
			.header {
				display: flex;
				justify-content: space-between;
				padding-top: 24rpx;
				.left {
					visibility: hidden;
					box-sizing: border-box;
					padding: 4px 8px;
					margin-left: 8px;
					background-color: $mj-theme-color;
					border-radius: 16px;
					font-size: 28rpx;
					color: $mj-bg-color;
				}
				.middle {
					text-align: center;
					// scss中font另一种写法
					font: {
						size: 32rpx;
						weight: bold;
					}
				}
				.right {
					box-sizing: border-box;
					padding: 4px 8px;
					margin-right: 8px;
					background-color: $mj-theme-color;
					border-radius: 16px;
					font-size: 28rpx;
					color: $mj-bg-color;
				}
			}
			.template-list {
				max-height: 750rpx;
				overflow: auto;
			}
		}
	}
</style>