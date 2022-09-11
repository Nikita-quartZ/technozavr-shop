<template>
  <BaseFormField :title="title" :error="error">
    <textarea class="form__input form__input--area" v-model="dataValue" :placeholder="placeholder"></textarea>
  </BaseFormField>
</template>

<script>
  import FormFieldMixins from '@/mixins/FormFieldMixins';

  export default {
    mixins: [FormFieldMixins]
  }
</script>
