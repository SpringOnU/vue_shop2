<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">    <!-- 数据绑定  千万还要注意顺序-->
            <!-- ref="loginFormRef" 可以对所有内容框进行引用 拿到el-from的实例对象 可以直接调用“resetFields”=>对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
                 :model 双向数据绑定-->
                <el-form-item prop="username">  <!-- 用户名 -->
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" ></el-input>
                </el-form-item>
                <el-form-item prop="password"> <!-- 密码 -->
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns"> <!-- 按钮 -->
                    <el-button type="primary" @click="login">登录</el-button> <!-- 安插登录预验证 -->  <!-- validate函数 对整个表单进行校验 -->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                    <!-- @click=" " 绑定单击重置事件 -->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    // 点击重置按钮 重置登录表单
    resetLoginForm () {
      // console.log(this) 可以引用访问 $refs
      this.$refs.loginFormRef.resetFields()
      // 调用resetFields函数代码
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => { // 随便起一个名字就可以 valid只是代表了这个布尔值 如果输入的用户名和密码都合法 就打印出true 不合法就打印出false 和valid没多大关系
      // validate() => 参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      // Function(callback: Function(boolean, object))
        // console.log(valid) 这里就会返回 true /false
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(result)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // console.log(res)
        //   1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //     1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //     1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
        // router跳转 home页面
      })
    }
  }
}
</script>

<style lang="less" scoped>
// scoped 只在当前组件内生效
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd; // 向外扩散10px
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {   // 盒子内置样式
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
