<template>
  <div class="create-container">
    <div class="header-section">
      <router-link to="/social-media" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        رجوع
      </router-link>
      <div class="header-content">
        <div class="icon-wrapper edit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">تعديل رابط التواصل</h1>
          <p class="page-subtitle">تحديث بيانات الرابط الحالي</p>
        </div>
      </div>
    </div>

    <div v-if="pageLoading" class="form-loading-state">
      <div class="spinner-large"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <div v-else-if="errorMsg && !formData.platform" class="error-alert">
        {{ errorMsg }}
        <router-link to="/social-media" class="retry-link">العودة للقائمة</router-link>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V10.5m-1.5-7.5l4.5 4.5m-4.5-4.5V7.5M19.5 10.5h-4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">معلومات الرابط</h2>
            <p class="section-subtitle">قم بتعديل البيانات المطلوبة</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">منصة التواصل</label>
            <select
              v-model="formData.platform"
              required
              class="form-select"
              :disabled="authStore.isGuest"
            >
              <option value="" disabled>اختر المنصة</option>
              <option v-for="p in platforms" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">رابط الصفحة (URL)</label>
            <input
              v-model="formData.profileUrl"
              type="url"
              required
              class="form-input"
              placeholder="https://linkedin.com/in/username"
              dir="ltr"
              :disabled="authStore.isGuest"
            />
          </div>

          <div class="form-group">
            <label class="form-label">ترتيب العرض</label>
            <input
              v-model.number="formData.displayOrder"
              type="number"
              min="0"
              class="form-input"
              :disabled="authStore.isGuest"
            />
          </div>

          <div class="form-group">
            <label class="form-label">عنوان الأيقونة</label>
            <input
              v-model="formData.iconClass"
              type="text"
              class="form-input"
              dir="ltr"
              :disabled="authStore.isGuest"
            />
            <p class="form-hint">اختياري</p>
          </div>
        </div>
      </div>

      <div v-if="submitError" class="error-alert">{{ submitError }}</div>

      <!-- ✅ إظهار الأزرار فقط للـ Admin -->
      <div v-if="authStore.canModify" class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري الحفظ...' : 'حفظ التعديلات' }}
        </button>
        <router-link to="/social-media" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import socialMediaService from '@/services/socialMediaService';
import { useAuthStore } from '@/stores/auth'; // ✅
import { handleGuestAction } from '@/utils/roleHandler'; // ✅

const authStore = useAuthStore(); // ✅
const router = useRouter();
const route = useRoute();
const linkId = route.params.id;

const loading = ref(false);
const pageLoading = ref(true);
const errorMsg = ref('');
const submitError = ref('');

const platforms = ref([
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Twitter', label: 'Twitter (X)' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Website', label: 'موقع شخصي' },
]);

const formData = reactive({
  platform: '',
  profileUrl: '',
  iconClass: '',
  displayOrder: 0
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    const response = await socialMediaService.getById(linkId);
    const data = response.data || response;

    if (data) {
      formData.platform = data.platform;
      formData.profileUrl = data.profileUrl;
      formData.iconClass = data.iconClass;
      formData.displayOrder = data.displayOrder;
    } else {
      errorMsg.value = 'لم يتم العثور على الرابط المطلوب';
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = 'حدث خطأ أثناء تحميل البيانات';
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  // ✅ التحقق من صلاحيات Guest
  if (handleGuestAction('edit')) return;

  loading.value = true;
  submitError.value = '';
  try {
    await socialMediaService.update(linkId, formData);
    router.push('/social-media');
  } catch (err) {
    console.error(err);
    if (err.response && err.response.data && err.response.data.errors) {
        submitError.value = Object.values(err.response.data.errors).flat().join(', ');
    } else {
        submitError.value = err.message || 'حدث خطأ أثناء الحفظ';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.header-section { background: white; border-radius: 16px; padding: 24px 28px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 20px; }
.header-content { display: flex; align-items: center; gap: 16px; }
.icon-wrapper { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-wrapper.edit-icon { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); }
.icon-wrapper svg { width: 28px; height: 28px; color: white; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; }
.page-subtitle { font-size: 14px; color: #6b7280; }

.form-container { display: flex; flex-direction: column; gap: 24px; }
.form-section { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
.section-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #f3f4f6; }

.section-icon {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  max-width: 48px !important;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.section-icon.orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.section-icon svg {
  width: 24px !important;
  height: 24px !important;
  color: white;
  display: block;
}

.section-title { font-size: 18px; font-weight: 700; color: #1f2937; }

.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.form-label.required::after { content: '*'; color: #ef4444; }
.form-input, .form-select { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; background: white; }
.form-input:disabled, .form-select:disabled { background: #f9fafb; color: #6b7280; cursor: not-allowed; opacity: 0.7; }
.form-input:focus:not(:disabled), .form-select:focus:not(:disabled) { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }

.form-actions { display: flex; gap: 12px; padding-top: 8px; }
.submit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 14px 24px; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.submit-btn:hover:not(:disabled) { transform: translateY(-2px); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.cancel-btn { padding: 14px 32px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; }

.form-loading-state { text-align: center; padding: 60px; color: #6b7280; }
.spinner, .spinner-large { border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner { width: 20px; height: 20px; }
.spinner-large { width: 40px; height: 40px; border-color: #f3f4f6; border-top-color: #f59e0b; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-alert { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
.retry-link { display: inline-block; margin-top: 8px; color: #b91c1c; text-decoration: underline; }

@media (max-width: 768px) {
  .create-container { padding: 16px; }
  .header-content, .section-header, .form-actions { flex-direction: column; text-align: center; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
