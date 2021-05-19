import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue' // 添加路由规则
import Welcome from '../components/Welcome.vue' // 添加路由规则
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Add from '../components/goods/Add.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome', // 重定向 只要你访问了home组件 就会重定向到welcome组件
      children: [ // 子路由
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/Add', component: Add }
      ]
    }
  ]
})

// 挂载路由导航守卫
// 看进入home页面以后如果没有token，就强制跳转回login页面
router.beforeEach((to, from, next) => {
  // to 将要访问的函数
// from 代表从哪个路径跳转而来
// next 代表一个函数 表示放行
//   next( ) 放行  next('/login') 强制跳转到相应界面
  if (to.path === '/login') return next() // 用户要访问登录页面,直接放行
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断token
  if (!tokenStr) return next('/login')
  next()
})

export default router // 暴露路由对象
