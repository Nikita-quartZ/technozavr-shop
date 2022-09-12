<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price | numberFormat }} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in product.colors" :key="color.code">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="color.code"
            v-model="mainColor"
          >
          <span class="colors__value" :style="{backgroundColor: color.code}">
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'productItem',
  props: [
    'product',
  ],
  data() {
    return {
      mainColor: this.product.colors[0].code,
    };
  },
  filters: {
    numberFormat,
  },
};
</script>
