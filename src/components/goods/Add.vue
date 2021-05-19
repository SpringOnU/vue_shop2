<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
              <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
              <el-steps :space="200" :active="activeIndex - 0" finish-status="success"  align-center>
                  <!-- active接收数值类型的字符串 字符类变成数值类只需要减0 -->
                <el-step title="基本信息">
                </el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
                </el-steps>

                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">

                <!-- tab栏区域 -->
                    <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addForm.goods_name"></el-input>
                            </el-form-item>

                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addForm.goods_number"  type="number"></el-input>
                            </el-form-item>

                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addForm.goods_price" type="number"></el-input>
                            </el-form-item>

                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addForm.goods_weight" type="number"></el-input>
                            </el-form-item>

                            <el-form-item label="商品分类" prop="">
                                <el-cascader expand-trigger= 'hover' :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
                                    <!-- v-model必须指定数组 :options指定数据源 :props指定配置对象 parentCateChange @change选择项变化触发 clearable	是否支持清空选项-->
                                </el-cascader>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="商品参数" name="1">
                            <!-- 渲染表单item项 -->
                            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
                                  <el-checkbox-group v-model="item.attr_vals">
                                    <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i.attr_id" border>
                                        <!-- cb名称；i索引 -->
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="商品属性" name="2">
                            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
                                <el-input v-model="item.attr_vals" disabled></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name="3">
                            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                                <!-- action上传图片时选择的后台api接口 应填写完整的api地址 在main.js中寻找根路径 再在后面加上api文档中的请求路径
                                :headers="headerObj" 图片上传界面的headers请求头对象 相当于权限的token
                                     -->
                            <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-tab-pane>

                        <el-tab-pane label="商品内容" name="4">
                            <!-- 富文本编辑器组件 -->
                              <quill-editor v-model="addForm.goods_introduce"/>
                              <!-- 添加商品 -->
                              <el-button type="primary" class="btnAdd"  @click="add">添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            activeIndex: '0',
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: 0, /* 商品所属的分类数组 */
                pics: [],
                goods_introduce: '',
                attrs: []
            },
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],

                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],

                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],

                goods_number: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],

                goods_cate: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            catelist: [],
            cateProps: {
                label: 'cat_name', /* 看到的 */
                value: 'cat_id', /* 选中的 */
                children: 'children' /* 父子节点的嵌套 */
            },
            // 商品参数 动态参数列表
            manyTabData: [],
            // 商品参数 静态参数列表
            onlyTabData: [],
            // 上传图片的url地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传界面的headers请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',
            previewVisible: false
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')

            if (res.meta.status !== 200) {
                return this.$message.error('获取商品列表失败');
            }

            this.catelist = res.data
            // console.log(this.catelist);
        },

        handleChange() {
            // console.log(this.addForm.goods_cat)
            if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
            }
        },

        beforeTabLeave(activeName, oldActiveName) {
            // console.log(activeName, oldActiveName);
            /* 即将进入的标签页名称activeName,
            即将离开的标签页名称oldActiveName */
            /* return false 阻止标签页的切换 */

            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类');
                return false
            }
        },

        async tabClicked() {
            /* console.log(this.activeIndex); */

            // 访问商品参数面板
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: 'many'
                    }
                })
                if (res.meta.status !== 200) {
                return this.$message.error('获取动态参数列表失败');
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manyTabData = res.data
                /* console.log(this.manyTabData); */
            }

            // 访问静态属性面板
            if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: 'only'
                    }
                })

                if (res.meta.status !== 200) {
                return this.$message.error('获取静态参数列表失败');
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                this.onlyTabData = res.data
                /* console.log(this.onlyTabData); */
            }
        },
        // 监听图片上传成功的条件
        handleSuccess(response) {
            /* console.log(response); */
            // 1. 拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            // 2. 将图片信息对象push到pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)
        },
        // 处理移除图片的效果
        handleRemove(file) {
            console.log(file)
            // 1. 获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // 2. 从 pics 数组中，找到这个图片对应的索引值 x的pic属性正好等于filePath
            const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
            this.addForm.pics.splice(i, 1)
            console.log(this.addForm)
        },
        // 处理图片预览效果
        handlePreview(file) {
            console.log(file);
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 添加商品
        add() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请添加必要表单项');
                }

                // 执行添加的业务逻辑
                // lodash cloneDeep(obj)
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 处理动态参数
                this.manyTabData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTabData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                console.log(form)
                // this.addForm.goods_cat = this.addForm.goods_cat.join(',') this.addForm和级联选择器的el-cascader双向绑定，级联选择器中要求的是以数组形式，而添加商品要求的是字符串，所赐矛盾冲突了。解决方法：深拷贝。

                // 发起请求 添加商品
                // 商品名称必须唯一
                const { data: res } = await this.$http.post('goods', form)
                if (res.meta.status !== 201) {
                return this.$message.error('添加商品失败');
                }
                this.$message.success('添加商品失败')
                this.$router.push('/goods')
        })
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
    .el-checkbox {
        margin: 0 10px 0 0 !important; // 提升指定样式规则的应用优先权 让浏览器首选执行这个语句
    }
    .previewImg {
        width: 100%;
    }
</style>
