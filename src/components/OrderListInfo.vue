<template>
    <div class="cart__block" v-show="$store.state.orderInfo">
      <ul class="cart__orders">
        <li class="cart__order" v-for="product in this.$store.state.orderInfo.basket.items" :key="product.product.title">
          <h3>{{ product.product.title }}</h3>
          <b>{{ product.product.price * product.quantity | NumberFormat }} ₽</b>
          <span>Артикул: {{ product.product.id }}</span>
        </li>
      </ul>

      <div class="cart__total">
        <p>Доставка: <b>500 ₽</b></p>
        <p>Итого: <b>{{ this.$store.state.orderInfo.basket.items.length }}</b> товара на сумму <b>{{ this.$store.state.orderInfo.totalPrice | NumberFormat }} ₽</b></p>
      </div>

      <slot />
    </div>
</template>

<script>
import NumberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';

export default {
  filters: {
    NumberFormat,
  },
  computed: {
    ...mapGetters({ totalPrice: 'cartTotalPrice' }),
  },
}
</script>
