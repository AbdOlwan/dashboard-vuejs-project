// src/composables/useLoading.js
import { ref } from 'vue';

export function useLoading(initialState = false) {
  const isLoading = ref(initialState);

  const startLoading = () => {
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  const withLoading = async (callback) => {
    startLoading();
    try {
      return await callback();
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  };
}
