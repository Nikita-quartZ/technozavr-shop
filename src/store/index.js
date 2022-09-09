import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    UserAccessKey: null,
    CartProducts: [],
    CartProductsData: [],
  },
  mutations: {
    updateCartProductAmount(state, {productId, amount}) {
      const item = state.CartProducts.find(item => item.productId === productId);

      if (item) {
        item.amount = amount
      }
    },
    deleteCartProduct(state, productId) {
      console.log(state.UserAccessKey);
      axios.delete(`https://vue-study.skillbox.cc/api/baskets/products?userAccessKey=${state.UserAccessKey}`, {
        data: {
          productId: productId,
        }
      }).then(responce => {
        if (responce.status === 200) {
          state.CartProducts = state.CartProducts.filter(item => item.productId !== productId)
        }
      })
    },
    UpdateUserAccessKey(state, accessKey){
      state.UserAccessKey = accessKey;
    },
    UpdateCartProductsData(state, items) {
      state.CartProductsData = items;
    },
    syncCartProducts(state) {
      state.CartProducts = state.CartProductsData.map(item => {
        return {
          productId: item.product.id,
          amount: item.quantity,
        }
      })
    }
  },
  getters: {
    cartDetailsProduct(state){
      return state.CartProducts.map(item => {
        const product = state.CartProductsData.find(p => p.product.id === item.productId).product;
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url
          }
        }
      })
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailsProduct.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    }
  },
  actions: {
    loadCart(context) {
      return axios.get(API_BASE_URL + '/api/baskets', {
        params: {
          userAccessKey: context.state.UserAccessKey
        }
      })
        .then(responce => {
          if (!context.state.UserAccessKey) {
            localStorage.setItem('userAccessKey', responce.data.user.accessKey);
            context.commit('UpdateUserAccessKey', responce.data.user.accessKey);
          }

          context.commit('UpdateCartProductsData', responce.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, {productId, amount}) {
      return axios.post(API_BASE_URL + '/api/baskets/products', {
        productId: productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.UserAccessKey
        }
      })
        .then(responce => {
          context.commit('UpdateCartProductsData', responce.data.items);
          context.commit('syncCartProducts')
        })
    },
    updateCartProductAmount(context, {productId, amount}) {
      if (amount < 1) return;
      context.commit('updateCartProductAmount', {productId, amount});
      return axios.put(API_BASE_URL + '/api/baskets/products', {
        productId: productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.UserAccessKey
        }
      })
        .then(responce => {
          context.commit('UpdateCartProductsData', responce.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts')
        })
    }
  },
});
