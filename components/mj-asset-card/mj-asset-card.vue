<template>
	<view class="asset-card">
		<!-- 这里需要循环 -->
		<view class="content">
			<!-- 滑动单元格 -->
			<u-swipe-action>
				<u-swipe-action-item :options="options" v-for="asset in userAssetsShow" :threshold="80" @click="clickBtn($event,asset)" >
					<view class="swipe-action-item">
						<view class="left">
							<mj-icon-with-background :type="asset.assetStyle.icon" size="48rpx" customPrefix="miaoji" :color="asset.assetStyle.color"></mj-icon-with-background>
							<view class="info">
								<view>{{asset.assetStyle.title}}</view>
							</view>
						</view>
						<view class="right">
							<view class="money"><u--text mode="price" :text="asset.asset_balance" color="rgba(0,0,0, 0.8)" size="32rpx" bold></u--text></view>
						</view>
					</view>
					<view class="line" v-if="item != 2">
						<u-line length="80%"></u-line>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
		<view class="hideAsset" @click="clickHideAsset">查看隐藏资产</view>
		
		<!-- 隐藏资产弹出框 -->
		<u-popup :show="showHideAsset" @close="showHideAsset = false" round="20px"> 
			<view>
				<view class="top">小金库</view>
				<view v-if="userAssetsHide.length">
					<u-swipe-action>
						<u-swipe-action-item :options="options" v-for="asset in userAssetsHide" :threshold="80" @click="clickBtn($event,asset)" >
							<view class="swipe-action-item">
								<view class="left">
									<mj-icon-with-background :type="asset.assetStyle.icon" size="48rpx" customPrefix="miaoji" :color="asset.assetStyle.color"></mj-icon-with-background>
									<view class="info">
										<view>{{asset.assetStyle.title}}</view>
									</view>
								</view>
								<view class="right">
									<view class="money"><u--text mode="price" :text="asset.asset_balance" color="rgba(0,0,0, 0.8)" size="32rpx" bold></u--text></view>
								</view>
							</view>
							<view class="line" v-if="item != 2">
								<u-line length="80%"></u-line>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
				<view v-else class="bottom">
					还没有隐藏金库噢！
				</view>
			</view>
		</u-popup>
		<!-- 是否确认删除模态框 -->
		
	</view>
</template>

<script>
	import ICONCONFIG from "@/utils/icon-config.js";
	const db = uniCloud.database()
	
	export default {
		name: "mj-asset-card",
		props: ['userAssetsFromDB'],
		data() {
			return {
				options: [{
					text: "编辑",
					style: {
						backgroundColor: '#c5c5c5',
						padding: '0 40rpx'
					}
				}, {
					text: "删除",
					style: {
						backgroundColor: '#e94459',
						padding: '0 40rpx'
					}
				}],
				assets: [],
				assetsStyle: [],
				showHideAsset: false,
			};
		},
		methods: {
			clickBtn({index},asset) { // 0 点击了编辑  1 点击了删除
				// 获取资产信息 ，如果点击了编辑，则先缓存，后跳转到编辑页拿到缓存渲染页面，后删除缓存；如果点击了删除，先提示弹框，后通过id删除
				console.log(index,asset);
				if(index == 0) {
					uni.setStorageSync('mj-asset-edit',asset)
					uni.navigateTo({
						// 需要传递的参数  type  资产金额 是否隐藏 是否计入总资产 用户名？ 
						url:`/pagesAccount/set-asset/set-asset?type=${asset.asset_type}`
					})
				} else {
					console.log("点击了删除");
					uni.showModal({
						content: "你确定删除该资产账户吗？（删除之后不可恢复哦）",
						cancelColor: "rgba(0,0,0,0.6)",
						confirmColor:"#9fcba7",
						success:async res =>  {
							if(res.confirm) {
								await db.collection("mj-user-assets").doc(asset._id).remove()
								uni.$emit('updateAssetsList')
								uni.showToast({
									title: "删除成功",
									icon: "success"
								})
							}
						}
					})
				}
			},
			clickHideAsset() {
				this.showHideAsset = true
				console.log(this.userAssetsHide);
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
			// 给userAssetsFromDB赋值为assets（首先，不可以直接修改props，其次将对象内容变成响应式的，可以被computed监测到），并添加对应的assetStyle
			addAssetStyle() {
				this.assets = this.userAssetsFromDB
				this.assets.forEach(asset => {
					asset.assetStyle = this.assetsStyle.find(item => item.type == asset.asset_type)
				})
				// console.log('addAssetStyle',this.assets);
			}
		},
		computed: {
			userAssetsShow() {
				return this.assets.filter(item => item.hide_in_interface == false)
			},
			// 隐藏资产，一定不计入总资产
			userAssetsHide() {
				return this.assets.filter(item => item.hide_in_interface == true)
			}
		},
		onReady() {
			console.log('onReady',this.userAssetsFromDB);
			this.getAssetsStyle()
			this.addAssetStyle()
		},
		watch: {
			userAssetsFromDB: {
				deep:true,
				handler: function() {
					this.addAssetStyle()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.asset-card {
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
		
		.top {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			border-radius: 20px 20px 0 0;
			color: $mj-text-color-grey;
			height: 48rpx;
			background-color: $mj-bg-color;
		}
		.bottom {
			display: flex;
			justify-content: center;
			align-items: center;
			color: $mj-theme-color;
			height: 100rpx;
			width: 100%;
			background-color: $mj-bg-color;
		}
		
		.line {
			display: flex;
			justify-content: center;
		}
		
		.hideAsset {
			display: flex;
			justify-content: center;
			font-size: 24rpx;
			color: $mj-text-color-grey;
			margin-top: 20px;
		}

	}
</style>