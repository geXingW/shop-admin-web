<template> 
  <product-detail :is-edit='true'></product-detail>
</template>
<script>
  import ProductDetail from './component/ProductDetail'
  export default {
    name: 'ProductEdit',
    components: { ProductDetail }
  }
</script>
<style>
</style>
