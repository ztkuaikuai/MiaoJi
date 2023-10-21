<script>
import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';

export default {
  onLaunch: async function () {
	await uniIdPageInit()
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
// 引入uView基础样式
@import "@/uni_modules/uview-ui/index.scss";
// 引入自定义图标库
@import "@/static/iconfont.css";

// 为每个页面设置公共样式
page {
	background-color: $mj-bg-color;
}

</style>
