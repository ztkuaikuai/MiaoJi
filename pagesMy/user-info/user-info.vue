<template>
	<view class="userInfo">
		<mj-card title="我的">
			<view class="me">
				<view class="avatar">
					<u-avatar :src="userInfo.avatarSrc" size="100rpx"></u-avatar>
					<button open-type="chooseAvatar" class="avatarBtn" @chooseavatar="getAvatar"></button>
				</view>
				<view class="main">
					<view class="username" @click="clickName">
						Hi {{userInfo.nickname || '朋友'}}
					</view>
					<view class="day">
						2022年4月加入妙记
					</view>
				</view>
			</view>
		</mj-card>
		<mj-card title="个人信息">
			<u-cell-group :border="false">
				<u-cell title="会员编号" label="00000001" :border="false" clickable>
					<uni-icons type="vip" size="48rpx" slot="icon" class="userinfo-icon"></uni-icons>
				</u-cell>
				<u-cell @click="clickName" title="昵称" :label="userInfo.nickname || '点我设置昵称'" :border="false" clickable>
					<uni-icons type="person" size="48rpx" slot="icon" class="userinfo-icon"></uni-icons>
				</u-cell>
				<u-cell title="加入时间" label="2022-04-21" :border="false">
					<uni-icons type="paperplane" size="48rpx" slot="icon" class="userinfo-icon"></uni-icons>
				</u-cell>
			</u-cell-group>
		</mj-card>
		<u-popup :show="showNicaNamePop" mode="center" :round="10" @close="showNicaNamePop = false"
			:customStyle="popStyle">
			<form @submit="submitName">
				<input type="nickname" placeholder="请输入昵称(10个字以内)" maxlength="10" name="nickname">
				<button form-type="submit" class="btn">确认</button>
			</form>
		</u-popup>
		<u-toast ref="uToastForNickname"></u-toast>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				userInfo: {
					avatarSrc: '',
					nickname: '',
				},
				showNicaNamePop: false,
				popStyle: {
					'box-sizing': 'border-box',
					'padding': '40rpx'
				}
			}
		},
		methods: {
			getAvatar(res) {
				// console.log("头像被点击");
				// 修改头像  修改后保存在本地存储中 并修改数据库中的头像url
				this.userInfo.avatarSrc = res.detail.avatarUrl
				uni.setStorageSync('mj-user-info', this.userInfo)
				db.collection("uni-id-users").where("_id == $cloudEnv_uid").update({
					avatar: res.detail.avatarUrl
				})

			},
			clickName() {
				// console.log("昵称被点击");
				// 修改昵称  修改后保存在本地存储中 并修改数据库中的nickname
				this.showNicaNamePop = true
			},
			// 点击修改昵称pop的确认按钮触发
			submitName(res) {
				// 需要判断是否为空
				if (!res.detail.value.nickname.trim()) {
					this.$refs.uToastForNickname.show({
						message :"输入内容不可以为空！",
						type: 'error',
						position: 'top'
					})
					return
				}
				this.userInfo.nickname = res.detail.value.nickname
				uni.setStorageSync('mj-user-info', this.userInfo)
				db.collection("uni-id-users").where("_id == $cloudEnv_uid").update({
					nickname: res.detail.value.nickname
				})
				this.showNicaNamePop = false
			},
			// 页面挂载时获取数据  1 如果有缓存，获取缓存进行渲染  2 若无缓存，获取db数据，并赋值+存入缓存
			async getUserInfo() {
				const storageUserInfo = uni.getStorageSync('mj-user-info')
				if(storageUserInfo){
					Object.assign(this.userInfo, storageUserInfo)
				} else {
					const res = await db.collection("uni-id-users").where("_id == $cloudEnv_uid").field("_id,nickname,avatar").get()
					const {avatar: avatarSrc, nickname} = res.result.data[0]
					Object.assign(this.userInfo, {avatarSrc, nickname})
					uni.setStorageSync('mj-user-info', this.userInfo)
				}
			}
		},
		mounted() {
			this.getUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo {
		.me {

			display: flex;
			justify-content: start;
			align-items: center;

			.avatar {
				position: relative;

				.avatarBtn {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					opacity: 0;
				}
			}

			.main {
				margin-left: 20rpx;
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
		.userinfo-icon {
			padding-right: 24rpx;
		}
		.btn {
			margin-top: 10px;
			font-size: 32rpx;
			border: none;
			color: $mj-theme-color;
			background-color: #fff;
		}
	}
</style>