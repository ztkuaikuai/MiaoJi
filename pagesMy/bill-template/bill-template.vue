<template>
	<view class="temp">
		<view class="linear-gradient"></view>
		<mj-card title="食用说明">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				账单模板可<span style="font-weight: 700;">用于记录经常购买的账单</span>，如每天都吃香菇滑鸡11元，每月交房租1500元等，可保存为帐单模板<span style="font-weight: 700;">方便快速记账</span>。
			</view>
		</mj-card>
		<!-- 传入用户模板账单组成的对象数组，组件内进行遍历 -->
		<view class="bill-template-wrapper">
			<mj-bill-template :templateList="templateList" @updateList="getUserTemplate" pageType="temp"></mj-bill-template>
		</view>
		<!-- 防挡 -->
		<view style="height: 64px;"></view>
		<!-- 固定定位，最底下 -->
		<view class="bottom-btn" >
			<u-button text="添加模板" color="#9fcba7" shape="circle" @click="clickBottomBtn"></u-button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				templateList: []
			};
		},
		onLoad() {
			this.getUserTemplate()
		},
		onShow() {
			this.getUserTemplate()
		},
		methods: {
			clickBottomBtn() {
				uni.navigateTo({
					url: `/pagesAccount/make-an-account/make-an-account?type=template`
				})
			},
			async getUserTemplate() {
				// 获取模板信息
				const temp = db.collection('mj-user-templates').where('user_id == $cloudEnv_uid').orderBy('template_creation_date desc').getTemp()
				const userAssets = db.collection("mj-user-assets").where('user_id == $cloudEnv_uid').field('_id,asset_type,user_id,asset_name').getTemp()
				const res = await db.collection(temp, userAssets).get()
				this.templateList = res.result.data
			}
		}
	}
</script>

<style lang="scss" scoped>
	.temp {
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
	}
	
	.bottom-btn {
		box-sizing: border-box;
		z-index: 999;
		position: fixed;
		width: 100%;
		padding: 0 24rpx 12px;
		bottom: 20rpx;
		opacity: 0.98;
	}
</style>