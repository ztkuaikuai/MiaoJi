<template>
	<view class="my">
		<!-- 用户卡片 -->
		<uni-card :is-shadow="true" @click="clickUserCard" shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;">
			<view class="user-card">
				<view class="left">
					<u-avatar :src="userInfo.avatarSrc" size="100rpx"></u-avatar>
					<view class="main">
						<view class="username">
							Hi {{userInfo.nickname || '朋友'}}
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
			<uni-section class="section" title="常用功能" type="line" titleFontSize="28rpx"
				titleColor="#212121"></uni-section>
			<!-- grid组件 -->
			<u-grid :border="false" @click="clickOption" col="4">
				<u-grid-item v-for="item,index in optionList" :key="index" >
					<view class="content">
						<view class="grid-item">
							<uni-icons :type="item.icon" size="48rpx" :customPrefix="item.customPrefix"></uni-icons>
							<view class="grid-text">{{item.title}}</view>
						</view>
					</view>
				</u-grid-item>
			</u-grid>
			<!-- 偏好 -->
			<uni-section class="section" title="偏好" type="line" titleFontSize="28rpx"
				titleColor="#212121"></uni-section>
			<u-grid :border="false" @click="clickLike" col="4">
				<u-grid-item v-for="item,index in likeList" :key="index" >
					<view class="content">
						<view class="grid-item">
							<uni-icons :type="item.icon" size="48rpx" :customPrefix="item.customPrefix"></uni-icons>
							<view class="grid-text">{{item.title}}</view>
						</view>
					</view>
				</u-grid-item>
			</u-grid>

			<!-- 其他 -->
			<uni-section class="section" title="其他" type="line" titleFontSize="28rpx"
				titleColor="#212121"></uni-section>
			<u-cell-group :border="false">
				<u-cell title="反馈问题" :isLink="true" @click="clickFeedback">
					<uni-icons slot="icon" type="compose" size="36rpx"></uni-icons>
				</u-cell>
				<u-cell title="联系作者" :isLink="true" @click="clickAuthor">
					<uni-icons slot="icon" type="personadd" size="36rpx"></uni-icons>
				</u-cell>
				<u-cell title="关于" :isLink="true" @click="clickAbout">
					<uni-icons slot="icon" type="info" size="36rpx"></uni-icons>
				</u-cell>
				<u-cell title="退出登录" :isLink="true" @click="logout">
					<uni-icons slot="icon" type="mj-logout" size="32rpx" customPrefix="miaoji"></uni-icons>
				</u-cell>
				<u-cell title="注销账号" :isLink="true" @click="deactivate">
					<uni-icons slot="icon" type="mj-stop" size="32rpx" customPrefix="miaoji"></uni-icons>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import UT from '@/utils/user-state.js'
	import {mutations} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	const uniIdCo = uniCloud.importObject('uni-id-co')
	export default {
		data() {
			return {
				userInfo: {
					avatarSrc: '',
					nickname: '',
				},
				optionList: [{
						icon: 'wallet',
						title: '我的资产'
					},
					{
						icon: 'mj-layout',
						title: '模板管理',
						customPrefix: "miaoji"
					},
					{
						icon: 'mj-reloadtime',
						title: '定时记账',
						customPrefix: "miaoji"
					},
					{
						icon: 'mj-YUAN',
						title: '预算设置',
						customPrefix: "miaoji"
					}
				],
				likeList: [{
						icon: 'color',
						title: '个性化'
					}
				],
				showUserAssetsList: false,
			};
		},
		methods: {
			clickUserCard() {
				uni.navigateTo({
					url: "/pagesMy/user-info/user-info"
				})
			},
			clickOption(name) {
				// console.log("点击了常用功能", name);
				uni.showToast({
					title:"正在开发中~",
					icon: "none"
				})
			},
			clickLike(name) {
				// console.log("点击了偏好", name);
				uni.showToast({
					title:"正在开发中~",
					icon: "none"
				})
			},
			clickFeedback() {
				uni.navigateTo({
					url: "/pagesMy/feedback/feedback"
				})
			},
			clickAuthor() {
				uni.showModal({
					content: "微信：ztkuaikuai",
					cancelColor: "rgba(0,0,0,0.6)",
					confirmColor:"#9fcba7",
					showCancel:false
				})
			},
			clickAbout(){
				uni.navigateTo({
					url:"/pagesMy/about/about"
				})
			},
			logout() {
				mutations.logout()
			},
			// 注销
			deactivate() {
				uni.navigateTo({
					url: "/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate"
				})
			},
			
			
			
			// 页面挂载时获取数据  1 如果有缓存，获取缓存进行渲染  2 若无缓存，获取db数据，并赋值+存入缓存 
			async getUserInfo() {
				try {
					const storageUserInfo = uni.getStorageSync('mj-user-info')
					if (storageUserInfo) {
						Object.assign(this.userInfo, storageUserInfo)
					} else {
						const res = await db.collection("uni-id-users").where("_id == $cloudEnv_uid").field(
							"_id,nickname,avatar").get()
						const {
							avatar: avatarSrc,
							nickname
						} = res.result.data[0]
						Object.assign(this.userInfo, {
							avatarSrc,
							nickname
						})
						uni.setStorageSync('mj-user-info', this.userInfo)
					}
				} catch (err) {
					// console.log(err);
				}
			},
			resetUserInfo() {
				const storageUserInfo = uni.getStorageSync('mj-user-info')
				Object.assign(this.userInfo, storageUserInfo)
			}

		},
		onReady() {
			const state = UT.checkUserTokenExpierd() // 检查老用户的token是否过期，如果过期则跳转登录，并返回true；没过期返回false
			if(state) return
			// console.log("用户token没过期，继续执行下面的逻辑");
			this.getUserInfo()
		},
		onShow() {
			// 判断用户是否登录，如果未登录 则跳转到登录页
			const {uid} = uniCloud.getCurrentUserInfo()
			if (!uid) {
				uni.redirectTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
				})
				return
			}
			this.resetUserInfo()

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
						margin-bottom: 16rpx;
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