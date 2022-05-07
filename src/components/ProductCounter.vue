<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар" @click="incrementClick(-1)">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input id="counter-input" type="text" :value="value" name="count" @input="incrementInput">
    <button type="button" aria-label="Добавить один товар" @click="incrementClick(1)">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ['value'],
  name: 'FormCounter',
  methods: {
    incrementInput(){
      let newAmount = document.getElementById('counter-input').value;
      this.$emit('input', Number(newAmount));
    },
    incrementClick(number){
      if (!(this.value + number === 0)) {
        document.getElementById('counter-input').value += number;
        this.value = this.value + number;
        this.$emit('input', this.value);
      }
    }
  }
}
</script>