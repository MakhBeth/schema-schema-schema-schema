
<script setup lang="ts">
import { type AnyFieldApi } from '@tanstack/vue-form'

const props = defineProps<{
  state: AnyFieldApi['state']
}>()
</script>

<template>
  <template v-if="props.state.meta.isTouched">
    <em v-for="error of props.state.meta.errors" :key="error.message" role="alert">{{ error.message }}</em>
    {{ props.state.meta.isValidating ? 'Validating...' : null }}
  </template>
</template>

<style scoped>
em {
  color: red;
}
</style>