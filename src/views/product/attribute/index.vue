<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item"/>
        <rrOperation/>
      </div>
      <crudOperation :permission="permission"/>
    </div>

    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px"
    >
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
<!--        <el-form-item label="属性分类" prop="categoryId">-->
<!--          <treeselect-->
<!--            v-model="form.categoryId"-->
<!--            :options="categories"-->
<!--            style="width: 400px;"-->
<!--            placeholder="选择商品分类"-->
<!--            :normalizer="categoryNormalizer"-->
<!--            :disable-branch-nodes="true"-->
<!--          />-->
<!--        </el-form-item>-->
        <el-form-item label="输入类型" prop="inputType">
          <el-select v-model="form.inputType" placeholder="输入类型" style="width: 100px">
            <el-option
              v-for="item in dict.prod_attr_input_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input placeholder="请输入可选值，多个值之间','分割" :disabled="form.inputType == 0"
                    v-model="form.inputValue" style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="属性搜索" prop="searchable">
          <el-select v-model="form.searchable" placeholder="是否支持搜索" style="width: 100px">
            <el-option key="0" label="禁止搜索" :value="0"/>
            <el-option key="1" label="支持搜索" :value="1"/>
          </el-select>
          <el-input placeholder="请输入搜索关键字" :disabled="form.searchable == 0" v-model="form.searchKeywords"
                    style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="属性类型" prop="type">
          <el-radio v-model="form.type" :label="type.value" :key="index" v-for="(type, index) in dict.prod_attr_type">
            {{ type.label }}
          </el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 150%;"
              @selection-change="crud.selectionChangeHandler" align="center"
    >
      <el-table-column type="selection" width="55"/>

      <el-table-column :show-overflow-tooltip="true" prop="name" label="属性名"/>

      <el-table-column :show-overflow-tooltip="true" prop="type" label="属性类型">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in dict.prod_attr_type" :key="index" v-show="item.value == scope.row.type">
            {{ item.label }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="sort" label="排序"/>

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

      <el-table-column prop="inputValue" label="可选值"/>

      <el-table-column prop="searchable" label="搜索搜索" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.searchable == 1">支持</el-tag>
          <el-tag type="danger" v-else>不支持</el-tag>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="searchKeywords" label="搜索关键字"/>

      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期"/>

      <el-table-column v-if="checkPer(['admin','menu:edit','menu:del'])" label="操作" width="130px" align="center"
                       fixed="right"
      >
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
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DateRangePicker from '@/components/DateRangePicker'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudProdAttr from '@/api/product/attribute'
import { list as categoryList, tree as categoryTree } from '@/api/product/category'

// crud交由presenter持有
const defaultForm = {
  id: null, name: '', sort: 99, categoryId: null, inputType: 0, inputValue: '',
  searchable: 0, searchKeywords: '', type: 0
}
export default {
  name: 'ProductAttribute',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '商品属性', url: 'api/product/attribute', crudMethod: { ...crudProdAttr } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['prod_attr_input_type', 'prod_attr_type'],
  data() {
    return {
      rules: {},
      categories: [],
      categoryNormalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children && node.children.length > 0 ? node.children : 0
        }
      },
      permission: {
        add: ['admin', 'product-attribute:add'],
        edit: ['admin', 'product-attribute:edit'],
        del: ['admin', 'product-attribute:del']
      }
    }
  },
  methods: {
    loadCategories() {
      categoryTree().then((data) => {
        this.categories = data.data
      })
    },
    [CRUD.HOOK.beforeSubmit]() {
      // this.form.categoryId = this.form.categoryIds[this.form.categoryIds.length - 1]
    }
  },
  mounted: function() {
    this.loadCategories(0)
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
