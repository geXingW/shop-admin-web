<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 800px" size="small">

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

        </div>

        <!-- SKu 列表 -->
        <div>
            <el-table :data="value.skuList" border style="width: 100%">
              <el-table-column type="index" width="45" align="center" label="序号"/>

              <el-table-column v-for="(item, index) in selectSkuNames"
                :label="item" 
                :key="index" 
                align="center" 
                width="55"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  {{ scope.row.sku[index].value || '未知' }}
                </template>
              </el-table-column>

              <el-table-column label="价格" align="center" width="150">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.price" 
                  :step="2" 
                  :precision="2" 
                  :min="0.01" 

                  controls-position="right"/>
                </template>
              </el-table-column>

              <el-table-column label="原价" align="center" width="150">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.originPrice" 
                  :step="2" 
                  :precision="2" 
                  :min="0.01" 
                  controls-position="right" />
                </template>
              </el-table-column>

              <el-table-column label="库存" align="center" width="150">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.stock" 
                  :min="0" 
                  :step="2" 
                  controls-position="right" />
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="45">
                <template slot-scope="scope">
                  <el-button type="text" @click="rmSkuList(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
              <el-button type="primary" @click="generateSkuList">
                生成sku列表
              </el-button>
              <el-button type="primary" @click="syncSkuStock" :disabled="skuListIsEmpty">
                同步库存
              </el-button>
              <el-button type="primary" @click="syncSkuPrice" :disabled="skuListIsEmpty">
                同步价格
              </el-button>
            </div>

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
  import { cartesian } from '@/utils/helper'

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
        categoryProps: { value: 'id', label: 'name'},
        categoryGroupAttributes: {},  // 根据分类查询到的商品属性组积属性信息
        selectBaseAttributes: [],
        selectSaleAttributes: [],
        attributeInputAddValues: [],
        selectSkuNames: [],
        categoryNormalizer(node) {
          return {
            id: node.id,
            label: node.name,
            children: node.children && node.children.length > 0 ? node.children : 0,
          }
        },
        skuList: { names: [], values: [], cartesians: [] }
      }
    },
    computed: {
      //商品的编号
      productId(){
        return this.value.id;
      },
      skuListIsEmpty() {
        return this.value.skuList.length <= 0
      }
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
      generateSkuList() {
        this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doGenerateSkuList();
        });
      },
      doGenerateSkuList() {
        let skuNames = [], skuValues = [];

        this.selectSaleAttributes.map( attribute => {
          if(!attribute && !attribute.attributeName && !attribute.values) {
            return
          }

          // 空列表会影响笛卡尔积计算，去除空列表
          if(!Array.isArray(attribute.values) || attribute.values.length < 1 ) {
            return
          }

          skuNames.push(attribute.attributeName)
          skuValues.push(attribute.values.map(value => {
            return { 
              id: attribute.attributeId, 
              name: attribute.attributeName,
              value
            }
          }))

        })

        this.selectSkuNames = skuNames

        let skuList = cartesian(skuValues)
        skuList = skuList.map(item => {
          if(skuNames.length <= 1) {
            item = [item]
          }

          return { price: 0, stock: 0, originPrice: 0, sku: item }
        })
        this.value.skuList = skuList 
      },
      syncSkuStock() {
        if(this.value.skuList.length <= 1) {
          return
        }

        this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSyncSkuStock()
        })
      },
      doSyncSkuStock() {
        let stock = this.value.skuList[0].stock

        this.value.skuList = this.value.skuList.map((item, index) => {
          if(index > 0) {
            item = { ...item, stock }
          }

          return item
        })
      },
      syncSkuPrice() {
        if(this.value.skuList.length <= 1) {
          return
        }

        this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSyncSkuPrice()
        });
      },
      doSyncSkuPrice() {
        let price = this.value.skuList[0].price
        let originPrice = this.value.skuList[0].originPrice

        this.value.skuList = this.value.skuList.map((item, index) => {
          if(index > 0) {
            item = { ...item, price, originPrice }
          }
          
          return item
        })
      },
      rmSkuList(index) {
        this.value.skuList.splice(index, 1)
      },
      updateVueComponents() {
        this.$forceUpdate()
      },
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
