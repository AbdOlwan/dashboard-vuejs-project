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
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">إضافة رابط تواصل جديد</h1>
          <p class="page-subtitle">أضف رابط تواصل جديد إلى بورتفوليو الخاص بك</p>
        </div>
      </div>
    </div>

    <div v-if="errorMsg" class="error-alert">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V10.5m-1.5-7.5l4.5 4.5m-4.5-4.5V7.5M19.5 10.5h-4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">معلومات الرابط</h2>
            <p class="section-subtitle">أدخل منصة التواصل والرابط الخاص بها</p>
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
            <p class="form-hint">يجب أن يكون الرابط كاملاً وصحيحاً</p>
          </div>

          <div class="form-group">
            <label class="form-label">ترتيب العرض</label>
            <input
              v-model.number="formData.displayOrder"
              type="number"
              min="0"
              class="form-input"
              placeholder="0"
              :disabled="authStore.isGuest"
            />
            <p class="form-hint">الأقل رقماً يظهر أولاً</p>
          </div>

          <div class="form-group">
            <label class="form-label">عنوان الأيقونة (اختياري)</label>
            <input
              v-model="formData.iconClass"
              type="text"
              class="form-input"
              placeholder="مثال: fab fa-linkedin-in"
              dir="ltr"
              :disabled="authStore.isGuest"
            />
            <p class="form-hint">إذا تركت فارغاً سيتم استخدام الأيقونة الافتراضية للمنصة</p>
          </div>
        </div>
      </div>

      <!-- ✅ إظهار الأزرار فقط للـ Admin -->
      <div v-if="authStore.canModify" class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري الحفظ...' : 'حفظ الرابط' }}
        </button>
        <router-link to="/social-media" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import socialMediaService from '@/services/socialMediaService';
import { useAuthStore } from '@/stores/auth'; // ✅
import { handleGuestAction } from '@/utils/roleHandler'; // ✅

const authStore = useAuthStore(); // ✅
const router = useRouter();
const loading = ref(false);
const errorMsg = ref('');

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

const handleSubmit = async () => {
  // ✅ التحقق من صلاحيات Guest
  if (handleGuestAction('add')) return;

  loading.value = true;
  errorMsg.value = '';

  try {
    await socialMediaService.create({ ...formData });
    router.push('/social-media');
  } catch (err) {
    console.error('Submit Error:', err);

    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMsg.value = err.errors.join(', ');
    } else if (err.errors && typeof err.errors === 'object') {
        errorMsg.value = Object.values(err.errors).flat().join(', ');
    } else {
        errorMsg.value = err.message || 'حدث خطأ أثناء إضافة الرابط.';
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
.back-btn:hover { color: #1f2937; }
.back-btn svg { width: 18px; height: 18px; }
.header-content { display: flex; align-items: center; gap: 16px; }

.icon-wrapper { width: 56px; height: 56px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-wrapper svg { width: 28px; height: 28px; color: white; stroke-width: 2; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
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
.section-icon.green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.section-icon svg {
  width: 24px !important;
  height: 24px !important;
  color: white;
  stroke-width: 2;
  display: block;
}

.section-title { font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.section-subtitle { font-size: 13px; color: #6b7280; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.form-label.required::after { content: '*'; color: #ef4444; font-size: 16px; margin-right: 4px; }
.form-input, .form-select { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: all 0.2s; background: white; }
.form-input:disabled, .form-select:disabled { background: #f9fafb; color: #6b7280; cursor: not-allowed; opacity: 0.7; }
.form-input:focus:not(:disabled), .form-select:focus:not(:disabled) { outline: none; border-color: #43e97b; box-shadow: 0 0 0 3px rgba(67, 233, 123, 0.1); }
.form-hint { font-size: 12px; color: #9ca3af; margin-top: 6px; }
.form-actions { display: flex; gap: 12px; padding-top: 8px; }
.submit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 14px 24px; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3); }
.submit-btn:hover:not(:disabled) { transform: translateY(-2px); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.cancel-btn { padding: 14px 32px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.cancel-btn:hover { background: #f9fafb; color: #374151; }
.error-alert { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }

@media (max-width: 768px) {
  .create-container { padding: 16px; }
  .header-content, .section-header, .form-actions { flex-direction: column; text-align: center; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
