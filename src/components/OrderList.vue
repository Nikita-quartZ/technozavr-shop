<template>
    <div class="cart__block" v-show="$store.state.cartProductsData.length > 0">
      <ul class="cart__orders">
        <li class="cart__order" v-for="product in this.$store.state.cartProductsData" :key="product.product.title">
          <h3>{{ product.product.title }}</h3>
          <b>{{ product.product.price * product.quantity | numberFormat }} ₽</b>
          <span>Артикул: {{ product.product.id }}</span>
        </li>
      </ul>

      <div class="cart__total">
        <p>Доставка: <b>500 ₽</b></p>
        <p>Итого: <b>{{ this.$store.state.cartProductsData.length }}</b> товара на сумму <b>{{ totalPrice | numberFormat }} ₽</b></p>
      </div>

      <slot />
    </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';

export default {
  filters: {
    numberFormat,
  },
  computed: {
    ...mapGetters({ totalPrice: 'cartTotalPrice' }),
  },
}
</script>
