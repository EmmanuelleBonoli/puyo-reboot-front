<template>
  <Form :initialValues="initialValues" :resolver="resolverLogin" @submit="onFormSubmit" class="grid lg:grid-cols-2 gap-4 w-full">
    <div class="flex flex-col justify-center items-center gap-4">
      <InputField v-for="field in fields" :key="field.name" v-bind="field" />

      <Button type="submit" severity="secondary" label="Submit" class="w-full sm:w-56" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { Form } from '@primevue/forms';
import { Button } from 'primevue';
import InputField from '../../shared/components/InputField.vue';
import { AuthFacadeService } from '../services/auth-facade.service.ts';
import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms';
import type { LoginFormValues } from '../models/user';
import type { ResolverResult } from '../../shared/models/form';

const router = useRouter();
const toast = useToast();
const authFacade = new AuthFacadeService();

const fields = [
  {
    name: 'email',
    type: 'text',
    placeholder: 'Email',
    autocomplete: 'email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    autocomplete: 'current-password',
    feedback: false,
    toggleMask: true,
    fluid: true,
  },
];

const initialValues = ref<LoginFormValues>({
  email: '',
  password: '',
});

const resolverLogin = (e: FormResolverOptions): ResolverResult<LoginFormValues> => {
  const values = e.values as LoginFormValues;
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.email) {
    errors.email = { type: 'required', message: 'Email is required.' };
  } else if (values.email.length < 3) {
    errors.email = { type: 'minLength', message: 'Email must be at least 3 characters long.' };
  }

  const password = values.password || '';
  if (!password) {
    errors.password = { type: 'required', message: 'Password is required.' };
  } else {
    if (password.length < 8) {
      errors.password = { type: 'minLength', message: 'Password must be at least 8 characters long.' };
    } else if (!/[A-Z]/.test(password)) {
      errors.password = { type: 'uppercase', message: 'Password must contain at least one uppercase letter.' };
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = { type: 'specialChar', message: 'Password must contain at least one special character.' };
    }
  }

  return { values, errors };
};

async function onFormSubmit(event: FormSubmitEvent): Promise<void> {
  if (event.valid) {
    try {
      await authFacade.login(event.values.email, event.values.password);
      toast.add({ severity: 'success', summary: 'Form submitted.', life: 3000 });
      event.reset();
      await router.push('/game');
    } catch (error) {
      console.error(error);
      toast.add({ severity: 'error', summary: 'Error logging in' });
    }
  }
}
</script>
