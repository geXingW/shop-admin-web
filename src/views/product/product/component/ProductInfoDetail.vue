<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 720px"
             size="small" :inline="true"
    >
      <el-form-item label="商品名称:" prop="title">
        <el-input
          v-model="value.title"
          style="width:500px"
          show-word-limit
          :minlength="ruleParam.title.min"
          :maxlength="ruleParam.title.max"
        />
      </el-form-item>

      <el-form-item label="副标题：" prop="subTitle">
        <el-input
          v-model="value.subTitle"
          style="width:500px"
          show-word-limit
          :minlength="ruleParam.title.min"
          :maxlength="ruleParam.subTitle.max"
        />
      </el-form-item>

      <el-form-item label="商品售价：" width="400" prop="salePrice">
        <el-input-number v-model="value.salePrice"
                         style="width:230px"
                         :precision="2"
                         :step="1"
                         :min="ruleParam.price.min"
                         :max="ruleParam.price.max"
        />
      </el-form-item>
      <el-form-item label="市场价：" prop="originalPrice">
        <el-input-number v-model="value.originalPrice"
                         style="width:230px"
                         :precision="2"
                         :step="1"
                         :min="ruleParam.price.min"
                         :max="ruleParam.price.max"
        />
      </el-form-item>
      <el-form-item label="商品库存：" prop="unit">
        <el-input-number
          v-model="value.stock"
          style="width:140px"
          :min="ruleParam.stock.min"
          :max="ruleParam.stock.max"
        />
      </el-form-item>
      <el-form-item label="计量单位：" prop="unit">
        <el-input
          v-model="value.unit"
          style="width:80px"
          :minlength="ruleParam.unit.min"
          :maxlength="ruleParam.unit.max"
        />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="value.sort"
                         style="width:105px"
                         :step="1"
                         :min="1"
        />
      </el-form-item>

      <el-form-item label="商品图片：" prop="pics">
        <multi-upload v-model="value.pics" :action="commonUploadUrl" :params="uploadParams()"
                      :maxCount="ruleParam.pics.max"
        />
      </el-form-item>

      <el-form-item label="商品详情：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="600" :height="300" :picUploadParams="uploadParams()" v-model="value.detailPCHtml"
            />
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="600" :height="300" :picUploadParams="uploadParams()" v-model="value.detailMobileHtml"
            />
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item class="next-button">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MultiUpload from '@/components/Upload/multiUpload'
import { mapGetters } from 'vuex'
import { strErrMsg, numErrMsg } from '@/utils/validate'

const ruleParam = {
  title: { min: 5, max: 50 },
  subTitle: { min: 5, max: 100 },
  price: { min: 0.01, max: 10000000.00 },
  stock: { min: 0, max: 100000 },
  unit: { min: 1, max: 5 },
  pics: { min: 1, max: 5 }
}

const picValidator = function(rule, value, callback) {
  // 校验图片数组
  if (!(value instanceof Array)) {
    callback(new Error('请上传商品图！'))
  }

  // 校验长度
  if (value.length <= 0) {
    callback(new Error('至少上传1张商品图！'))
  }

  if (value.length > 10) {
    callback(new Error('单个商品最多上传5张图片！'))
  }

  callback()
}

export default {
  name: 'ProductInfoDetail',
  components: { Tinymce, MultiUpload },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleParam,
      rules: {
        title: [
          {
            required: true,
            min: ruleParam.title.min,
            max: ruleParam.title.max,
            message: strErrMsg(ruleParam.title.min, ruleParam.title.max, '商品名称'),
            trigger: 'blur'
          }
        ],
        subTitle: [
          {
            required: true,
            min: ruleParam.subTitle.min,
            max: ruleParam.subTitle.max,
            message: strErrMsg(ruleParam.subTitle.min, ruleParam.subTitle.max, '副标题'),
            trigger: 'blur'
          }
        ],
        salePrice: [
          {
            required: true,
            min: ruleParam.price.min,
            max: ruleParam.price.max,
            type: 'number',
            message: numErrMsg(ruleParam.price.min, ruleParam.price.max, '售价'),
            trigger: 'blur'
          }
        ],
        originalPrice: [
          {
            required: true,
            min: ruleParam.price.min,
            max: ruleParam.price.max,
            type: 'number',
            message: numErrMsg(ruleParam.price.min, ruleParam.price.max, '市场价'),
            trigger: 'blur'
          }
        ],
        stock: [
          {
            required: true,
            min: ruleParam.stock.min,
            max: ruleParam.stock.max,
            type: 'number',
            message: numErrMsg(ruleParam.stock.min, ruleParam.stock.max, '库存'),
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            min: ruleParam.unit.min,
            max: ruleParam.unit.max,
            message: strErrMsg(ruleParam.unit.min, ruleParam.unit.max, '计量单位'),
            trigger: 'blur'
          }
        ],
        pics: [
          {
            required: true, validator: picValidator
          }
        ]
      },
      //商品富文本详情激活类型
      activeHtmlName: 'pc',
      selectProductPics: [],
      picUploadParams: {
        uploadId: String('0'),
        uploadType: 'images',
        uploadModule: 'product'
      }
    }
  },
  created() {
  },
  computed: {
    ...mapGetters([
      'commonUploadUrl'
    ]),
    //商品的编号
    productId() {
      return this.value.id
    }
  },
  watch: {
    productId: function(newValue) {
    }
  },
  methods: {
    handleNext(formName) {
      // if(){ // 至少上传一张图片
      //   return false;
      // }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep')
        } else {
          this.$message({
            message: '请检查所填信息',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    uploadParams() {
      return {
        uploadId: this.productId,
        uploadType: 'images',
        uploadModule: 'product'
      }
    }
  }
}
</script>

<style scoped>
.next-button {
  text-align: center;
  width: 100%;
  margin: 5px auto;
}
</style>
