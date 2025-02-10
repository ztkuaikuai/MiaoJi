# 妙记账单1.0.0(Alpha)🎉🎉

## 妙记是什么

妙记是基于 Vue2 的 Uniapp 和 Unicloud 制作的轻量记账应用。目前有微信小程序端和使用 uni-admin 搭建的后台管理 web 端。

## 演示

![小程序二维码](https://webp.kuaikuaitz.top/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg)

## 快速启动⭐

### 前提条件

1. 妙记通过 HBuilderX 进行开发，在微信开发者工具中预览效果。所以需要你先下载 [HBuilderX](https://hx.dcloud.net.cn/README) 和[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)。

2. 妙记使用 UniCloud 作为云开发平台（可以理解为服务端），需要你在 [UniCloud 控制台](https://unicloud.dcloud.net.cn/)注册登录并创建服务空间，免费的就行，以便后续开发使用。

### 拷贝项目

fork 项目到你的仓库拷贝或者直接通过 `git clone` 命令拷贝[妙记](https://github.com/ztkuaikuai/MiaoJi)到本地，通过 HBuilderX 打开该项目。

### 初始化项目

1. 右键 uniCloud 文件夹，关联你的云服务空间。

2. 创建 uni-id 配置文件。在 `/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center` 下创建 `uni-id` 
文件夹，然后在 `uni-id` 文件夹中创建 `config.json` ，内容为下：

```json
// 配置项参考：https://doc.dcloud.net.cn/uniCloud/uni-id/summary.html#config
{
	"passwordSecret": [{
		"type": "hmac-sha256",
		"version": 1
	}],
	"passwordStrength": "medium",
	"tokenSecret": "这里写你的密钥，可以是无意义的字符串",
	"mp-weixin": {
		"tokenExpiresIn": 259200,
		"tokenExpiresThreshold": 86400,
		"oauth": {
            // 微信小程序登录所用的appid、appsecret需要在对应的小程序管理控制台获取
			"weixin": {
				"appid": "填写你小程序的appid",
				"appsecret": "填写你小程序的appsecret，注意一定不要泄露！"
			}
		}
	},
	"userRegisterDefaultRole": ["USER"]
}
```

3. 上传所有的云函数和数据库表。右键 uniCloud 文件夹中的   `cloudfunctions` ，点击「上传所有云函数、公共模块及 Actions」；右键 `database` ，点击「上传所有 DB Schema (含扩展)」。
    > 如果中途有弹窗，云函数点击「替换」，云数据库勾选「全部创建」后点「是」。

4. 在 `manifest.json` 中更新你的配置。微信小程序配置，将 appid 替换成你自己小程序的 appid ；基础配置，将「uni-app 应用标识」重新获取，利用查找替换将项目中带有 `__UNI__EE89725` 的替换成你自己的。

5. 点击 HBuilder 顶部「运行-运行到小程序模拟器-微信开发者工具」运行项目~

6. 配置小程序合法域名，请[参考文档](https://doc.dcloud.net.cn/uniCloud/publish.html#useinmp)

## 项目结构

```js
uniCloud/               // 使用阿里云的云空间
  |-cloudfunctions/     // 存放云函数、云对象
  |-database/           // 存放数据库表结构，参考文档：https://siu9p6v1zlb.feishu.cn/docx/WvmfdEmzsoBCIhxUpN6cAw8Nn7b?from=from_copylink
.hbuilderx
components/             // 存放妙记的组件
pages/                  // 存放主要模块，即tabbar的4个页面，其余页面分包处理
pagesAccount/           // 记账模块
pagesFilter/            // 未开发完，筛选模块
pagesMy/                // 我的模块
static/                 // 静态资源，存放icon、图片等
uni_modules/            // 存放在插件市场下载的包
unpackage/
utils/                  // 存放可复用的工具函数
.gitignore
App.vue
CHANGELOG.md
index.html
LICENSE
main.js
manifest.json           // 应用的配置文件
pages.json              // 项目页面配置，相当于微信小程序当中的 app.json
README.md
uni.promisify.adaptor.js
uni.scss                // 全局的样式文件
```

## 项目需求跟踪记录
> 欢迎提交 Issues 和 PR

[产品有不足或 Bug ？点我提出需求](https://siu9p6v1zlb.feishu.cn/share/base/form/shrcnNwskrIIk1t1IkOMgG4gisd)

## 1.0.0(2024.07.14) "Suzumiya Haruhi no Shôshitsu"
**⭐添加定时记账功能**

**🌞优化账单页界面加载速度：按需加载账单**

🌞优化界面外观和动画效果

🔧修复消息订阅模块每日记账提醒执行失败的情况

🔧修复图表tooltip定位不准问题

🔧修复账单页触底加载未回显账单问题


## 接下来的规划
- [x] 添加配置默认资产功能
- [x] 添加模板功能
- [x] 添加再记功能
- [x] 添加秒记功能
- [x] 添加微信小程序消息订阅功能
- [x] 添加定时记账功能
- [ ] 添加预算设置功能
- [ ] 添加主题配色功能

## 放在更久的版本更新规划
- [ ] 添加二级分类
- [ ] 添加更多样的筛选功能
- [ ] 添加多账本
- [ ] 更多图表（日历图、面积图）
- [ ] 按年进行筛选数据
- [ ] 按自定义日期进行筛选数据
- [ ] 按记账金额排序
- [ ] 为icon添加多色图标
- [ ] 数据导入导出功能