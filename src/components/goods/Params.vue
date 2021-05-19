<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert title="注意：只允许为第三季分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                <span>选择商品分类：</span>
                <!-- 选择商品分类的级联选择框 -->
                <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange">
                </el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">

                    <!-- 添加动态参数 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>

                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                    <!-- @keyup.enter.native 失去了焦点或者是点击了回车 都会触发这个的函数 -->
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template  slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加静态属性 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible=true">添加属性</el-button>

                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                    <!-- @keyup.enter.native 失去了焦点或者是点击了回车 都会触发这个的函数 -->
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加动态参数、静态属性的对话框 -->
        <!-- 动态参数、静态属性的对话框是同一个 -->
        <!-- title="titleText()" 这里的title不能写死了 用计算属性变成动态的 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// 33
export default {
    data() {
        return {
            // 商品分类列表
            catelist: [],
            // 级联选择框的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择器双向绑定到的数组
            selectedCateKeys: [],
            // 被激活的页签的名称 默认的
            activeName: 'many',
            // 动态参数
            manyTableData: [],
            // 静态属性
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },
            // 控制编辑对话框的显示与隐藏
            editDialogVisible: false,
            // 修改参数的表单数据对象
            editForm: {
                attr_name: ''
            },
            // 修改表单的验证规则对象
            editFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取所有的商品分类列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取列表数据失败');
            }
            this.catelist = res.data;
            // console.log(this.catelist);
        },

        // 级联选择框变化会触发这个数组
        // 选中必须是三级分类
        handleChange() {
            this.getParamsData();
        },

        // Tab页签点击事件的处理函数
        handleTabClick() {
            console.log(this.activeName);
            this.getParamsData();
        },

        // 获取参数的列表数据
        // 是为了解决切换动态参数和静态属性时重新调用获取整个数据列表
        // 在handleTabClick()=>tab页切换的时候、handleChange()=>级联选择框切换的时候 都会重新调用获取的
        async getParamsData() {
            // 证明选中的不是三级分类
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }

            // console.log(this.selectedCateKeys);

            // 根据所选分类的id和当前所处的面板获取获取对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
            if (res.meta.status !== 200) {
                return this.$message.error('获取参数列表失败');
            }

            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                // 原本为一个字符串 现在用空格把它分开了 成为了一个数组
                // 用三元表达式 如果为空 就返回一个false 空白的数组

                // 添加tag会出现上下联动现象 => 原因存在于`inputVisible` `inputValue`相同 就在顺序循环中控制他文本框的显示和隐藏

                // 添加tag标签 可以用来控制添加tag标签的文本框展示与否
                item.inputVisible = false;
                // 文本框中输入的内容
                item.inputValue = '';
            })
            console.log(res.data);

            // 现在是不知道res.data到底是哪个部分 是静态呢还是动态 就需要我们加以判断 从而挂载到那个表格当中
            if (this.activeName === 'many') {
                this.manyTableData = res.data;
            } else {
                this.onlyTableData = res.data;
            }
        },

        // 监听对话框的关闭事件
        addDialogClosed() {
            // 清空验证规则
            this.$refs.addFormRef.resetFields();
        },

        // 点击按钮 参加参数
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return // 验证失败
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) return this.$message.error('添加失败')
                this.$message.success('添加成功');
                this.addDialogVisible = false;
                this.getParamsData();
            })
        },

        // 点击按钮展示修改对话框
        async showEditDialog(attrId) {
            // 查询当前参数的信息
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes/${attrId}`,
                {
                params: { attr_sel: this.activeName }
                }
            )

            if (res.meta.status !== 200) {
                return this.$message.error('获取参数信息失败！')
            }

            this.editForm = res.data
            this.editDialogVisible = true
        },

        // 重置修改的表单
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },

        // 点击按钮 修改参数
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })

                if (res.meta.status !== 200) {
                return this.$message.error('修改失败');
            }
                this.$message.success('修改成功');
                this.getParamsData();
                this.editDialogVisible = false;
            })
        },

        // 删除参数
        async deleteDialog(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err) // 捕获错误消息

            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)

            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！')
            }

                this.$message.success('删除成功');
                this.getParamsData();
        },

        // 添加tag小标签 失去了焦点或者是点击了回车 都会触发
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                // trim()方法会去掉字符串两端的空格
                row.inputValue = ''
                // 失去焦点 不展示文本框
                row.inputVisible = false
                return
            }
            // 如果没有return 证明输入了内容 需要做后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false

             this.saveAttrVals(row)
        },

        // 添加tag小标签 点击添加按钮 都会触发
        showInput(row) {
            row.inputVisible = true;

            // 让文本框自动获得焦点
            // $nextTick 作用 => 当页面上元素被重新渲染之后 才会指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        // 删除tag小标签 删除对应的参数选项
        handleClose(i, row) {
            // 删除这一项
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        },

        // 发起请求 保存这次操作 传输到后台数据中去
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ') // 用空格进行字符串拼接
            })

            if (res.meta.status !== 200) {
                return this.$message.error('修改参数失败！')
            }

            this.$message.success('修改参数成功');
        }
    },
    computed: { // 计算属性

        // 如果按钮需要被禁用 返回true 否则false
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },

        // 当前选中的三级分类的id
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null // 没有这个地址
        },

        // 动态计算标题文本
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 10px;
}
.el-input {
    width: 120px;
}
</style>
