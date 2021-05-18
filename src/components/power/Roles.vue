<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'',  'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 :span="5"占行五列-->
                            <el-col :span="5">
                                <el-tag closable @close="removeUserById(scope.row, item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!--  通过for循环嵌套循环二级权限 -->
                                <el-row :class="[i2 === 0 ? '':'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeUserById(scope.row, item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeUserById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <!-- 分配角色 -->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="修改用户" width="50%"  :visible.sync="editDialogVisible">
                <el-form ref="editFormRef" :model="editForm"  label-width="70px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRolesInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配权限的对话框 -->
            <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
                <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"><!-- 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 只要你选中了这个节点 你就选中了我的id值  :default-checked-keys="defKeys"默认选择权限 在"defKeys"中定义选中的id -->
                </el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            rolelist: [],
            editForm: {},
            editDialogVisible: false,
            setRightDialogVisible: false,
            // 所有权限的数据
            rightslist: [],
            // 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            defKeys: [],
            // 当前即将分配角色的角色id
            roleId: []
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败');
            }
            this.rolelist = res.data;
        },

        async showEditDialog(id) {
            // console.log(id);
            const { data: res } = await this.$http.get('roles/' + id);
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户失败');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        editRolesInfo() {
            // 预验证
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return // 返回结束
                // 发起请求
                const { data: res } = await this.$http.put('roles/' + this.editForm.id, {
                     roleName: this.editForm.roleName,
                     roleDesc: this.editForm.roleDesc
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败');
                }

                // 关闭对话框
                this.editDialogVisible = false;
                // 刷新数据列表
                this.getRolesList();
                // 提示修改成功
                this.$message.success('更新用户信息成功');
            });
        },

        // 根据id删除对应的权限
        async removeUserById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err) // 捕获取消操作

            if (confirmResult !== 'confirm') {
                return this.$message.info('取消了删除');
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);

            if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败');
            }

            // this.getRolesList(); 会重新渲染 关闭了整个权限区
            role.children = res.data; // 最新权限直接赋值给属性
        },

        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id
            // 获取所有权限的数据
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                    return this.$message.error('获取权限数据失败');
            }

            // 把获取到的权限数据保存到data中
            this.rightslist = res.data;
            // 递归获取三级权限的id
            this.getLeafKeys(role, this.defKeys);
            this.setRightDialogVisible = true;
            // console.log(this.rightslist);
        },
        // 通过递归的形式 获取所有角色下的三级权限的id并保存到数组中
        getLeafKeys(node, arr) {
            // node 节点判断是否是三级节点 arr 数组进行保存
            if (!node.children) { // 不包含children属性
                return arr.push(node.id)
            }
            node.children.forEach(item => this.getLeafKeys(item, arr))
            // 把 item当做节点传进去   this.getLeafKeys(item, arr)再次调用递归函数
        },

        // 监听分配角色权限的关闭事件
        setRightDialogClosed() {
            // 每次对话框关闭后都清空一下数组 不然会越来越多
            this.defKeys = [] // 重新赋值
        },

        // 点击为角色分配权限
        // 勾选了状态 应该向服务器发起请求 将这个状态保存到服务器当中
        // 通过拿到id来实现
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(), // getCheckedKeys() 拿到所有已选中的id数组 ...是展开运算符 放到数组中
                this.$refs.treeRef.getHalfCheckedKeys() // getHalfCheckedKeys() 拿到所有半选中的id数组
            ];
            const idStr = keys.join(','); // 以 `,` 分割的权限 ID 列表

            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr });
            // rids权限 ID 列表（字符串）以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）

            if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败');
            }
            this.$message.success('分配权限成功');
            this.getRolesList();
            this.setRightDialogVisible = false;
        }

    }
}
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }
</style>
