# 妙记——开发中


## 接下来的规划
- 写页面逻辑
- 筛选页缺少按钮以及表单验证
- 发现隐性bug：icon-config一旦缓存，用户不能进行更新。如果后续添加新的icon，老用户看不见

## 9.7 --2 
- 优化界面UI
- 编写数据库逻辑，获取按月的账单总支出，总收入
- 渲染主页账单
- 修复bug :其他用户添加不了资产，记不了账  原因：where中逻辑错误，where中不可以使用schema中的变量名doc和auth

## 9.7 --1
- 转账逻辑跑通
- 设置用户若没有资产则创建默认资产
- 跑通记账页
- 将获取icon样式的方法封装进icon-config函数

## 9.6 --2
- keyboard逻辑完成
- 支出与收入逻辑完成


## 9.6 --1
- 删除keyboard组件
- 记账页静态（收入、转账页）完成


## 9.5 --2
- 优化金额精度
- 跑通CRUD资产逻辑
- 引入License——MIT


## 9.5  --1
- 配置自定义icon，替换icon组件
- 首页资产页面优化


## 9.4
- 配置记账相关数据库，初步完成。（资产表，账单表，模板表）
- 配置用户注册默认角色USER，优化相关数据库schema的create权限
- 封装mj-icon-with-backgroud组件


## 9.3
- 优化用户体验（系统后台隐藏页面内容、登录体验优化、表单验证优化）


## 9.2  --2
- 优化用户登录相关逻辑（即老用户token过期跳转到登录页，但是不登陆，返回到主页后可以点击所有tabBar页面）
- 封装一个检查用户状态的js工具库


## 9.2  --1
- 完成资产相关静态
- 完成配置资产页表单验证
- 配置自动路由，判断用户登录状态


## 9.1  --2
- 融入uni-id体系，实现用户登录、设置头像和nickname功能


## 9.1  --1
- 修改图表的loading效果，图表的层级问题 
- 饼图中月支出和月收入的按钮点击范围


## 8.31  --2
- 完成筛选页面静态
- 修改mj-datetype-picker组件，删除选择自定义日期功能


## 8.31  --1
- 图表静态完成
- 非tabBar页面使用subPackages分包
- 记账页面静态完成
- 封装mj-keyboard组件，修改uView中keyboard相关组件样式和逻辑
- 封装mj-card组件，修改uni-section中样式
- 用户信息页静态完成


## 8.28-8.30
- 4个tabBar静态页面完成
- 封装mj-datetype-picker组件
- 封装mj-category、bill-card组件


##放在更久的版本更新规划
- 添加模板功能
- 添加定时记账功能
- 添加预算设置
- 用户自定义默认资产
- 自定义配色
- 添加二级分类
- 添加多账本
- 更多图表（日历图、面积图）
- 按自定义日期进行筛选数据
- 按记账金额排序
- 为icon添加多色图标
