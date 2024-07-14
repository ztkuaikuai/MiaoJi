<template>
	<view class="my-assets">
		<view class="linear-gradient"></view>
		<mj-card title="净资产(元)——包含隐藏资产" titleFontSize="28rpx">
			<view class="moneyContent">
				<u--text mode="price" :text="totalAssets" size="56rpx" color="#219a6d"></u--text>
			</view>
		</mj-card>
		<mj-card title="资产设置" titleFontSize="28rpx">
			<u-cell-group :border="false">
				<u-cell  title="选择默认资产" label="记账页默认选择的资产账户" :border="false" :clickable="true" @click="chooseDefaultAsset">
					<view slot="value" class="defaultAsset">
						<template v-if="defaultAssetStyle">
							<text>{{defaultAsset.asset_name ? defaultAsset.asset_name : defaultAssetStyle.title}}</text><uni-icons :type="defaultAssetStyle.icon" :color="defaultAssetStyle.color" customPrefix="miaoji" size="28"></uni-icons>
						</template>
						<template v-else="defaultAssetStyle">
							<text>点我设置默认资产</text>
						</template>
					</view>
				</u-cell>
			</u-cell-group>
		</mj-card>
		<view class="assets-wrapper">
			<mj-asset-card :userAssetsFromDB="userAssets" isEyeShow="true" :safeAreaInsetBottom="true"></mj-asset-card>
		</view>
		
		<!-- 展示资产页的popup -->
		<u-popup :show="showUserAssetsList" @close="showUserAssetsList = false" round="20px" zIndex="10076">
			<view class="user-assets-list">
				<view class="top">
					<view class="add">
						请选择默认资产
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
	</view>
</template>

<script>
	import {getAssetsStyle} from "@/utils/icon-config.js";
	const db = uniCloud.database()
	export default {
		data() {
			return {
				userAssets: [],
				defaultAsset: {},
				showUserAssetsList: false
			};
		},
		computed: {
			// 计算总资产
			totalAssets() {
				// 筛选出所有资产的资产项
				return this.userAssets.reduce((lastValue, currentArr) => lastValue + currentArr.asset_balance , 0)
			},
			defaultAssetStyle() {
				return this.defaultAsset.assetStyle
			}
		},
		onLoad() {
			this.userAssets = uni.getStorageSync('mj-user-assets')
			this.addAssetStyle()
			this.defaultAsset = this.userAssets.filter(asset => asset.default_asset === true)[0] ?? {}
		},
		methods: {
			addAssetStyle() {
				const assetsStyle = getAssetsStyle()
				this.userAssets.forEach(asset => {
					asset.assetStyle = assetsStyle.find(item => item.type === asset.asset_type)
				})
			},
			chooseDefaultAsset() {
				this.showUserAssetsList = true
			},
			// 设置默认资产
			async clickOneAsset(asset) {
				try{
					uni.showLoading({
						title: "设置中",
						mask: true
					})
					await db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').update({
						default_asset: false
					})
					await db.collection("mj-user-assets").doc(asset._id).update({
						default_asset: true
					})
					uni.hideLoading()
					// 更新资产列表
					uni.$emit('updateAssetsList')
					this.showUserAssetsList = false
					// 更新 选择默认资产 cell栏
					this.updateDefaultAsset(asset)
				}catch(e){
					uni.hideLoading()
					uni.showToast({
						title:"设置失败请重试",
						icon: "error"
					})
				}
			},
			updateDefaultAsset(asset) {
				this.defaultAsset = asset
			}
		}
	}
</script>

<style lang="scss" scoped>
.my-assets {
	position: relative;
	.linear-gradient {
		position: absolute;
		top: -24rpx;
		left: 0;
		right: 0;
		height: 130rpx;
		background-image: linear-gradient(#9fcba7, #fafafa);
		z-index: -1;
	}
	.defaultAsset {
		display: flex;
		align-items: center;
		text {
			color: $mj-text-color;
			margin-right: 4px;
		}
	}
	.assets-wrapper{
		margin: 20rpx;
		font-size: 14px
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
			justify-content: flex-start;
			align-items: center;
			.add {
				color: $mj-text-color;
				font-size: 24rpx;
				box-sizing: border-box;
				padding: 4px 0px;
				border-bottom: 2px solid $mj-theme-color;
			}
		}
	}
}
</style>
