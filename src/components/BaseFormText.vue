<template>
  <BaseFormField :title="title" :error="error">
    <input class="form__input" v-model="dataValue" :type="type" :placeholder="placeholder">
  </BaseFormField>
</template>

<script>
  import FormFieldMixins from '@/mixins/FormFieldMixins';

  export default {
    props: ['type'],
    mixins: [FormFieldMixins]
  }
</script>
