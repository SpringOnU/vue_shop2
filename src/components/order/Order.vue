<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                      <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag v-else type="danger" >未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="update_time">
                    <template slot-scope="scope">
                        {{scope.row.update_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="goods_name">
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

<!--     <el-dialog title="物流进度" :visible.sync="progressVisible" width="30%">
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                {{activity.content}}
            </el-timeline-item>
        </el-timeline>
    </el-dialog> -->
    </div>
</template>

<script>
import cityData from './citydata.js'

export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderlist: [],
            addressVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            addressRules: {
                address1: [
                    { required: true, message: '请选择省市区县', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },
            cityData,
            progressVisible: false,
            progressInfo: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单列表数据失败');
            }
            this.$message.success('获取订单列表数据成功');
            console.log(res);
            this.total = res.data.total;
            this.orderlist = res.data.goods;
        },

        // 监听pagesize改变
        handleSizeChange(newSize) {
            // 把新获取到的pageSize赋值给queryInfo里面的pageSize
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },

        // 监听pagenum的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },

        showBox() {
            this.addressVisible = true
        },

        addressDialogClosed() {
        this.$refs.addressFormRef.resetFields()
        },

        async showProgressBox() {
            this.progressVisible = true;

            const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

            if (res.meta.status !== 200) {
                return this.$message.error('获取物流数据失败');
            }

            this.progressInfo = res.data;
            console.log(this.progressInfo);
        }
    }
}
</script>

<style scoped>
/* @import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css'; */
.el-cascader{
    width: 100%;
}
</style>
