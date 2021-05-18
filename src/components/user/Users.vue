<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区 -->
            <div style="margin-top: 15px;">
                <el-row :gutter="20">   <!-- gutter格与格之间的空隙 -->
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
                            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                        </el-input>
                    </el-col>   <!-- span格子的大小 -->
                    <el-col :span="4">
                        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                    </el-col>
                </el-row>

                <!-- 用户列表区 -->
                <el-table :data="userlist" border stripe>   <!-- stripe隔行变色 -->
                    <!-- :data="userlist"绑定数据源 -->
                    <el-table-column type="index" label="#"></el-table-column>    <!-- 索引列 -->
                    <el-table-column prop="username" label="姓名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column prop="role_name" label="角色"></el-table-column>
                    <el-table-column label="状态">
                        <!-- 指定了作用域插槽就可以不要prop了 因为会覆盖 -->
                        <template slot-scope="scope">
                            <!-- {{scope.row.mg_state}} scope.row拿到这一行数据 -->
                            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                                <!-- change监听switch开关的改变 -->
                            </el-switch>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <!-- 编辑按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                            <!-- 分配角色 -->
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                <!-- enterable	鼠标是否可进入到 tooltip 中	Boolean	—	true -->
                                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 用户分页 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                     <!-- size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
                          current-change 页码值切换
                          page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项，
                          :current-page 当前是第几页=>可以通过queryInfo里面的pagenum拿到
                          :page-sizes 写了几 这页里面就会显示几条
                          :page-size 当前这一页显示了几条 => 可以通过queryIfo里面的pagesize拿到
                          layout 指定页面上展示什么布局结构
                          :total 一共有多少数据 绑定即可-->
                </el-pagination>
            </div>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed" width="50%">
            <!-- title：弹出框的标题
                 :visible.sync 用来控制对话框的打开和关闭 布尔值 -->
            <!-- 内容处理区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

            <!-- 修改用户对话框 -->
            <el-dialog title="修改用户" width="50%" :visible.sync="editDialogVisible" @close="editDialogClosed">
                <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled><!-- 为什么是username呢 要看响应数据而不是参数 --></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"><!-- 为什么是username呢 要看响应数据而不是参数 --></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"><!-- 为什么是username呢 要看响应数据而不是参数 --></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色对话框 -->
            <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%"  @close="setRoleDialogClosed">
                <div>
                    <p>当前的用户：{{userInfo.username}}</p>
                    <p>当前的角色：{{userInfo.role_name}}</p>
                    <p>
                        分配新角色：
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                                <!-- :label看到的选项框 :value真正选中的 -->
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
            // 合法的邮箱
            return cb()
        }
        cb(new Error('请输入合法的邮箱'))
        }

        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
            return cb()
        }
        cb(new Error('请输入合法的手机号'))
        }

        return {
            // 先将get参数定义到data数据中
            queryInfo: {
                query: '', /* 搜索关键字 */
                pagenum: 1, /* 当前的页数 */
                pagesize: 2 /* 当前每页显示几条 */
            },
            userlist: [],
            total: 0,
            addDialogVisible: false, /* 控制添加用户对话框的显示和隐藏 */

            // 添加用户表单数据
            addForm: {
                username: '',
                password: '',
                email: ''
            },

            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符之间', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },

            editDialogVisible: false, /* 控制修改用户对话框的显示和隐藏 */
            editForm: {}, /* 查询到的用户信息对象 */
            editFormRules: { /* 验证规则 */
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]

            },

            // 控制分配角色对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 需要被分配角色的用户信息
            userInfo: {},
            // 所有角色列表
            rolesList: [],
            // 已选中的角色id值
            selectedRoleId: ''
        }
    },
    created() { // 发起首批数据请求;
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            // users请求地址 要携带一些get参数 get参数用params来指定 由api文档可知参数包含3个属性 query、pagenum、pagesize
            // await 得到一个数据对象
            // 从这个数据对象上解构得到一个data属性 命名为 res
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userlist = res.data.users
            this.total = res.data.total
            // console.log(res);
        },
        // 监听pageSize改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList(); /* 重新发起请求 获取数据 */
        },
        // 监听页码的改变
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        async userStateChange(userInfo) {
            // console.log(userInfo);
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state  // 失败了就把原来状态返回去
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },

        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
            // this.$refs[formName].resetFields(); 重置表单
        },

        // 点击按钮，添加新用户
        addUser() {
            // 预验证
            this.$refs.addFormRef.validate(async valid => {
                // validate表单验证
                // console.log(valid); 返回布尔值 false true
                if (!valid) return;
                // else 可以发起添加用户的网络请求

                const { data: res } = await this.$http.post('users', this.addForm)
                // 会返回一个promise 所以为了简化操作 => async

                if (res.meta.status !== 201) {
                    // 根据状态码判断 状态码在文档中有
                    return this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏添加对话框
                this.addDialogVisible = false;
                // 刷新用户列表
                this.getUserList();
            })
        },

        // 修改用户信息
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('users/' + id); /* 发起get请求 */
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户失败');
            }
            this.editForm = res.data; /* 把查询到的用户信息保存到editForm身上 */
            this.editDialogVisible = true;
        },

        // 监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },

        // 修改用户信息并提交
        editUserInfo() {
            // 预验证
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return // 返回结束
                // 发起请求
                const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                     email: this.editForm.email,
                     mobile: this.editForm.mobile
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败');
                }

                // 关闭对话框
                this.editDialogVisible = false;
                // 刷新数据列表
                this.getUserList();
                // 提示修改成功
                this.$message.success('更新用户信息成功');
            });
        },

        // 根据id删除用户信息
        async removeUserById(id) {
            // 弹框询问用户是否删除数据
            const conFirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                    }).catch(err => err)

                    // 如果用户确认删除，则返回值为字符串 confirm
                    // 如果用户取消了删除 则返回值为字符串cancel
                    // console.log(confirmResult)
                    if (conFirmResult !== 'confirm') {
                        return this.$message.info('已取消删除')
                    }
                    // 确认删除用户信息
                    // console.log('确认了删除');
                    const { data: res } = await this.$http.delete('users/' + id)/* 这就是上面接收的形参 */
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除用户失败');
                    }
                    this.$message.success('删除用户成功');
                    this.getUserList();
        },

        // 展示分配角色的对话框
        async setRole(userInfo) {
            this.userInfo = userInfo;

            // 在展示对话框之前获取所有角色列表
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败');
            }
            this.rolesList = res.data;
            this.setRoleDialogVisible = true;
        },

        // 点击按钮分配角色
        async saveRoleInfo() {
            if (!this.selectedRoleId) {
                return this.$message.error('请选择要分配的角色');
            }
            // console.log(this.userInfo.id);

            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,
                {
                    rid: this.selectedRoleId
                }
            )
            // console.log(res);

            if (res.meta.status !== 200) {
                return this.$message.error('更新角色失败');
            }
            this.$message.success('更新角色成功');
            this.getUserList();
            this.setRoleDialogVisible = false;
            /* 不要尝试修改admin角色 会气死的 因为提示了 data: null meta: msg: "不允许修改admin账户" status: 400 吃一堑长一智 记得多思考多尝试嗯嗯 */
        },

        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed() {
            this.selectedRoleId = ''
            this.userInfo = {}
        }
    }
}
</script>

<style lang="less" scoped>

</style>
