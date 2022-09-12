<template>
  <ul class="catalog__list">
    <productItem
      v-for='product in products'
      :key="product.id"
      :product='product'
    />
  </ul>
</template>

<script>
import productItem from './ProductItem.vue';

export default {
  name: 'productList',
  components: {
    productItem,
  },
  props: [
    'products',
  ],
};
</script>
