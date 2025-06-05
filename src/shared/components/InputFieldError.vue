<template>
  <Message severity="error" size="small" variant="simple">
    {{ error?.message }}
  </Message>
</template>

<script setup lang="ts">
import Message from 'primevue/message';

defineProps({
  error: { type: Object, required: true },
});
</script>
