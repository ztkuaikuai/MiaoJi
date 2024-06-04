<template>
	<view class="about">
		<view class="logo" @click="subMsg">
			<u--image src="/static/logo.png" width="72px" height="72px" radius="20px" ></u--image>
			<view class="version">
				版本号：0.8.6 (Early Access)
			</view>
			<view class="version">
				代号："Suzumiya Haruhi no Yūutsu" 
			</view>
		</view>
		<view class="main">
			<mj-card title="关于">
				<view class="about-textarea">
					妙记账单 ( 以下简称“妙记”) 是我们自己的练手项目，仅供学习使用。如果你觉得妙记做的不错的话，可以给我们点个赞。如果你在寻找启动速度更快，记账更优雅的应用，可以去应用商店搜索<text class="highlight">小青账</text>下载，我们的项目借鉴了其UI界面和用户行为逻辑，在此基础上进行了简化，如果你想体验更完整流畅的记账，请下载<text class="highlight">小青账</text>。
				</view>
			</mj-card>
			<mj-card title="开源">
				<view class="about-textarea">
					我们的产品使用MIT开源协议，您可以随意修改使用，如果我们的产品有帮到你，给项目点点<text class="highlight">Star</text>吧，这对我们真的很重要！项目地址：<text class="highlight">github.com/ztkuaikuai/MiaoJi</text>
				</view>
			</mj-card>
			<mj-card title="版本更新说明">
				<view class="one-update">
					<view class="title highlight">
						0.8.6 —— 6月5日更新
					</view>
					<view class="row highlight">
						- 新增每日记账提醒，点击上方logo有小惊喜哦
					</view>
					<view class="row">
						- 优化秒记体验：绑定的模板更新后不会解绑了
					</view>
					<view class="row">
						- 替换带有性别歧视色彩的分类名称 ( 母婴改为亲子 ; 美妆改为化妆护肤 )
					</view>
				</view>
				<view class="one-update">
					<view class="title highlight">
						0.8.3 —— 1月20日更新
					</view>
					<view class="row highlight">
						- 更新账单分类图标，更加美观一致
					</view>
					<view class="row">
						- 更换新logo
					</view>
					<view class="row">
						- 替换带有性别歧视色彩的分类名称 ( 母婴改为亲子 ; 美妆改为化妆护肤 )
					</view>
					<view class="row">
						- 修改若干布局样式、杀掉多个小虫子
					</view>
				</view>
				<view class="one-update">
					<view class="title highlight">
						0.8.0 —— 12月17日更新
					</view>
					<view class="row highlight">
						- 添加秒记功能
					</view>
					<view class="row">
						- 优化首页隐藏金额功能体验：现在可以持久化隐藏
					</view>
					<view class="row">
						- 添加饮品和水果蔬菜分类
					</view>
					<view class="row">
						- 捕捉多个小虫子
					</view>
				</view>
				<view class="one-update">
					<view class="title highlight">
						0.7.8 —— 11月18日更新
					</view>
					<view class="row highlight">
						- 添加再记功能
					</view>
					<view class="row highlight">
						- 优化记账体验：资产如果有资产名，则优先显示资产名
					</view>
					<view class="row">
						- 优化首页和账单页加载速度
					</view>
					<view class="row">
						- 修复记一笔页面多次点击保存会生成多个账单的问题
					</view>
				</view>
				<view class="one-update">
					<view class="title highlight">
						0.7.7 —— 10月21日更新
					</view>
					<view class="row highlight">
						- 添加模板记账功能
					</view>
					<view class="row">
						- 修复手续费金额显示错误问题
					</view>
					<view class="row">
						- 修复图表页金额显示错误问题
					</view>
				</view>
				<view class="one-update">
					<view class="title highlight">
						0.7.6 —— 9月15日更新
					</view>
					<view class="row">
						- 优化首次进入小程序的体验
					</view>
					<view class="row">
						- 添加分享朋友和朋友圈功能
					</view>
					<view class="row">
						- 添加账单详情弹出框：点击账单可以弹出账单详情
					</view>
				</view>
				<view class="one-update">
					<view class="title highlight">
						0.7.5 —— 9月12日更新
					</view>
					<view class="row">
						- 添加设置默认资产功能
					</view>
					<view class="row">
						- 优化用户体验：列表为空时显示空盒子
					</view>
					<view class="row">
						- 捉到一些小虫子
					</view>
				</view>
			</mj-card>
			<mj-card title="未来更新计划">
				<view class="one-update">
					<view class="row">
						- 添加筛选功能
					</view>
					<view class="row">
						- 添加定时记账功能
					</view>
					<view class="row">
						- 添加预算设置功能
					</view>
					<view class="row">
						- 添加主题配色功能
					</view>
				</view>
			</mj-card>
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	import { subscribeMessage } from '@/utils/subscribeMessage.js'
	export default {
		methods: {
			// 订阅版本更新说明消息
			subMsg() {
				subscribeMessage(['kGUsXGcTKBAA239WAxPCbn3Sv2svDGWTqsglYZMiqLI'])
			}
		}
	}
</script>

<style lang="scss" scoped>
.about {
	.logo {
		height: 320rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.version {
			margin-top: 12px;
			color: #727272;
			font-size: 16px
		}
	}
	.main {
		.about-textarea {
			text-indent: 2em;
			font-size: 32rpx;
			color: $mj-text-color-grey;
			line-height: 48rpx;
		}
		.highlight {
			color: $mj-theme-color-black;
			font-weight: 700;
		}
		.one-update {
			font-size: 32rpx;
			color: $mj-text-color-grey;
			line-height: 48rpx;
			.title {
				font-size: 36rpx;
				text-align: center;
			}
		}
	}
}
</style>
