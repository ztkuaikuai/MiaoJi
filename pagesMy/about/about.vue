<template>
	<view class="about">
		<view class="logo">
			<u--image src="/static/logo.png" width="72px" height="72px" radius="20px" ></u--image>
			<view class="version">
				版本号：0.7.3
			</view>
		</view>
		<view class="main">
			<mj-card title="关于">
				<view class="about-textarea">
					妙记账单开发团队（以下简称“我们”）是我们自己的练手项目，仅供学习使用。如果你觉得妙记做的不错的话，可以给我们点个赞。如果你在寻找启动速度更快，记账更优雅的应用，可以去应用商店搜索<text class="highlight">小青账</text>下载，我们的项目借鉴了其UI界面和用户行为逻辑，在此基础上进行了简化，如果你想体验更完整流畅的记账，请下载<text class="highlight">小青账</text>。
				</view>
			</mj-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.about {
	.logo {
		height: 500rpx;
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
			color: $mj-text-color;
			line-height: 48rpx;
			.highlight {
				color: $mj-theme-color;
				font-weight: 700;
			}
		}
	}
}
</style>
