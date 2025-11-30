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
        <div class="icon-wrapper edit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">تعديل التقنية</h1>
          <p class="page-subtitle">تحديث بيانات التقنية الموجودة</p>
        </div>
      </div>
    </div>

    <div v-if="pageLoading" class="form-loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل بيانات التقنية...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">معلومات التقنية</h2>
            <p class="section-subtitle">تعديل البيانات الأساسية</p>
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
              placeholder="مثال: devicon-vuejs-plain"
              dir="ltr"
            />
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
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري حفظ التعديلات...' : 'حفظ التعديلات' }}
        </button>
        <router-link to="/technologies" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTechnologiesStore } from '@/stores/technologies';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ Import  
const router = useRouter();
const route = useRoute();
const store = useTechnologiesStore();

const loading = ref(false);
const pageLoading = ref(true);
const techId = route.params.id;

const categories = ref([
    { value: 'Language', label: 'لغة برمجة' },
    { value: 'Framework', label: 'إطار عمل' },
    { value: 'Library', label: 'مكتبة' },
    { value: 'Tool', label: 'أداة' },
    { value: 'Database', label: 'قاعدة بيانات' },
    { value: 'Platform', label: 'منصة' }
]);

const formData = reactive({
  name: '',
  category: '',
  iconUrl: '',
  color: ''
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    // Fetch data from API
    // Note: Using the service directly or a store getter
    // If the store has all items, we can find it. If not, we fetch specific.
    // Let's assume we need to fetch it fresh to get details.
    // TechnologiesService.getById(id) -> endpoint: GET /api/technologies/{id}

    // Check if service supports getById (implied by Controller)
    // Since store file didn't show getById, I'll use axios or assume service extension
    // If store has "technologies", we can try to find it there first, but fresh is better.

    // Assuming technologiesService has getById or we add it.
    // Based on uploaded files, the controller supports it.
    // Since I cannot edit the service file, I will fetch all and find, or implement a direct fetch here.
    // Best practice: Fetch All if list is empty, then find.

    if (store.technologies.length === 0) {
        await store.fetchTechnologies();
    }

    const technology = store.technologies.find(t => t.id == techId);

    if (technology) {
      formData.name = technology.name;
      formData.category = technology.category;
      formData.iconUrl = technology.iconUrl;
      formData.color = technology.color || '#FF6F61';
    } else {
       // If not found in list, maybe try to fetch specific or redirect
       // For now, redirect to list
       alert('لم يتم العثور على التقنية');
       router.push('/technologies');
    }
  } catch (err) {
    console.error(err);
    router.push('/technologies');
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  // ✅ Guest Check
  if (handleGuestAction()) return;

  if (!formData.name || !formData.category) return;

  loading.value = true;
  try {
    await store.updateTechnology(techId, formData);
    router.push('/technologies');
  } catch (err) {
    // ✅ Silent return
    if (err.message === 'GUEST_ACTION_BLOCKED') return;

    console.error(err);
    alert('حدث خطأ أثناء التعديل: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Reuse styles from Create file */
.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

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

.back-btn:hover { color: #1f2937; gap: 8px; }
.back-btn svg { width: 18px; height: 18px; }

.header-content { display: flex; align-items: center; gap: 16px; }

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper.edit-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}

.icon-wrapper svg { width: 28px; height: 28px; color: white; stroke-width: 2; }

.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: #6b7280; }

.form-loading-state {
  background: white;
  border-radius: 16px;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #6b7280;
  font-size: 16px;
}

.form-loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.form-container { display: flex; flex-direction: column; gap: 24px; }
.form-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #f3f4f6; }
.section-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.section-icon.red { background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%); }
.section-icon svg { width: 24px; height: 24px; color: white; stroke-width: 2; }

.section-title { font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.section-subtitle { font-size: 13px; color: #6b7280; }

.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.form-label.required::after { content: '*'; color: #ef4444; margin-right: 4px; }

.form-input, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus, .form-select:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }

.color-input-wrapper { display: flex; gap: 10px; align-items: center; }
.color-picker { width: 50px; height: 48px; padding: 2px; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; background: white; }

.form-actions { display: flex; gap: 12px; }
.submit-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.submit-btn svg { width: 20px; height: 20px; }

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
.cancel-btn:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .header-content { flex-direction: column; text-align: center; }
}
</style>
