<template>
	<view class="asset-card">
		<!-- 这里需要循环 -->
		<view class="content">
			<!-- 滑动单元格 -->
			<u-swipe-action>
				<u-swipe-action-item :options="options" v-for="asset in userAssetsShow" :threshold="80" @click="clickBtn" >
					<view class="swipe-action-item">
						<view class="left">
							<u-avatar :icon="asset.asset_type" fontSize="24"></u-avatar>
							<view class="info">
								<view>{{asset.asset_type}}</view>
							</view>
						</view>
						<view class="right">
							<view class="money"><u--text mode="price" :text="asset.asset_balance / 100" color="#212121" size="32rpx"
									bold></u--text></view>
						</view>
					</view>
					<view class="line" v-if="item != 2">
						<u-line length="80%"></u-line>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
		<view class="hideAsset" @click="clickHideAsset">查看隐藏资产</view>
	</view>
</template>

<script>
	// 1 配置自定义icon  使用了 u-cell中的icon和  avatar的icon   ;avatar的icon   替换为自己的icon组件
	// 2 拿到type对应的表（含有type、icon、title）理应保存在用户缓存中
	// 3 渲染到页面
	
	export default {
		name: "mj-asset-card",
		props: ['userAssetsFromDB'],
		data() {
			return {
				options: [{
					text: "编辑",
					style: {
						backgroundColor: '#959595',
						padding: '0 40rpx'
					}
				}, {
					text: "删除",
					style: {
						backgroundColor: '#e94459',
						padding: '0 40rpx'
					}
				}],
			};
		},
		methods: {
			clickBtn({index}) { // 0 点击了编辑  1 点击了删除
				if(index == 0) {
					uni.navigateTo({
						// 需要传递的参数  type  资产金额 是否隐藏 是否计入总资产 用户名？ 
						url:"/pagesAccount/set-asset/set-asset?type=wx"
					})
				}
			},
			// 筛选用户资产：显示or隐藏
			filterUserAssets() {
				this.userAssetsShow = this.userAssetsFromDB.filter(item => {
					return item.hide_in_interface == false
				})
				console.log(this.userAssetsShow);
			},
			clickHideAsset() {
				console.log("查看隐藏资产");
			}
		},
		computed: {
			userAssetsShow() {
				return this.userAssetsFromDB.filter(item => {
					return item.hide_in_interface == false
				})
			},
			// 隐藏资产，一定不计入总资产
			userAssetsHide() {
				return this.userAssetsFromDB.filter(item => {
					return item.hide_in_interface == true
				})
			}
		},
		onReady() {
			console.log('onReady',this.userAssetsFromDB);
		}
	}
</script>

<style lang="scss" scoped>
	.asset-card {
		.content {
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

			.line {
				display: flex;
				justify-content: center;
			}
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