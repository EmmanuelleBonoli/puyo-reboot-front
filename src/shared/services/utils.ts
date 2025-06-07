import { useToast } from 'primevue/usetoast';

export function toastCommonError(): void {
  const toast = useToast();
  toast.add({ severity: 'error', summary: 'Un problème est survenu, veuillez réessayer' });
}
