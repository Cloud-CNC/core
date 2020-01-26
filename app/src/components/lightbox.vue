<template>
  <v-dialog
    :value="value"
    @input="event => $emit('input', event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title primary-title>
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style>
</style>