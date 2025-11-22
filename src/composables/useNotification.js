// src/composables/useNotification.js
import { ref } from 'vue';

const notifications = ref([]);
let nextId = 0;

export function useNotification() {
  const add = (message, type = 'info', duration = 3000) => {
    const id = nextId++;
    const notification = {
      id,
      message,
      type, // success, error, warning, info
      visible: true
    };

    notifications.value.push(notification);

    setTimeout(() => {
      remove(id);
    }, duration);

    return id;
  };

  const remove = (id) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (message, duration) => add(message, 'success', duration);
  const error = (message, duration) => add(message, 'error', duration);
  const warning = (message, duration) => add(message, 'warning', duration);
  const info = (message, duration) => add(message, 'info', duration);

  return {
    notifications,
    add,
    remove,
    success,
    error,
    warning,
    info
  };
}
