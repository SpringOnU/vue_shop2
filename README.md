# Vue电商管理系统

## 一、 项目目录树结构



├─.eslintrc.js  				   语法检测 在其中配置相关语法命令

├─babel.config.js		      项目发布阶段需要用到的bable插件

├─package-lock.json
├─package.json
├─README.md
├─vue.config.js			      发布模式/开发模式=>处理静态文件
├─src
|		  ├─ App.vue					   项目根组件
|		  ├─main-dev.js			     项目入口
|		  ├─main-prod.js
|		  ├─router					       路由组件
|		  |		   └index.js
|		  ├─plugins						
|		  |		    ├─element.js			   Element-ui组件
|		  |		    ├─timeline-item
|		  ├─components					    通用组件文件夹
|		  |		     ├─Home.vue			  主页组件
|		  |		     ├─Login.vue			   登录组件 
|		  |		     ├─Welcome.vue
|		  |		     ├─user
|		  |		     |		  └Users.vue
|		  |		     ├─report
|		  |		     |		   └Report.vue
|		  |		     ├─power
|		  |		     |		   ├─Rights.vue
|		  |		     |		   └Roles.vue
|		  |		     ├─order
|		  |		     |		   ├─citydata.js
|		  |		     |		   └Order.vue
|		  |		     ├─goods
|		  |		     |		   ├─Add.vue
|		  |		     |		   ├─Cate.vue
|		  |		     |		   ├─List.vue
|		  |		     |		   └Params.vue
|		  ├─assets
|		  |		   ├─heima.png
|		  |		   ├─logo.png
|		  |		   ├─fonts
|		  |		   |		   ├─demo.css
|		  |		   |		   ├─demo_fontclass.html
|		  |		   |		   ├─demo_symbol.html
|		  |		   |		   ├─demo_unicode.html
|		  |		   |		   ├─iconfont.css
|		  |		   |		   ├─iconfont.eot
|		  |		   |		   ├─iconfont.js
|		  |		   |		   ├─iconfont.svg
|		  |		   |		   ├─iconfont.ttf
|		  |		   |		   └iconfont.woff
|		  |		   ├─css
|		  |		   |		  └global.css
├─public
|		   ├─favicon.ico
|		   └index.html
