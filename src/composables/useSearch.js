
// src/composables/useSearch.js
import { ref, computed } from 'vue';

export function useSearch(items, searchableFields = []) {
  const searchQuery = ref('');

  const filteredItems = computed(() => {
    if (!searchQuery.value) {
      return items.value || items;
    }

    const query = searchQuery.value.toLowerCase();
    const itemsArray = items.value || items;

    return itemsArray.filter(item => {
      return searchableFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        return false;
      });
    });
  });

  const clearSearch = () => {
    searchQuery.value = '';
  };

  return {
    searchQuery,
    filteredItems,
    clearSearch
  };
}
