<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col>
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />

            <date-range-picker v-model="query.createTime" class="date-item" />
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" 
        :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form
            ref="form"
            :inline="true"
            :model="form"
            :rules="rules"
            size="small"
            label-width="80px"
          >
            <el-form-item label="订单编号" prop="id">
              <el-input v-model="form.id" style="width: 400px"/>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 150%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
          <el-table-column prop="id" label="订单编号"/>
          <el-table-column prop="memberId" label="下单人"/>

          <el-table-column prop="totalAmount" label="订单总额"/>

          <el-table-column prop="itemAmount" label="商品总额"/>

          <el-table-column prop="freightAmount" label="运费总额"/>

          <el-table-column prop="createTime" label="创建时间"/>

          <el-table-column
            v-if="checkPer(['admin','user:edit','user:del'])"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import curdOrder from '@/api/order/order'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const defaultForm = { 
  id: null, 
}
const optShow = { add: false, edit: true, del: true, download: true, reset: true }
export default {
  name: 'OrderList',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '订单', url: 'api/order', crudMethod: { ...curdOrder }, optShow})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: [],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'order:add'],
        edit: ['admin', 'order:edit'],
        del: ['admin', 'order:delete']
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  },
  created() {},
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
