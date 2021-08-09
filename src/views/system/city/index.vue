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

    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="城市名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="城市代码" prop="code">
          <el-input-number
            v-model.number="form.code"
            :min="100000"
            :max="999999"
            controls-position="right"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" label="所属城市" prop="parentCode">
          <treeselect
            v-model="form.parent_code"
            :load-options="loadCities"
            :options="cities"
            style="width: 370px;"
            placeholder="选择所属城市"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

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
  import crudCity from '@/api/system/city'
  import IconSelect from '@/components/IconSelect'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import DateRangePicker from '@/components/DateRangePicker'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

  // crud交由presenter持有
  const defaultForm = { id: null, name: null, code: null, parentCode: null }
  export default {
    name: 'SystemCity',
    components: { Treeselect, IconSelect, crudOperation, rrOperation, udOperation, DateRangePicker },
    cruds() {
      return CRUD({ title: '城市管理', url: 'api/sys/city', crudMethod: { ...crudCity }})
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
      	cities: [],
		rules: {
			name: [
			  { required: true, message: '请输入城市名称', trigger: 'blur' }
			],
			parentCode: [
			  { required: true, message: '请输入城市编号', trigger: 'blur', type: 'number' }
			]
		},
        permission: {
          add: ['admin', 'menu:add'],
          edit: ['admin', 'menu:edit'],
          del: ['admin', 'menu:del']
        },
      }
    },
    methods: {
		loadCities({action, treeNode, resolve}) {
			console.log("load")
			crudCity.list({ parent_code: treeNode.code, page: 1, size: 9999 }).then(({ data }) => {
				parentNode.children = data.records
				console.log(data)
				resolve()
			})
		},
		getCity(tree, treeNode, resolve) {
			crudCity.list({parentCode: tree.code}).then((res) => {
			  resolve(res.data.records)
			})
		},
		buildCities(cityId) {
			let that = this
			crudCity.buildTree({id: cityId}).then(({data}) => {
				that.cities = data
				console.log(data)
			})
		},
        // 新增与编辑前做的操作
		[CRUD.HOOK.afterToCU](crud, form) {
			// 新增
			if(!form.id) {
				this.buildCities(-1)
			}else {	// 编辑
				this.buildCities(form.id)
			}
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
