<template>
	<view class="userInfo">
		<view class="linear-gradient"></view>
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
						{{registerDateForTitle}}加入妙记
					</view>
				</view>
			</view>
		</mj-card>
		<mj-card title="个人信息">
			<u-cell-group :border="false">
				<u-cell title="会员编号" :label="userInfo.userLabel" :border="false" clickable>
					<uni-icons type="vip" size="48rpx" slot="icon" class="userinfo-icon"></uni-icons>
				</u-cell>
				<u-cell @click="clickName" title="昵称" :label="userInfo.nickname || '点我设置昵称'" :border="false" clickable>
					<uni-icons type="person" size="48rpx" slot="icon" class="userinfo-icon"></uni-icons>
				</u-cell>
				<u-cell title="加入时间" :label="userInfo.registerDate" :border="false">
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
					registerDate: '',  //格式为 yyyy-mm-dd
					userLabel: '00000001'
				},
				registerDateForTitle: '', //格式为 yyyy年mm
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
			// 页面挂载时获取数据   1 如果有缓存，则给this.userInfo赋值   2 获取db数据  3 判断数据库数据和缓存中的数据有无区别，有区别覆盖缓存,并再次赋值
			async getUserInfo() {
				const userInfoFromStorage = uni.getStorageSync('mj-user-info')
				if(userInfoFromStorage) {
					Object.assign(this.userInfo, userInfoFromStorage)
				}
				
				const res = await db.collection("uni-id-users").where("_id == $cloudEnv_uid").field("_id,nickname,avatar,register_date").get()
				let {avatar: avatarSrc, nickname, register_date: registerDate} = res.result.data[0]
				// 使用注册日期计算出会员编号
				const userLabel = Math.round(registerDate * 3 / 200000).toString()
				// 注册日期格式化
				this.registerDateForTitle = uni.$u.timeFormat(registerDate,'yyyy年mm月')
				registerDate = uni.$u.timeFormat(registerDate,'yyyy-mm-dd')
				
				
				const objTemp = {avatarSrc, nickname, registerDate, userLabel}
				if(!this.compareObjects(userInfoFromStorage,objTemp)) {
					// 如果数据库数据和缓存中的数据有区别，覆盖缓存，并再次赋值
					Object.assign(this.userInfo, objTemp)
					uni.setStorageSync('mj-user-info', this.userInfo)
				}
			},
			// 比较两个对象的属性名和值是否相等
			compareObjects(obj1, obj2) {
			  // 获取对象的属性名数组
			  const keys1 = Object.keys(obj1);
			  const keys2 = Object.keys(obj2);
			
			  // 检查属性名数组长度是否相等
			  if (keys1.length !== keys2.length) {
			    return false;
			  }
			
			  // 比较属性名和属性值
			  for (let key of keys1) {
			    // 检查属性名是否存在于第二个对象中
			    if (!obj2.hasOwnProperty(key)) {
			      return false;
			    }
			
			    // 比较属性值
			    if (obj1[key] !== obj2[key]) {
			      return false;
			    }
			  }
			
			  return true;
			}
		},
		onReady() {
			this.getUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo {
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