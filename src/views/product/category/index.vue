<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="模糊搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="580px"
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
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="显示">
          <el-radio-group v-model="form.showStatus">
            <el-radio
              v-for="item in dict.show_status"
              :key="item.id"
              :label="item.value"
              >{{ item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="menuSort">
          <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>

        <el-form-item label="顶级分类" prop="level">
          <el-radio-group v-model="form.level">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上级分类" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="categories"
            :load-options="loadCategories"
            style="width: 450px;"
            placeholder="选择上级分类"
          />
        </el-form-item>
        
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="关键字" style="width: 400px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getCategories"
      :data="crud.data"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <!-- 分类名称 -->
      <el-table-column
        :show-overflow-tooltip="true"
        label="名称"
        width="125px"
        prop="name"
      />
      <!-- 图标 -->
      <el-table-column
        :show-overflow-tooltip="true"
        label="图标"
        width="125px"
        prop="icon"
      />
      <!-- 层级 -->
      <el-table-column
        :show-overflow-tooltip="true"
        label="层级"
        width="125px"
        prop="level"
      />

      <el-table-column
        :show-overflow-tooltip="true"
        label="排序"
        width="125px"
        prop="sort"
      />
      <el-table-column label="显示" align="center" prop="showStatus">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.showStatus"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeShowStatus(scope.row, scope.row.showStatus)"
          />
        </template>
      </el-table-column>
      <!-- 分类关键字 -->
      <el-table-column
        :show-overflow-tooltip="true"
        label="关键字"
        width="125px"
        prop="keywords"
      />
      <el-table-column prop="createTime" label="创建日期" width="135px" />
      <el-table-column
        v-if="checkPer(['admin', 'menu:edit', 'menu:del'])"
        label="操作"
        width="130px"
        align="center"
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
import crudProductCategory from "@/api/product/category";
import IconSelect from "@/components/IconSelect";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import DateRangePicker from "@/components/DateRangePicker";

// crud交由presenter持有
const defaultForm = {
  id: null,
  name: null,
  pid: 0,
  sort: 999,
  level: 0,
  showStatus: 0,
  icon: null,
  keywords: null,
};
export default {
  name: "ProductCategory",
  components: {
    Treeselect,
    IconSelect,
    crudOperation,
    rrOperation,
    udOperation,
    DateRangePicker,
  },
  cruds() {
    return CRUD({
      query: {pid: 0},
      title: "商品分类",
      url: "api/product/category",
      crudMethod: { ...crudProductCategory },
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["show_status"],
  data() {
    return {
      categories: [],
      permission: {
        add: ["admin", "menu:add"],
        edit: ["admin", "menu:edit"],
        del: ["admin", "menu:del"],
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        path: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
    };
  },
  methods: {
    changeShowStatus(data, val) {
      this.$confirm(
        '此操作将 "' +
          this.dict.label.show_status[val] +
          '" ' +
          data.name +
          '分类", 是否继续？',
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      )
        .then(() => {
          crudProductCategory
            .edit(data)
            .then((res) => {
              this.crud.notify(
                this.dict.label.show_status[val] + "成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
            })
            .catch((e) => {
              console.log(e);
              data.showStatus = data.showStatus == 1 ? 1 : 0;
            });
        })
        .catch(() => {
          data.showStatus = data.showStatus == 1 ? 1 : 0;
        });
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.showStatus = form.showStatus + "" 

      this.categories = []
      // if (form.id == null) {
      this.loadCategories({pid: 0})
      // } else {
        // this.getSupCategories(form.pid)
      // }
    },
    getCategories(tree, treeNode, resolve) {
      crudProductCategory.list({pid : tree.id}).then(data => {
        resolve(data.data.records)
      })
      // let that = this
      // that.categories = [{id: 0, label: "顶级分类", hasChildren: true, children: []}]
      // crudProductCategory.list(params).then(({data}) => {
      //   that.categories[0].children = data.records.map(function(obj){
      //       return {
      //         id: obj.id,
      //         label: obj.name
      //       }
      //   })
      // })

      // console.log(this.categories)
      // const params = { pid: tree.id };
      // setTimeout(() => {
      //   crudProductCategory.list(params).then((data) => {
      //     resolve(data.data.records);
      //   });
      // }, 100);
    },
    getSupCategories(id) {
      crudProductCategory.getCategorySuperior(id).then(({ data }) => {
        console.log(data);
        const children = data.map(function (obj) {
          if (!obj.leaf && !obj.children) {
            obj.children = null;
          }
          return obj;
        });
        this.menus = [{ id: 0, label: "顶级类目", children: children }];
      });
    },
    loadCategories({ action, parentNode, callback }) {
      let that = this
      that.categories = [{id: 0, label: "顶级分类", hasChildren: true, children: []}]
      crudProductCategory.list().then(({data}) => {
        that.categories[0].children = data.records.map(function(obj){
            return {
              id: obj.id,
              label: obj.name
            }
        })
      })
    },
    // 选中图标
    selected(name) {
      this.form.icon = name;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
