<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--      <div v-if="crud.props.searchToggle">-->
      <div>
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item"/>
        <rrOperation/>
        <crudOperation :permission="permission"/>
      </div>
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
        <el-form-item label="属性分类" prop="categoryId">
          <treeselect
            v-model="form.categoryId"
            :options="categories"
            style="width: 400px;"
            placeholder="选择商品分类"
            :normalizer="categoryNormalizer"
            :disable-branch-nodes="true"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <!-- 属性设置 -->
    <el-dialog append-to-body :visible.sync="attributeDialog.show" :title="dialogTitle" width="600px"
    >
      <attribute-group-setting ref="attributeGroupSetting"
                               :group-id="attributeDialog.groupId"
                               :group-name="attributeDialog.groupName"
                               :type="attributeDialog.type"
                               :title="attributeDialog.title"
      />
    </el-dialog>

    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 150%;"
              @selection-change="crud.selectionChangeHandler" align="center"
    >
      <el-table-column type="selection" width="55"/>

      <el-table-column :show-overflow-tooltip="true" prop="name" label="分组名" width="150px"/>

      <el-table-column :show-overflow-tooltip="true" prop="categoryName" label="所属分类" width="300px"/>

      <el-table-column :show-overflow-tooltip="true" prop="sort" label="排序"/>

      <el-table-column label="属性配置" width="200px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="showAttributeSetting(0, scope.row.id, scope.row.name)">基本属性</el-button>
          <el-button size="mini" @click="showAttributeSetting(1, scope.row.id, scope.row.name)">销售属性</el-button>
        </template>
      </el-table-column>

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
import crudProdAttrGroup from '@/api/product/attribute-group'
import { list as categoryList, tree as categoryTree } from '@/api/product/category'
import AttributeGroupSetting from '@/views/product/attribute-group/AttributeGroupSetting'

// crud交由presenter持有
const defaultForm = { id: null, name: '', sort: 99, categoryId: null }
export default {
  name: 'ProductAttributeGroup',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker, AttributeGroupSetting },
  cruds() {
    return CRUD({ title: '商品属性分组', url: 'api/product/attribute-group', crudMethod: { ...crudProdAttrGroup } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: [],
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
        add: ['admin', 'product-attribute-group:add'],
        edit: ['admin', 'product-attribute-group:edit'],
        del: ['admin', 'product-attribute-group:del']
      },
      attributeDialog: {
        show: false,
        type: 0, // 0 - 基本属性，1-销售属性
        groupId: 0,
        title: '基本属性设置',
        groupName: null
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
    },
    showAttributeSetting(type, groupId, groupName) {
      window.groupAtrributeSetting = { type, groupId }

      this.attributeDialog.type = type
      this.attributeDialog.groupId = groupId
      this.attributeDialog.groupName = groupName
      this.attributeDialog.title = type == 0 ? '基本属性设置' : '销售属性设置'

      if (this.$refs.attributeGroupSetting) {
        this.$refs.attributeGroupSetting.resetData(type, groupId)
      }
      this.attributeDialog.show = true
    }
  },
  mounted: function() {
    this.loadCategories(0)
  },
  computed: {
    dialogTitle() {
      return this.attributeDialog.groupName + ' - ' + this.attributeDialog.title
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
