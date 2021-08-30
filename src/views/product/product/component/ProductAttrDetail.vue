<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">

      <el-form-item label="商品分类">
<!--         <el-cascader
          v-model="value.categoryId"
          :options="categories"
          :props="categoryProps">
        </el-cascader> -->
        <treeselect
          v-model="value.categoryId"
          :options="categories"
          style="width: 400px;"
          placeholder="选择商品分类"
          :normalizer="categoryNormalizer"
          :disable-branch-nodes="true"
        />
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { tree as categoryTree } from '@/api/product/category'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: "ProductAttrDetail",
    components: { Treeselect },
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        categories: [],
        categoryProps: {
          value: 'id',
          label: 'name'
        },
        categoryNormalizer(node) {
          return {
            id: node.id,
            label: node.name,
            children: node.children && node.children.length > 0 ? node.children : 0,
          }
        }
      }
    },
    computed: {
      //商品的编号
      productId(){
        return this.value.id;
      },
    },
    created() {
      this.loadCategories()
    },
    watch: {
    },
    methods: {
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep')
      },
      loadCategories() {
        categoryTree().then(({ data }) => {
          this.categories = data
        })
      },
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>
