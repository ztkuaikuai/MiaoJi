<template>
	<view class="seconds">
		<view class="linear-gradient"></view>
		<mj-card title="提示">
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				秒记可<span style="font-weight: 700;">用于记录经常购买的账单</span>，如每天喝咖啡9.9元，可设置为秒记方便快速记账。
			</view>
			<view style="font-size: 28rpx;color: rgba(0, 0, 0, 0.6);">
				<span style="font-weight: 700;">秒记比模板更加方便</span>，在记一笔页面使用秒记<span style="font-weight: 700;">相当于使用模板+点击保存</span>。
			</view>
		</mj-card>
		<mj-card title="我是人啊" subTitle="秒记1">
			<mj-bill-one-template></mj-bill-one-template>
			<template #right>
				<view @click="editSeconds" class="edit">
					修改
				</view>
			</template>
		</mj-card>
		<mj-card title="秒记2">
			未绑定模板
			<template #right>
				<view @click="editSeconds" class="edit">
					修改
				</view>
			</template>
		</mj-card>
		<u-popup 
			:show="showPop" 
			:round="16" 
			mode="center"
			:closeOnClickOverlay="true"
			@close="showPop = false" 
			:safeAreaInsetBottom='false'
			:customStyle="popStyle"
		>
			<view style="width: 480rpx;">
				<uni-section title="秒记别名" type="line" titleFontSize="32rpx" titleColor="#212121" white="true" />
				<u--input
					placeholder="请输入秒记别名,最多可设置十个字"
					border="surround"
					v-model="secondName"
					shape="circle"
					fontSize="24rpx"
					maxlength="10"
					:clearable="true"
				></u--input>
			</view>
			<view style="width: 480rpx;">
				<uni-section title="绑定模板" type="line" titleFontSize="32rpx" titleColor="#212121" white="true" />
				<mj-bill-one-template></mj-bill-one-template>
			</view>
			<view style="margin-top: 12rpx;">
				<u-button shape="circle" type="primary" text="保存" :customStyle="btnStyle" size="normal" @click="saveSecond"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { themeColor } from '@/uni.scss'
	export default {
		data() {
			return {
				showPop: false,
				mainColor: themeColor,
				secondName: '',
				popStyle: {
					'box-sizing': 'border-box',
					'padding': '0 24rpx 24rpx'
				},
				btnStyle: {
					'width': '200rpx'
				}
			};
		},
		onLoad() {
			// 获取用户的秒记模板
			// 获取用户的模板
		},
		methods: {
			editSeconds() {
				// 1 重置数据
				// 2 传入秒记数据到pop框中
				// 3 展示pop
				console.log('编辑秒记模板')
				this.showPop = true
			},
			saveSecond() {
				// 0 loading
				// 1 判断新建or修改
				// 2 上传数据
				// 3 隐藏pop
				console.log('保存',this.secondName);
			}
		}
	}
</script>

<style lang="scss" scoped>
.seconds {
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
	.edit {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 4px 8px;
		margin-right: 4px;
		border-radius: 16px;
		font-size: 24rpx;
		color: $mj-bg-color;
		background-color: $mj-theme-color-2;
	}
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
