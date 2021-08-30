<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: width: 720px" size="small">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="value.name" />
      </el-form-item>

      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle" /></el-input>
      </el-form-item>

      <el-form-item label="商品售价：">
        <el-input v-model="value.price" />
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.originalPrice" />
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>

      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="635" :height="300" v-model="value.detailHtml" />
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="635" :height="300" v-model="value.detailMobileHtml"/>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'

  export default {
    name: "ProductInfoDetail",
    components: { Tinymce },
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
        activeHtmlName: 'pc'
      };
    },
    created() {
    },
    computed:{
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
</style>
