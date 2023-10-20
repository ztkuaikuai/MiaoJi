<template>
	<view class="bill-template">
		<!-- 需要从数据库中获取数据进行渲染 -->
		<view @click.native="clickTemp(temp)" v-for="temp in formatTempList" :key="temp._id">
			<mj-card :title="temp.bill_type === 0 ? '支出' : '收入'" v-if="temp.bill_type !== 2">
				<view class="one-bill-template">
					<view class="left">
						<mj-icon-with-background :type="temp.billStyle.icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
						<view class="info">
							<view>{{temp.billStyle.title}}</view>
							<view class="minor" v-if="temp.bill_notes"><u--text :lines="1" :text="temp.bill_notes" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view> <!-- 设置超过一行就... 可以使用u-text组件 -->
						</view>
					</view>
					<view class="right">
						<u--text mode="price" :text="temp.bill_amount" :color="temp.bill_type === 0 ? '#dd524d' : '#219a6d'" size="32rpx" bold></u--text>
						<view class="minor">{{temp.assetStyle.title}}</view>
					</view>
				</view>
			</mj-card>
			<mj-card v-else title="转账">
				<view class="one-bill-template">
					<view class="left">
						<mj-icon-with-background :type="temp.billStyle.icon" size="48rpx" customPrefix="miaoji"></mj-icon-with-background>
						<view class="info">
							<view>{{temp.billStyle.title}}</view>
							<view class="minor" v-if="temp.bill_notes"><u--text :lines="1" :text="temp.bill_notes" color="rgba(0,0,0, 0.6)" size="24rpx"></u--text></view> <!-- 设置超过一行就... 可以使用u-text组件 -->
						</view>
					</view>
					<view class="right">
						<u--text mode="price" :text="temp.transfer_amount / 100" color="#212121" size="32rpx" bold></u--text>
						<view class="minor">{{temp.assetStyle.title}}</view>
					</view>
				</view>
			</mj-card>
		</view>
		
		<mj-bill-details-popup
			:bill="templateDetails"
			:show="showBillDetails" 
			@close="showBillDetails = false" 
			@updateBill="updateTemp" 
			@deleteBill="deleteTemp"
		>
		</mj-bill-details-popup>
	</view>
</template>

<script>
	const db = uniCloud.database()
	import {getAllIconList, getAssetsStyle} from "@/utils/icon-config.js";
	export default {
		name:"mj-bill-template",
		props: ['templateList'],
		data() {
			return {
				templateDetails: {},
				showBillDetails: false,
				iconGather: getAllIconList(),
				assetsStyle: getAssetsStyle(),
				formatTempList: []
			};
		},
		watch: {
			templateList() {
				this.formatTemp()
			}
		},
		methods: {
			updateTemp() {
				uni.showToast({
					title:"正在开发中~",
					icon: "none"
				})
			},
			async deleteTemp() {
				uni.showModal({
					content: "你确定删除该模板吗？（删除之后不可恢复哦）",
					cancelColor: "rgba(0,0,0,0.6)",
					confirmColor:"#9fcba7",
					success:async res =>  {
						if(res.confirm) {
							uni.showLoading({
								title: "删除中",
								mask: true
							})
							await db.collection('mj-user-templates').doc(this.templateDetails._id).remove()
							this.$emit('updateList')
							uni.hideLoading()
							uni.showToast({
								title: "删除成功",
								icon: "success"
							})
							this.showBillDetails = false
						}
					}
				})
			},
			clickTemp(temp) {
				this.templateDetails = {}
				this.templateDetails = temp
				this.showBillDetails = true
			},
			formatTemp() {
				// 获取用户资产信息
				const assets = uni.getStorageSync('mj-user-assets')
				const arr = uni.$u.deepClone(this.templateList)
				// 1 修改金额单位 变为元
				// 2 通过category_type给每一条添加对应billStyle
				// 3 通过asset_type给每一条添加对应的assetStyle
				// 4 如果转入资产的id，给其添加对应的destinationAssetStyle
				arr.forEach(temp => {
					temp.bill_amount /= 100
					temp.billStyle = this.iconGather.find(item => item.type === temp.category_type)
					// 如果为undefined，则对应的资产被用户删除
					const asset_type = assets.find(item => item._id ===  temp.asset_id)?.asset_type
					// 判断模板的资产id对应的资产有没有被用户删除
					if(asset_type) {
						temp.assetStyle = this.assetsStyle.find(item => item.type === asset_type)
					} else {
						temp.assetStyle = {}
						temp.assetStyle.title = '资产已删除'
					}
					const destination_asset_type = assets.find(item => item._id ===  temp.destination_asset_id)?.asset_type
					if(destination_asset_type) {
						temp.destinationAssetStyle = this.assetsStyle.find(item => item.type === destination_asset_type)
					} else {
						temp.destinationAssetStyle = {}
						temp.destinationAssetStyle.title = '资产已删除'
					}
				})
				this.formatTempList = arr
			}
		}
	}
</script>

<style lang="scss" scoped>
.bill-template {
	.one-bill-template {
		display: flex;
		justify-content: space-between;
		color: $mj-text-color;
		
		font-size: 32rpx;
		padding: 8rpx 0;
	
		.left {
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
}
</style>