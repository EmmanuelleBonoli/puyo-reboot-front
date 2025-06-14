import { useToast } from 'primevue/usetoast';

export function useCommonToasts(): { showToastError: () => void } {
  const toast = useToast();

  function showToastError(): void {
    toast.add({
      severity: 'error',
      summary: 'Un problème est survenu, veuillez réessayer',
    });
  }

  return {
    showToastError,
  };
}
