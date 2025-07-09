<template>
  <Form :initialValues="initialValues" :resolver="resolverLogin" @submit="onFormSubmit" class="grid lg:grid-cols-2 gap-4 w-full">
    <div class="flex flex-col justify-center items-center gap-4">
      <InputField v-for="field in fields" :key="field.name" v-bind="field" />
      <Button type="submit" severity="secondary" :label="t('login.formSubmit')" class="w-full sm:w-56" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { Form } from '@primevue/forms';
import { Button } from 'primevue';
import { useI18n } from 'vue-i18n';
import InputField from '../../shared/components/InputField.vue';
import { AuthFacadeService } from '../services/auth-facade.service.ts';
import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms';
import type { LoginFormValues } from '../models/user.types.ts';
import type { ResolverResult } from '../../shared/models/form';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const authFacade = new AuthFacadeService();

const fields = [
  {
    name: 'email',
    type: 'text',
    placeholder: t('login.email'),
    autocomplete: 'email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: t('login.password'),
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
    errors.email = { type: 'required', message: t('login.emailRequired') };
  } else if (values.email.length < 3) {
    errors.email = { type: 'minLength', message: t('login.emailMinLength') };
  }

  const password = values.password || '';
  if (!password) {
    errors.password = { type: 'required', message: t('login.passwordRequired') };
  } else {
    if (password.length < 8) {
      errors.password = { type: 'minLength', message: t('login.passwordMinLength') };
    } else if (!/[A-Z]/.test(password)) {
      errors.password = { type: 'uppercase', message: t('login.passwordUppercase') };
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = { type: 'specialChar', message: t('login.passwordCharacter') };
    }
  }

  return { values, errors };
};

async function onFormSubmit(event: FormSubmitEvent): Promise<void> {
  if (event.valid) {
    try {
      await authFacade.login(event.values.email, event.values.password);
      event.reset();
      await router.push('/game');
    } catch (error) {
      console.error('le login a échoué : ', error);
      toast.add({ severity: 'error', summary: t('login.formError') });
    }
  }
}
</script>
