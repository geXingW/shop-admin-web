<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getCity"
      :data="crud.data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="城市名字" prop="name" />
      <el-table-column :show-overflow-tooltip="true" label="城市代码" prop="code" />
      <el-table-column v-if="checkPer(['admin','menu:edit','menu:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import crudCity from '@/api/common/city'
  import IconSelect from '@/components/IconSelect'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import DateRangePicker from '@/components/DateRangePicker'

  // crud交由presenter持有
  const defaultForm = { id: null, name: null, code: null, parentCode: null }
  export default {
    name: 'CommonCity',
    components: { Treeselect, IconSelect, crudOperation, rrOperation, udOperation, DateRangePicker },
    cruds() {
      return CRUD({ title: '城市管理', url: 'api/sys/city', crudMethod: { ...crudCity }})
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        permission: {
          add: ['admin', 'menu:add'],
          edit: ['admin', 'menu:edit'],
          del: ['admin', 'menu:del']
        },
      }
    },
    methods: {
      getCity(tree, treeNode, resolve) {
        crudCity.list({pid: tree.id}).then((res) => {
          // console.log(res.data.records)
          resolve(res.data.records)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
