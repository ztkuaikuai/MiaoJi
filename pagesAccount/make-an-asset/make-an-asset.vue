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
		},
		onLoad() {
			this.assetsStyle = ICONCONFIG.getAssetsStyle()
		}
	}
</script>

<style lang="scss" scoped>

</style>
