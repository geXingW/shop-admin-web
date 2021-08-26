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
	        <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" style="width: 230px"/>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" type="number" min="0" max="99" style="width: 80px"/>
            </el-form-item>
            <el-form-item label="属性分类" prop="categoryId">
              <el-input v-model="form.categoryId" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="输入类型" prop="inputType">
              <el-input placeholder="请输入可选值，多个值之间','分割" :disabled="form.inputType == 0" 
              v-model="form.inputValue" style="width: 400px">
			    <el-select v-model="form.inputType" slot="prepend" placeholder="输入类型" style="width: 100px">
	              <el-option 
	              v-for="item in dict.prod_attr_input_type" 
	              :key="item.value" 
	              :label="item.label" 
	              :value="item.value"/>
			    </el-select>
			  </el-input>
            </el-form-item>
            <el-form-item label="属性搜索" prop="searchable">
	          <el-input placeholder="请输入搜索关键字" :disabled="form.searchable == false" v-model="form.searchKeywords" style="width: 400px">
			    <el-select v-model="form.searchable" slot="prepend" placeholder="是否支持搜索" style="width: 100px">
	    	      <el-option key="0" label="禁止搜索" :value="false" />
	    	      <el-option key="1" label="支持搜索" :value="true" />
			    </el-select>
			  </el-input>
            </el-form-item>

		  </el-form>
		</el-dialog>

        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 150%;" @selection-change="crud.selectionChangeHandler">
			<el-table-column type="selection" width="55" />

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
	import rrOperation from '@crud/RR.operation'
	import udOperation from '@crud/UD.operation'
	import crudOperation from '@crud/CRUD.operation'
	import Treeselect from '@riophae/vue-treeselect'
	import DateRangePicker from '@/components/DateRangePicker'
	import CRUD, { presenter, header, form, crud } from '@crud/crud'
	import crudProdAttr from '@/api/product/attribute'

	// crud交由presenter持有
	const defaultForm = { id: null, name: '', sort: 99, categoryId: 0, inputType: 0, inputValue: '', searchable: false, 
		searchKeywords: '', parentId: null }
	export default {
		name: 'ProductAttribute',
		components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker },
		cruds() {
			return CRUD({ title: '城市管理', url: 'api/product/attribute', crudMethod: { ...crudProdAttr }, params: {size: 999}})
		},
		mixins: [presenter(), header(), form(defaultForm), crud()],
		dicts: ['prod_attr_input_type'],
		data(){
			return {
				rules: {},
		        permission: {
		          add: ['admin', 'product-attribute:add'],
		          edit: ['admin', 'product-attribute:edit'],
		          del: ['admin', 'product-attribute:del']
		        },
			}
		}
	} 
</script>