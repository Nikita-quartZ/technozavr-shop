<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" :alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <p class="product__info">
      Объем: <span>128GB</span>
    </p>
    <span class="product__code">
      Артикул: {{ item.productId }}
    </span>

    <formCounter :count.sync="amount" :cart-item="true"/>

    <b class="product__price">
      {{ (item.product.price * item.amount) | numberFormat }}
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteProduct(item.productId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import formCounter from '@/components/FormCounter.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';


export default {
  name: 'cartItem',
  props: ['item'],
  filters: {
    numberFormat
  },
  components: {
    formCounter,
  },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {productId: this.item.productId, amount: value})
      }
    }
  },
  methods: {
    ...mapActions({deleteProduct: 'updateDeleteCartProduct'}),
  }
}
</script>
