<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: width: 720px" size="small" :inline="true">
      <el-form-item label="商品名称:" prop="title">
        <el-input v-model="value.name" style="width:500px"/>
      </el-form-item>

      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle" style="width:500px"/></el-input>
      </el-form-item>

      <el-form-item label="商品售价：" width="400">
        <el-input-number v-model="value.price" 
        style="width:230px"
        :precision="2" 
        :step="1"
        :min="1"/>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input-number v-model="value.originalPrice" 
        style="width:230px"
        :precision="2" 
        :step="1"
        :min="1"/>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input-number v-model="value.stock" 
        style="width:140px"
        :min="1"/>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit" style="width:80px" />
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number v-model="value.sort"
        style="width:105px"
        :step="1"
        :min="1"/>
      </el-form-item>

      <el-form-item label="商品图片：">
        <multi-upload v-model="value.pics" :action="commonUploadUrl" :params="picUploadParams"/>
      </el-form-item>

      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="600" :height="300" v-model="value.detailPCHtml" />
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="600" :height="300" v-model="value.detailMobileHtml"/>
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

  export default {
    name: "ProductInfoDetail",
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
        rules: {

        },
        //商品富文本详情激活类型
        activeHtmlName: 'pc',
        selectProductPics: [],
        picUploadParams: {
          uploadId: 0,
          uploadType: 'product'
        },
      };
    },
    created() {
    },
    computed:{
      ...mapGetters([
        'commonUploadUrl'
      ]),
      //商品的编号
      productId(){
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
      },
    },
    methods: {
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
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
