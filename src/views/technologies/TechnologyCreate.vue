<template>
  <div class="create-container">
    <div class="header-section">
      <router-link to="/technologies" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        رجوع للقائمة
      </router-link>
      <div class="header-content">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">إضافة تقنية جديدة</h1>
          <p class="page-subtitle">أدخل بيانات التقنية ليتم إضافتها لقاعدة البيانات</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">معلومات التقنية</h2>
            <p class="section-subtitle">البيانات الأساسية للتقنية</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">اسم التقنية</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="مثال: Vue.js، C#"
            />
          </div>

          <div class="form-group">
            <label class="form-label required">فئة التقنية</label>
            <select v-model="formData.category" required class="form-select">
              <option value="">اختر الفئة</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">أيقونة التقنية (Devicon Class أو رابط)</label>
            <input
              v-model="formData.iconUrl"
              type="text"
              class="form-input"
              placeholder="مثال: devicon-vuejs-plain أو https://..."
              dir="ltr"
            />
            <p class="form-hint">يمكنك استخدام كلاس من مكتبة Devicon أو رابط مباشر لصورة.</p>
          </div>

          <div class="form-group">
            <label class="form-label">لون التقنية</label>
            <div class="color-input-wrapper">
              <input
                v-model="formData.color"
                type="color"
                class="color-picker"
              />
              <input
                v-model="formData.color"
                type="text"
                class="form-input"
                placeholder="#000000"
                dir="ltr"
              />
            </div>
            <p class="form-hint">يستخدم لتلوين الحدود والأيقونات.</p>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري الحفظ...' : 'حفظ التقنية' }}
        </button>
        <router-link to="/technologies" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useTechnologiesStore } from '@/stores/technologies';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ Import
const router = useRouter();
const store = useTechnologiesStore();

const loading = ref(false);

const categories = ref([
    { value: 'Language', label: 'لغة برمجة' },
    { value: 'Framework', label: 'إطار عمل' },
    { value: 'Library', label: 'مكتبة' },
    { value: 'Tool', label: 'أداة' },
    { value: 'Database', label: 'قاعدة بيانات' },
    { value: 'Platform', label: 'منصة' }
]);

// DTO structure based on PortfolioDTOs.cs (TechnologyCreateUpdateDto)
const formData = reactive({
  name: '',
  category: '',
  iconUrl: '', // Maps to IconUrl in DTO
  color: '#FF6F61' // Maps to Color in DTO
});

const handleSubmit = async () => {
  // ✅ Guest Check
  if (handleGuestAction()) return;

  if (!formData.name || !formData.category) return;

  loading.value = true;
  try {
    await store.createTechnology(formData);
    router.push('/technologies');
  } catch (err) {
    // ✅ Silent return
    if (err.message === 'GUEST_ACTION_BLOCKED') return;

    console.error(err);
    alert('حدث خطأ أثناء حفظ البيانات: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Reuse the styles from the previous file for consistency */
.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header-section {
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.back-btn:hover {
  color: #1f2937;
  gap: 8px;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 28px;
  height: 28px;
  color: white;
  stroke-width: 2;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* Form Section */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.section-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon.red {
  background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%);
}

.section-icon svg {
  width: 24px;
  height: 24px;
  color: white;
  stroke-width: 2;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-right: 4px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #FF6F61;
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

/* Color Input */
.color-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-picker {
  width: 50px;
  height: 48px;
  padding: 2px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 12px;
}

.submit-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn svg {
  width: 20px;
  height: 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.cancel-btn {
  padding: 14px 32px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .header-content { flex-direction: column; text-align: center; }
}
</style>
