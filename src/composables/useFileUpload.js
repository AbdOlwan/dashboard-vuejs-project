// src/composables/useFileUpload.js
import { ref } from 'vue';

export function useFileUpload() {
  const file = ref(null);
  const preview = ref(null);
  const error = ref(null);

  const selectFile = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    file.value = selectedFile;
    error.value = null;

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.value = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    file.value = null;
    preview.value = null;
    error.value = null;
  };

  const uploadFile = async (uploadFunction) => {
    if (!file.value) {
      error.value = 'الرجاء اختيار ملف';
      return null;
    }

    try {
      const result = await uploadFunction(file.value);
      clearFile();
      return result;
    } catch (err) {
      error.value = err.message;
      return null;
    }
  };

  return {
    file,
    preview,
    error,
    selectFile,
    clearFile,
    uploadFile
  };
}
