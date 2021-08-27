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
            <el-select
              v-model="query.isNew"
              clearable
              size="small"
              placeholder="新品推荐"
              class="filter-item"
              style="width: 100px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in isNewOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <el-select
              v-model="query.isRecommend"
              clearable
              size="small"
              placeholder="商品推荐"
              class="filter-item"
              style="width: 100px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in isRecommendOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
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
            <el-form-item label="名称" prop="title">
              <el-input v-model="form.title" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="子标题" prop="title">
              <el-input v-model="form.subTitle" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="售价" prop="price">
              <el-input-number v-model.number="form.price" :min="0" controls-position="right" style="width: 150px;"/>
            </el-form-item>
            <el-form-item label="原价" prop="original_price">
              <el-input-number v-model.number="form.originalPrice" :min="0" controls-position="right" style="width: 150px;"/>
            </el-form-item>
            <el-form-item label="库存" prop="original_price">
              <el-input-number v-model.number="form.stock" :min="0" :max="999" controls-position="right" style="width: 150px;" />
            </el-form-item>
            <el-form-item label="预警库存" prop="original_price">
              <el-input-number v-model.number="form.lowStock" :min="0" controls-position="right" style="width: 150px;" />
            </el-form-item>
            <el-form-item label="上架"  style="width: 231px">
              <el-radio-group v-model="form.onSale">
                <el-radio
                  v-for="item in dict.product_sale_status"
                  :key="item.id"
                  :label="item.value"
                  >{{ item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="单位" prop="title">
              <el-input v-model="form.unit" style="width: 150px"/>
            </el-form-item>
            <el-form-item label="新品推荐">
              <el-switch
                v-model="form.isNew"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="精品推荐">
              <el-switch
                v-model="form.isRecommend"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="关键字" prop="title">
              <el-input v-model="form.keywords" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="商品分类" prop="categoryId">
              <treeselect
                v-model="form.categoryId"
                :options="categories"
                style="width: 400px;"
                placeholder="选择商品分类"
                :normalizer="treeNormalizer"
              />
            </el-form-item>
            <br />
            <el-form-item label="商品图片">
              <single-upload v-model="form.pic" :action="commonUploadUrl" :params="picUploadParams"></single-upload>
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
          <el-table-column :show-overflow-tooltip="true" prop="title" label="商品名" />
          <!-- 图片 -->
          <el-table-column label="图片" width="100">
            <template slot-scope="scope"><img :src="scope.row.pic" width="100px" /></template>
          </el-table-column>
          <!-- 价格 -->
          <el-table-column label="价格" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
              <span>{{ scope.row.original_price }}</span>
            </template>
          </el-table-column>
          <!-- 品牌 -->
          <el-table-column label="品牌" width="80"><template>小米</template></el-table-column>
          <!-- 分类 -->
          <el-table-column label="分类" width="80"><template>手机</template></el-table-column>

          <el-table-column label="上架" align="center" prop="onSale" width="70px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.onSale"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="1"
                inactive-value="0"
                @change="changeEnabled(scope.row, scope.row.onSale)"
              />
            </template>
          </el-table-column>

          <el-table-column label="新品推荐" align="center" prop="isNew" width="70px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isNew"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="1"
                inactive-value="0"
                @change="changeIsNew(scope.row, scope.row.isNew)"
              />
            </template>
          </el-table-column>

          <el-table-column label="新品推荐" align="center" prop="isRecommend" width="70px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isRecommend"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                active-value="1"
                inactive-value="0"
                @change="changeIsRecommend(scope.row, scope.row.isRecommend)"
              />
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" prop="createTime" width="150" label="创建日期" />

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
import curdProduct from '@/api/product/product'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import crudProductCategory from "@/api/product/category"
import crudProduct from "@/api/product/product"
import SingleUpload from '@/components/Upload/singleUpload'
const defaultForm = { 
  id: null, 
  title: null, 
  subTitle: null, 
  price: 0, 
  originalPrice: 0, 
  onSale: '1',
  isNew: '0',
  isRecommend: '0', 
  categoryId: 0, 
  pic: null,
  stock: 0,
  lowStock: 0,
  unit: '',
  keywords: ''
}
export default {
  name: 'Product',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker, SingleUpload },
  cruds() {
    return CRUD({ title: '商品', url: 'api/product', crudMethod: { ...crudProduct }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status', 'product_sale_status', 'product_is_new', 'product_is_recommend'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      jobDatas: [], roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      treeNormalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      picUploadParams: {
        uploadId: 0,
        uploadType: 'product'
      },
      categories: [],
      isNewOptions: [
        { key: 1, display_name: '是' },
        { key: 0, display_name: '否' }
      ],
      isRecommendOptions: [
        { key: 1, display_name: '是' },
        { key: 0, display_name: '否' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'commonUploadUrl'
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
      this.loadCategories()
    },
    loadCategories() { // 获取商品分类
      const that = this
      crudProductCategory.tree().then(({ data }) => {
        if(data.length > 0){
         this.categories = [ {id: 0, name: '顶级分类', icon: '', hasChildren: true, children: data}]
        }else {
         this.categories = [ {id: 0, name: '顶级分类', icon: '', hasChildren: false}]
        }
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    },
    changeEnabled(data, val) { // 改变状态
      this.$confirm('此操作将 "' + this.dict.label.product_sale_status[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        curdProduct.edit(data).then(res => {
          this.crud.notify(this.dict.label.product_sale_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.onSale = !data.onSale
        })
      }).catch(() => {
        data.onSale = !data.onSale
      })
    },
    changeIsNew(data, val) { // 改变新品推荐状态
      this.$confirm('此操作将 "' + this.dict.label.product_is_new[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        curdProduct.edit(data).then(res => {
          this.crud.notify(this.dict.label.product_is_new[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.onSale = !data.onSale
        })
      }).catch(() => {
        data.onSale = !data.onSale
      })
    },
    changeIsRecommend(data, val) { // 改变商品推荐
      this.$confirm('此操作将 "' + this.dict.label.product_is_recommend[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        curdProduct.edit(data).then(res => {
          this.crud.notify(this.dict.label.product_is_recommend[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.onSale = !data.onSale
        })
      }).catch(() => {
        data.onSale = !data.onSale
      })
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