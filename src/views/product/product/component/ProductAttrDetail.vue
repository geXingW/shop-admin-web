<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">

      <el-form-item label="商品分类">
        <treeselect
          v-model="value.categoryId"
          :options="categories"
          style="width: 400px;"
          placeholder="选择商品分类"
          :normalizer="categoryNormalizer"
          :disable-branch-nodes="true"
          @select="handleCategorySelect"
        />
      </el-form-item>
      <el-form-item label="销售属性" v-if="selectSaleAttributes">
        <div v-for="(item, attributeId) in selectSaleAttributes" :key="attributeId">
          <!-- 手动输入 -->
          <div v-if="item && item.inputType == 0">
            <span>{{ `${item.attributeName}：` }}</span>
            <br>
            <input v-model="attributeInputAddValues[attributeId].value">
            <el-button class="littleMarginLeft" @click="handleAddAttributeInputValue(attributeId)">增加</el-button>
            <el-checkbox-group v-model="selectSaleAttributes[attributeId].values" >
              <div v-for="(val, index) in attributeInputAddValues[attributeId].values" :key="index" style="display: inline-block">
              <el-checkbox :label="val" class="littleMarginRight" @change="updateVueComponents"/>
              <el-button type="text" class="largeMarginRight" @click="handleRmAttributeInputValue(attributeId, index, val)">删除
                  </el-button>
              </div>
            </el-checkbox-group>
          </div>

          <!-- 选择输入 -->
          <div v-if="item && item.inputType == 1">
            <span>{{ `${item.attributeName}：` }}</span>
            <el-checkbox-group v-model="selectSaleAttributes[attributeId].values" >
              <el-checkbox :label="val" v-for="(val, index) in item.inputValue.split(',')"  :key="index" @change="updateVueComponents" />
            </el-checkbox-group>
          </div>

          <!-- 生成属性列表 -->
<!--           <el-table style="width: 100%;margin-top: 20px" :data="value.skuStockList" border>
            <el-table-column label="">
              
            </el-table-column>
          </el-table> -->

        </div>
      </el-form-item>

      <el-form-item label="基本属性">
        <div v-for="(item, index) in categoryGroupAttributes.baseAttributes" :key="index">
          {{ item.attributeName }}
        </div>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { tree as categoryTree, groupAttributes } from '@/api/product/category'
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
        categoryGroupAttributes: {},
        selectBaseAttributes: [],
        selectSaleAttributes: [],
        attributeInputAddValues: [],
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
      this.loadCategoryGroupAttribute(this.value.categoryId)
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
      loadCategories(categoryId) {
        categoryTree().then(({ data }) => {
          this.categories = data
        })
      },
      loadCategoryGroupAttribute(categoryId) {
        if(!categoryId) {
          return
        }

        groupAttributes(categoryId).then((res) => {
          if(res.status == 200000) {
            this.categoryGroupAttributes = res.data

            res.data.saleAttributes.map(item => {
              this.selectSaleAttributes[item.attributeId] = { values: [], ...item }

              this.attributeInputAddValues[item.attributeId] = { value: '', values: []}
            })
          }
        })
      },
      handleCategorySelect(node) {
        this.loadCategoryGroupAttribute(node.id)
      },
      handleAddAttributeInputValue(attributeId) {
        let {value, values} = this.attributeInputAddValues[attributeId]

        if(!value) {
          this.$message({ message: '属性值不能为空', type: 'warning', duration: 1000 });
          return
        }

        if(values.includes(value)){
          this.$message({ message: '属性值已存在', type: 'warning', duration: 1000 });
          return 
        }

        values.push(value)

        // 数组去重
        this.attributeInputAddValues[attributeId] = { value: '', values}

        // 解决取值嵌套层级过多，组建不能自动渲染
        this.updateVueComponents()
      },
      handleRmAttributeInputValue(attributeId, index, value) {
        this.attributeInputAddValues[attributeId].values.splice(index, 1);

        let selectValues = this.selectSaleAttributes[attributeId].values
        this.selectSaleAttributes[attributeId].values = selectValues.filter(val => val != value);

        this.updateVueComponents()  
      },
      updateVueComponents() {
        this.$forceUpdate()
      }
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginRight {
    margin-right: 10px;
  }

  .largeMarginRight {
    margin-right: 30px;
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
