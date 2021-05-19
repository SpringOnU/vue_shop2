<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false" class="treeTable">
                <!-- selection-type复选框 expand-type展开行 show-index索引 show-row-hover高亮-->

                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>

                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete"  size="mini"> 删除</el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                <!-- handleSizeChange监听pagesize handleCurrentChange改变监听pagenum的改变 :current-page数据绑定 :page-sizes显示的页数 :page-size现在处于的页码 -->
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">

                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级分类：">
                    <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable change-on-select multiple="false">
                        <!-- v-model必须指定数组 :options指定数据源 :props指定配置对象 parentCateChange @change选择项变化触发 clearable	是否支持清空选项-->
                    </el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表，默认为空
            catelist: [],
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
            },
            {
                label: '是否有效',
                type: 'template', /* 将当前列定义为模板列 */
                template: 'isok' /* 表示当前这一列使用模板名称 */
            },
            {
                label: '排序',
                type: 'template', /* 将当前列定义为模板列 */
                template: 'order' /* 表示当前这一列使用模板名称 */
            },
            {
                label: '操作',
                type: 'template', /* 将当前列定义为模板列 */
                template: 'opt' /* 表示当前这一列使用模板名称 */
            }],
            // 控制添加分类对话框的显示
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 要添加的分类的名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 当前默认等级为0 一级分类
                cat_level: 0
            },
            // 添加表单验证规则
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级分类列表
            parentCateList: [],
            // 指定级联选择器配置对象
            cascaderProps: {
                value: 'cat_id', /* value	指定选项的值为选项对象的某个属性值 */
                label: 'cat_name', /* label	指定选项标签为选项对象的某个属性值 */
                children: 'children' /* children	指定选项的子选项为选项对象的某个属性值 */
            },
            // 选中的父级分类id数组
            selectedKeys: []
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories',  {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取信息失败')
            }
            // console.log(res.data)
            // 把数据列表赋值给cateList
            this.catelist = res.data.result
            this.total = res.data.total
        },

        // 监听pagesize改变
        handleSizeChange(newSize) {
            // 把新获取到的pageSize赋值给queryInfo里面的pageSize
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },

        // 监听pagenum的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },

        // 点击按钮展示添加分类的对话框
        showAddCateDialog() {
            // 1. 获取父级对话框
            this.getParentCateList();
            // 2. 展示对话框
            this.addCateDialogVisible = true;
        },

        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败');
            }
            this.parentCateList = res.data;
        },

        // 选择项变化触发
        parentCateChanged() {
            // console.log(this.selectedKeys);
            // 如果selected中的数组length大于0 证明选中了父级分类
            // 反之 没有选中父级分类
            if (this.selectedKeys.length > 0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length;
            } else {
                this.addCateForm.cat_pid = 0;
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = 0;
            }
        },

        // 点击按钮添加新的分类
        addCate() {
            // console.log(this.addCateForm);
            // 预验证
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return // 预校验失败
                const { data: res } = await this.$http.post('categories', this.addCateForm);

                if (res.meta.status !== 201) {
                return this.$message.error('添加分类失败');
                }

                this.$message.success('添加分类成功');
                this.getCateList();
                this.addCateDialogVisible = false;
            });
        },

        // 监听对话框关闭事件 重置表单数据
        addCateDialogClosed() {
            // 重置分类名称
            this.$refs.addCateFormRef.resetFields();
            // 重置父级分类
            this.selectedKeys = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        }
    }
}
</script>

<style lang="less" scoped>
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
