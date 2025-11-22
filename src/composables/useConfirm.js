// src/composables/useConfirm.js
import { ref } from 'vue';

const isOpen = ref(false);
const message = ref('');
const title = ref('');
const confirmCallback = ref(null);
const cancelCallback = ref(null);

export function useConfirm() {
  const confirm = ({
    titleText = 'تأكيد العملية',
    messageText = 'هل أنت متأكد؟',
    onConfirm = () => {},
    onCancel = () => {}
  }) => {
    return new Promise((resolve) => {
      title.value = titleText;
      message.value = messageText;
      isOpen.value = true;

      confirmCallback.value = () => {
        onConfirm();
        resolve(true);
        close();
      };

      cancelCallback.value = () => {
        onCancel();
        resolve(false);
        close();
      };
    });
  };

  const close = () => {
    isOpen.value = false;
    title.value = '';
    message.value = '';
  };

  return {
    isOpen,
    title,
    message,
    confirm,
    confirmCallback,
    cancelCallback,
    close
  };
}
