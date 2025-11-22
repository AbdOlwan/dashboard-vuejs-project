// src/composables/usePagination.js
import { ref, computed } from 'vue';

export function usePagination(items, itemsPerPage = 10) {
  const currentPage = ref(1);
  const perPage = ref(itemsPerPage);

  const totalPages = computed(() => {
    const itemsArray = items.value || items;
    return Math.ceil(itemsArray.length / perPage.value);
  });

  const paginatedItems = computed(() => {
    const itemsArray = items.value || items;
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return itemsArray.slice(start, end);
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    goToPage(currentPage.value + 1);
  };

  const prevPage = () => {
    goToPage(currentPage.value - 1);
  };

  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  return {
    currentPage,
    perPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  };
}
