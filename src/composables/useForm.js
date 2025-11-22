// src/composables/useForm.js
import { reactive, computed } from 'vue';

export function useForm(initialValues = {}, validationRules = {}) {
  const formData = reactive({ ...initialValues });
  const errors = reactive({});
  const touched = reactive({});

  const validate = (field) => {
    if (validationRules[field]) {
      const rule = validationRules[field];
      const value = formData[field];

      // Required validation
      if (rule.required && !value) {
        errors[field] = rule.message || 'هذا الحقل مطلوب';
        return false;
      }

      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = rule.message || `الحد الأدنى ${rule.minLength} أحرف`;
        return false;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.message || `الحد الأقصى ${rule.maxLength} أحرف`;
        return false;
      }

      // Email validation
      if (rule.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = rule.message || 'البريد الإلكتروني غير صحيح';
          return false;
        }
      }

      // Custom validation
      if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || 'القيمة غير صحيحة';
        return false;
      }

      errors[field] = '';
      return true;
    }
    return true;
  };

  const validateAll = () => {
    let isValid = true;
    Object.keys(validationRules).forEach(field => {
      if (!validate(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleBlur = (field) => {
    touched[field] = true;
    validate(field);
  };

  const handleInput = (field) => {
    if (touched[field]) {
      validate(field);
    }
  };

  const reset = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = initialValues[key] || '';
      errors[key] = '';
      touched[key] = false;
    });
  };

  const isValid = computed(() => {
    return Object.values(errors).every(error => !error);
  });

  return {
    formData,
    errors,
    touched,
    validate,
    validateAll,
    handleBlur,
    handleInput,
    reset,
    isValid
  };
}
