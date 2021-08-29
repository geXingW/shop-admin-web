<template>
	<div class="app-container">
		<!--工具栏-->
		<div class="head-container">
		  <div v-if="crud.props.searchToggle">
		    <!-- 搜索 -->
		    <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
		      <el-table :data="detachDialog.attributes" :visible.sync="detachDialog.show" align="center" @selection-change="detachSelectChange">
		      	<el-table-column type="selection" width="55" />
		      	<el-table-column prop="name" label="属性名" />

  				<el-table-column :show-overflow-tooltip="true" prop="inputType" label="输入类型">
					<template slot-scope="scope">
						<el-tag v-for="(item, index) in dict.prod_attr_input_type" 
							:key="index" 
							v-show="item.value == scope.row.inputType"
							>
							{{ item.label }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="inputValue" label="可选值" />

				<el-table-column prop="searchable" label="搜索搜索" align="center">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.searchable == 1">支持</el-tag>
						<el-tag type="danger" v-else>不支持</el-tag>
					</template>
				</el-table-column>

				<el-table-column :show-overflow-tooltip="true" prop="searchKeywords" label="搜索关键字" />

		      </el-table>

		  </el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button type="text" @click="crud.cancelCU">取消</el-button>
			    <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
			</div>
		</el-dialog>

        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 150%;" @selection-change="crud.selectionChangeHandler" align="center">
			<el-table-column type="selection" width="55" />

			<el-table-column :show-overflow-tooltip="true" prop="name" label="属性名"/>

			<el-table-column :show-overflow-tooltip="true" prop="inputType" label="输入类型">
				<template slot-scope="scope">
					<el-tag v-for="(item, index) in dict.prod_attr_input_type" 
						:key="index" 
						v-show="item.value == scope.row.inputType"
						>
						{{ item.label }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column prop="inputValue" label="可选值" />

			<el-table-column prop="searchable" label="搜索支持" align="center">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.searchable == 1">支持</el-tag>
					<el-tag type="danger" v-else>不支持</el-tag>
				</template>
			</el-table-column>

			<el-table-column :show-overflow-tooltip="true" prop="searchKeywords" label="搜索关键字" />
		</el-table>
	</div>
</template>
<script>
	import rrOperation from '@crud/RR.operation'
	import udOperation from '@crud/UD.operation'
	import crudOperation from '@crud/CRUD.operation'
	import Treeselect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import DateRangePicker from '@/components/DateRangePicker'
	import CRUD, { presenter, header, form, crud } from '@crud/crud'
	import crudProdAttrGroup from '@/api/product/attribute-group'
	import { list as categoryList, tree as categoryTree } from '@/api/product/category'

	// crud交由presenter持有
	const defaultForm = { groupId: 0, attributeIds: [] }

	const curdMethod = { 
		list: crudProdAttrGroup.getAttachAttributeList, 
		add: crudProdAttrGroup.attachAttributeToGroup, 
		del: crudProdAttrGroup.detachAttributeToGroup
	}

	const optShow = { add: true, edit: false, del: true, download: false, reset: true }
	const listPage = 999
	export default {
		name: 'ProductAttributeGroupSetting',
		props: {
			groupId: {
				type: Number,
				default: 0
			},
			type: {
				type: Number,
				default: 1
			},
			title: {
				type: String,
				default: '基本属性'
			}
		},
		components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker },
		cruds() {
			return CRUD({ title: '商品属性', url: 'api/product/attribute-group/attach-attribute', 
				crudMethod: { ...curdMethod }, params: window.groupAtrributeSetting, page: { size: listPage }, optShow})
		},
		mixins: [presenter(), header(), form(defaultForm), crud()],
		dicts: ['prod_attr_input_type', 'prod_attr_type'],
		data() {
			return {
				rules: {},
				categoryNormalizer(node) {
					return {
					  id: node.id,
					  label: node.name,
					  children: node.children && node.children.length > 0 ? node.children : 0,
					}
				},
				permission: {
		          add: ['admin', 'product-attribute-group-atrribute:add'],
		          edit: ['admin', 'product-attribute-group-atrribute:edit'],
		          del: ['admin', 'product-attribute-group-atrribute:del']
				},
				detachDialog: {
					attributes: [],
					show: false
				}
			}
		},
		methods: {
			[CRUD.HOOK.beforeSubmit]() {
				this.form.groupId = this.groupId
			},
			[CRUD.HOOK.beforeDelete](data) {
				let attributeIds = []
				for(let item of this.crud.selections){
					attributeIds.push(item.id)
				}

				crudProdAttrGroup.detachAttributeToGroup(this.groupId, attributeIds).then( _ => {
			        this.crud.dleChangePage(1)
			        this.crud.delSuccessNotify()
			        this.crud.refresh()
				}).finally( _ => {
					console.log('here')
					this.crud.delAllLoading = false
				})

				return false
			},
			[CRUD.HOOK.beforeToAdd]() {
				this.loadDetachAttribute()
			},
			resetData(type) {
				this.crud.params.type = type
				this.crud.params.attached = true
				this.crud.toQuery()
			},
			loadDetachAttribute () {
				let params = { 
					attached: false, 
					groupId: this.crud.params.groupId, 
					type: this.crud.params.type, 
					size: this.crud.page.size,
					page: this.crud.page.page
				}
				crudProdAttrGroup.getAttachAttributeList(params).then(( {data} ) => {
					this.detachDialog.attributes = data.records
				})
			},
			detachSelectChange (items) {
				this.form.attributeIds = []
		        for (let item of items) {
		          this.form.attributeIds.push(item.id)
		        }
			}
		},
		mounted: function() {
		}
	} 
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>