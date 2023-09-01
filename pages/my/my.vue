<template>
	<view class="my">
		<!-- 用户卡片 -->
		<uni-card :is-shadow="true" @click="clickUserCard" shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;">
			<view class="user-card">
				<view class="left">
					<u-avatar :src="avatarSrc" size="100rpx"></u-avatar>
					<view class="main">
						<view class="username">
							Hi 砖吐筷筷
						</view>
						<view class="day">
							今天是你记账的第168天
						</view>
					</view>
				</view>
				<view class="right">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</uni-card>
		<!-- 修改了uni-section的样式，背景色和装饰line颜色改变,padding -->
		<view class="options">
			<!-- 常用功能 -->
			<uni-section class="section" title="常用功能" type="line" titleFontSize="28rpx" titleColor="#212121"></uni-section>
			<!-- grid组件 -->
			<u-grid :border="false" @click="clickOption" col="4">
				<u-grid-item v-for="item in optionList">
					<view class="content">
						<view class="grid-item">
							<u-icon :name="item.name" size="48rpx"></u-icon>
							<view class="grid-text">{{item.title}}</view>
						</view>
					</view>
				</u-grid-item>
			</u-grid>
			<!-- 偏好 -->
			<uni-section class="section" title="偏好" type="line" titleFontSize="28rpx" titleColor="#212121"></uni-section>
			<u-grid :border="false" @click="clickLike" col="4">
				<u-grid-item v-for="item in likeList">
					<view class="content">
						<view class="grid-item">
							<u-icon :name="item.name" size="48rpx"></u-icon>
							<view class="grid-text">{{item.title}}</view>
						</view>
					</view>
				</u-grid-item>
			</u-grid>
			
			<!-- 其他 -->
			<uni-section class="section" title="其他" type="line" titleFontSize="28rpx" titleColor="#212121"></uni-section>
			<u-cell-group :border="false" >
				<u-cell icon="file-text" title="反馈问题" :isLink="true" @click="clickFeedback"></u-cell>
				<u-cell icon="weixin-fill" title="联系作者" :isLink="true"></u-cell>
				<u-cell icon="info-circle" title="关于" :isLink="true"></u-cell>
			</u-cell-group>
			<!--可以尝试用 uni-group分组 组件 -->
		</view>
	</view>
</template>

<script>
	import colorGradient from '../../uni_modules/uview-ui/libs/function/colorGradient';
	export default {
		data() {
			return {
				avatarSrc: '/static/头像.jpg',
				optionList: [{
						name: 'list-dot',
						title: '收支分类'
					},
					{
						name: 'rmb-circle',
						title: '我的资产'
					},
					{
						name: 'order',
						title: '多账本'
					},
					{
						name: 'order',
						title: '多账本'
					},
					{
						name: 'order',
						title: '多账本'
					}
				],
				likeList: [{
						name: 'list-dot',
						title: '收支分类'
					},
					{
						name: 'rmb-circle',
						title: '我的资产'
					}
				]
			};
		},
		methods: {
			clickUserCard() {
				uni.navigateTo({
					url:"/pagesMy/user-info/user-info"
				})
			},
			clickOption(name) {
				console.log("点击了常用功能", name);
			},
			clickLike(name) {
				console.log("点击了偏好", name);
			},
			clickFeedback() {
				uni.navigateTo({
					url:"/pagesMy/feedback/feedback"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my {
		.user-card {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				justify-content: start;
				align-items: center;

				.main {
					margin-left: 12rpx;
					margin-top: 8rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;

					.username {
						font-size: 40rpx;
						line-height: 40rpx;
						color: $mj-text-color;
					}

					.day {
						font-size: 28rpx;
						line-height: 28rpx;
						color: $mj-text-color-grey;
					}
				}
			}
		}

		.options {
			box-sizing: border-box;
			padding: 0 28rpx;

			.content {
				padding-bottom: 14px;

				.grid-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 148rpx;
					height: 124rpx;
					background-color: #f1f1f1;
					border-radius: 30%;
					color: $mj-text-color;

					.grid-text {
						font-size: 28rpx;
					}
				}
			}
		}
	}
</style>