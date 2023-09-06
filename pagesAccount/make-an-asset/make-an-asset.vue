<template>
	<view>
		<u-cell-group :border="false" >
			<u-cell :title="asset.title" :isLink="true" @click="clickAsset(index)" v-for="asset,index in assetsStyle" :key="index" >
				<uni-icons slot="icon" :type="asset.icon" size="36rpx" custom-prefix="miaoji" :color="asset.color"></uni-icons>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	import ICONCONFIG from "@/utils/icon-config.js";
	
	export default {
		data() {
			return {
				assetsStyle: [],
			};
		},
		methods: {
			clickAsset(index) {
				uni.navigateTo({
					url: `/pagesAccount/set-asset/set-asset?type=${this.assetsStyle[index].type}`,
				})
			},
			getAssetsStyle() {
				// 缓存中是否有资产样式  如果有 则取缓存，如果没有，则从工具库进行赋值，并存入缓存
				if(uni.getStorageSync('mj-assets-style')) {
					this.assetsStyle = uni.getStorageSync('mj-assets-style')
				} else {
					this.assetsStyle = ICONCONFIG.assetIconList()
					uni.setStorage({
						key:'mj-assets-style',
						data: this.assetsStyle
					})
				}
			},
		},
		onLoad() {
			this.getAssetsStyle()
		}
	}
</script>

<style lang="scss" scoped>

</style>
