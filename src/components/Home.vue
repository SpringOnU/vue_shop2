<template>
    <el-container class='home-container'>
      <!-- 头部区域 -->
      <el-header>
          <div>
              <img src="../assets/heima.png" alt=""/>
              <span>电商后台管理系统</span>
          </div>
          <el-button type='info' @click="logout">退出</el-button>
      </el-header>
      <!------------------------------------------------------------------------------------------->
      <!-- 页面主体区域 -->
    <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 侧边栏菜单 -->
            <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
            <!-- collapse-transition  是否开启折叠动画  boolean true -->
            <!-- unique-opened  是否只保持一个子菜单的展开  boolean false -->
            <!-- collapse 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） boolean false -->
                <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                <!-- key是为Vue中的vnode标记的唯一id,通过这个key,我们的diff操作可以更准确、更快速。 -->
                <!-- :index="item.id + ''" index接收的是字符段 item.id是数值 加一个空字符就可以转化了 -->
                    <!-- 一级菜单的模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>
                    <!--------------------------------------->
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavStage('/' + subItem.path)">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                      <span>{{subItem.authName}}</span>
                    </el-menu-item>
                </el-submenu>
          </el-menu>
            </el-aside>
            <!---------------------------------------------------------------------------------------->
            <!-- 右侧内容主体 -->
            <el-main>
              <!-- 路由占位符 -->
              <router-view></router-view>
            </el-main>
      </el-container>
    </el-container>
    <!-- 开始的时候这些组件都没办法用 需要在element.js中导入一下才行 -->
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据挂载
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 定义生命周期函数
  created () {
    this.getMenuList()// 获取所有左侧菜单
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()// 清空token
      this.$router.push('/login')// 重新到login界面
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus') // 请求地址
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg) // 获取数据失败
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮 切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavStage (activePath) {
      window.sessionStorage.setItem('activePath', activePath) // 前一个是键key名 后一个是值value
      this.activePath = activePath // 解决切换不高亮问题
    }
  }
}
</script>

<style lang="less" scoped>
  .el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between; /* 左右贴边 */
      padding-left: 0;
      align-items: center;  /* 垂直居中 */
      color: #fff;
      font-size: 20px;
      > div {
          display: flex;
          align-items: center;
          span{
              margin-left: 15px;
          }
      }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .home-container{
    height: 100%;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #4A5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
