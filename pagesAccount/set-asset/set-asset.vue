<template>
	<view class="set-asset">
		<u--form :model="assetInfo" :borderBottom="false" ref="uForm" errorType="toast">
			<mj-card title="资产类型">
				<u-cell-group :border="false">
					<u-cell :icon="asset.icon" :title="asset.title" :border="false"></u-cell>
				</u-cell-group>
			</mj-card>
			<mj-card title="基本信息">
				<u-form-item prop="assetName" :borderBottom="false">
					<u--input v-model="assetInfo.assetName" placeholder="资产名(可选)" type="text" border="surround"
						clearable shape="circle" fontSize="13px"></u--input>
				</u-form-item>
				<u-form-item prop="balance" :borderBottom="false">
					<u--input v-model="assetInfo.balance" placeholder="账户余额" type="digit" border="surround" clearable
						shape="circle" maxlength="10" fontSize="13px" suffixIcon="rmb-circle"
						suffixIconStyle="color: #909399"></u--input>
				</u-form-item>
			</mj-card>
			<mj-card title="其他">
				<view class="other">
					<view class="other-font">
						<view class="top">
							在资产页面隐藏此资产
						</view>
						<view class="bottom">
							隐藏资产可在资产主页底部查看
						</view>
					</view>
					<u-form-item :borderBottom="false">
						<u-switch v-model="assetInfo.isHideInAssetPage" activeColor="#9fcba7"></u-switch>
					</u-form-item>
				</view>
				<view class="other" :style="isHideTotalAssetsBox ? 'display: none;' : '' ">
					<view class="other-font">
						<view class="top">
							计入总资产
						</view>
						<view class="bottom">
							是否加入总资产计算
						</view>
					</view>
					<u-form-item :borderBottom="false">
						<u-switch v-model="assetInfo.isIncludedInTotalAssets" activeColor="#9fcba7"></u-switch>
					</u-form-item>
				</view>
			</mj-card>
		</u--form>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn">
			<u-button text="保存" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	import colorGradient from '../../uni_modules/uview-ui/libs/function/colorGradient';
	const db = uniCloud.database()
	
	export default {
		data() {
			return {
				type: '',
				// 表单信息
				assetInfo: {
					assetName: '',
					balance: '',
					isHideInAssetPage: false,
					isIncludedInTotalAssets: true,
					assetType: '',
				},
				// 所有资产的数据
				assets: [{
					icon: 'zhifubao',
					title: '支付宝',
					type: 'zhifubao'
				}, {
					icon: 'weixin-fill',
					title: '微信钱包',
					type: 'weixin'
				}],
				// 用户选择的资产，渲染页面用的数据
				asset: {},
				isHideTotalAssetsBox: false,
				rules: {
					'assetName': {
						type: 'string',
						required: false,
						trigger: ['blur']
					},
					'balance': [
						{
							type: 'float',
							required: true,
							message: '请输入金额',
							trigger: ['blur', 'change'],
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.amount(value)
							},
							message: '请勿以0开头，最多填写两位小数。如果金额设置为0，请填入0.00'
						},
					]
				},
			};
		},
		onLoad( {type} ) {
			this.type = type
			const arr = this.assets.filter(item => {
				return item.type == type
			})
			this.asset = arr[0]
			this.assetInfo.assetType = arr[0].type
			console.log('asset', this.asset);
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			clickBottomBtn() {
				// 1 验证表单  用户名可选， 金额必填，不能为空，可有两位小数num 类型。
				// 2 如果校验通过 ， 获取表单数据 即assetInfo中的数据
				// 3 整合账户数据  上传至数据库  （资产类型、资产金额：单位为分、是否隐藏、是否计入总资产、资产名（可选））
				
				this.$refs.uForm.validate().then(async () => {
					let userAsset = Object.assign({},this.assetInfo)
					userAsset.balance = userAsset.balance * 100  // 单位改为分
					const res = await db.collection("mj-user-assets").add({
						"asset_type": userAsset.assetType,
						"asset_balance": userAsset.balance,
						"hide_in_interface": userAsset.isHideInAssetPage,
						"include_in_total_assets": userAsset.isIncludedInTotalAssets,
						"asset_name": userAsset.assetName
					})
					uni.navigateBack({delta: 2})
				}).catch(errors => {
					console.log(errors);
					uni.$u.toast(errors[0].message)
				})

			}
		},
		watch: {
			// 监听账单信息中 是否隐藏资产 的switch布尔值
			assetInfo: {
				handler: function({
					isHideInAssetPage
				}) {
					// 如果为true，则隐藏计入总资产一行，并修改 计入总资产的switch为false
					if (isHideInAssetPage) {
						this.isHideTotalAssetsBox = true
						this.assetInfo.isIncludedInTotalAssets = false
					} else {
						this.isHideTotalAssetsBox = false
					}
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.set-asset {
		.other {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.other-font {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				font-size: 28rpx;

				.bottom {
					color: $mj-text-color-grey;
					font-size: 24rpx;
				}
			}
		}

		.bottom-btn {
			box-sizing: border-box;
			z-index: 999;
			position: fixed;
			width: 100%;
			padding: 0 24rpx 12rpx;
			bottom: 12px;
			opacity: 0.98;
		}
	}
</style>