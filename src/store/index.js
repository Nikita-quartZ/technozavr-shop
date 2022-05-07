import Vue from 'vue';
import Vuex from 'vuex';
import product from '@/data/products';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    CartProducts: [
      {productId: 1, amount: 2},
      {productId: 15, amount: 1},
      {productId: 12, amount: 4},
    ]
  },
  mutations: {
    addProductToCart(state, {productId, amount}) {
      const item = state.CartProducts.find(item => item.productId === productId);

      if (item){
        item.amount += amount
      } else {
        state.CartProducts.push({
          productId,
          amount
        })
      }
    },
    updateCartProductAmount(state, {productId, amount}) {
      const item = state.CartProducts.find(item => item.productId === productId);

      if (item) {
        item.amount = amount
      }
    },
    deleteCartProduct(state, productId) {
      state.CartProducts = state.CartProducts.filter(item => item.productId !== productId)
    }
  },
  getters: {
    cartDetailsProduct(state){
      return state.CartProducts.map(item => {
        return {
          ...item,
          product: product.find(p => p.id === item.productId)
        }
      })
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailsProduct.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    }
  }
});