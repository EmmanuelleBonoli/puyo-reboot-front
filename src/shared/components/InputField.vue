<template>
  <FormField v-slot="$field" :name="name" class="flex flex-col gap-1">
    <component
        :is="inputComponent"
        v-bind="inputProps"
        :type="type"
        class="w-full sm:w-56"
    />
    <InputFieldError v-if="$field.invalid" :error="$field.error"/>
  </FormField>
</template>

<script setup lang="ts">
import {computed, defineProps} from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import {FormField} from "@primevue/forms";
import InputFieldError from "./InputFieldError.vue";

const props = defineProps({
  name: {type: String, required: true},
  type: {type: String, default: 'text'},
  placeholder: {type: String, default: ''},
  autocomplete: {type: String, default: ''},
  feedback: {type: Boolean, default: true},
  toggleMask: {type: Boolean, default: false},
  fluid: {type: Boolean, default: false},
});

const inputComponent = computed(() => {
  if (props.type === 'password') return Password;
  return InputText;
});

const inputProps = computed(() => {
  const base = {
    placeholder: props.placeholder,
    autocomplete: props.autocomplete,
  };

  if (props.type === 'password') {
    return {
      ...base,
      feedback: props.feedback,
      toggleMask: props.toggleMask,
      fluid: props.fluid,
      type: 'text',
    };
  }

  return base;
});
</script>
