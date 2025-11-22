<template>
  <div class="create-container">
    <div class="header-section">
      <router-link to="/testimonials" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        رجوع للقائمة
      </router-link>
      <div class="header-content">
        <div class="icon-wrapper edit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">تعديل الرأي</h1>
          <p class="page-subtitle">تحديث بيانات وتقييم العميل</p>
        </div>
      </div>
    </div>

    <div v-if="pageLoading" class="loading-state">
      <div class="spinner dark"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon blue">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">بيانات العميل</h2>
            <p class="section-subtitle">المعلومات الشخصية لمقدم الرأي</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">اسم العميل</label>
            <input v-model="formData.clientName" type="text" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">المسمى الوظيفي</label>
            <input v-model="formData.clientPosition" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">اسم الشركة</label>
            <input v-model="formData.clientCompany" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">رابط الصورة (URL)</label>
            <input v-model="formData.clientImageUrl" type="url" class="form-input" dir="ltr" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon gold">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h.01M10 16h4M9 20l4-4 4 4-4-4v-8M9 4v8" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">تفاصيل الرأي</h2>
            <p class="section-subtitle">نص الرأي والتقييم</p>
          </div>
        </div>

        <div class="form-group mb-6">
            <label class="form-label required">التقييم</label>
            <div class="rating-input">
                <button
                    type="button"
                    v-for="star in 5"
                    :key="star"
                    @click="formData.rating = star"
                    class="star-btn"
                    :class="{ active: star <= formData.rating }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
                <span class="rating-text">({{ formData.rating }} من 5)</span>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label required">نص الرأي</label>
            <textarea v-model="formData.testimonialText" rows="4" required class="form-input"></textarea>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">الإعدادات</h2>
            <p class="section-subtitle">حالة الظهور والترتيب</p>
          </div>
        </div>

        <div class="settings-grid">
          <label class="toggle-card">
            <input v-model="formData.isApproved" type="checkbox" class="toggle-input" />
            <div class="toggle-content">
              <div class="toggle-icon green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="toggle-title">الموافقة والنشر</h3>
                <p class="toggle-description">إظهار هذا الرأي في الموقع العام</p>
              </div>
            </div>
            <div class="toggle-switch"><span class="toggle-slider"></span></div>
          </label>

           <div class="form-group">
            <label class="form-label">ترتيب العرض</label>
            <input v-model.number="formData.displayOrder" type="number" class="form-input" />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="!loading">حفظ التعديلات</span>
          <div v-else class="spinner"></div>
        </button>
        <router-link to="/testimonials" class="cancel-btn">إلغاء</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTestimonialsStore } from '@/stores/testimonials';

const router = useRouter();
const route = useRoute();
const testimonialsStore = useTestimonialsStore();

const loading = ref(false);
const pageLoading = ref(true);
const testimonialId = route.params.id;

const formData = reactive({
  clientName: '',
  clientPosition: '',
  clientCompany: '',
  clientImageUrl: '',
  testimonialText: '',
  rating: 5,
  isApproved: false,
  displayOrder: 0
});

onMounted(async () => {
  try {
    // If store is empty, fetch all first (or implement getById in store)
    if (testimonialsStore.testimonials.length === 0) {
      await testimonialsStore.fetchTestimonials();
    }

    const testimonial = testimonialsStore.testimonials.find(t => t.id == testimonialId);

    if (testimonial) {
      Object.assign(formData, testimonial);
    } else {
      alert('لم يتم العثور على الرأي المطلوب');
      router.push('/testimonials');
    }
  } catch (error) {
    console.error(error);
    router.push('/testimonials');
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await testimonialsStore.updateTestimonial(testimonialId, formData);
    router.push('/testimonials');
  } catch (error) {
    console.error('Update failed:', error);
    alert('حدث خطأ أثناء التحديث');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Inheriting styles from Create View + Edit specifics */
.create-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.header-section { background: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 16px; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 14px; font-weight: 600; text-decoration: none; }
.header-content { display: flex; align-items: center; gap: 16px; }
.icon-wrapper.edit-icon { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); }
.icon-wrapper { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; }
.icon-wrapper svg { width: 28px; height: 28px; }
.page-title { font-size: 24px; font-weight: 700; color: #111827; }
.page-subtitle { font-size: 14px; color: #6b7280; }
.form-container { display: flex; flex-direction: column; gap: 24px; }
.form-section { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.section-header { display: flex; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
.section-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.section-icon.blue { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }
.section-icon.gold { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.section-icon.red { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); }
.section-icon svg { width: 24px; height: 24px; }
.section-title { font-size: 18px; font-weight: 700; color: #1f2937; }
.section-subtitle { font-size: 13px; color: #6b7280; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.mb-6 { margin-bottom: 24px; }
.form-label { font-weight: 600; font-size: 14px; color: #374151; }
.form-label.required::after { content: " *"; color: #ef4444; }
.form-input { padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: border-color 0.2s; }
.form-input:focus { outline: none; border-color: #FF5F6D; }

/* Rating */
.rating-input { display: flex; align-items: center; gap: 4px; }
.star-btn { background: none; border: none; cursor: pointer; padding: 2px; color: #d1d5db; }
.star-btn svg { width: 32px; height: 32px; }
.star-btn.active { color: #fbbf24; }
.rating-text { margin-right: 8px; font-weight: 600; color: #6b7280; }

/* Toggle Switch */
.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.toggle-card { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.toggle-card:hover { background: #f3f4f6; }
.toggle-input { display: none; }
.toggle-input:checked + .toggle-content + .toggle-switch .toggle-slider { background: #10b981; }
.toggle-input:checked + .toggle-content + .toggle-switch .toggle-slider::before { transform: translateX(24px); }
.toggle-content { display: flex; align-items: center; gap: 12px; flex: 1; }
.toggle-icon.green { background: #10b981; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
.toggle-icon svg { width: 20px; height: 20px; }
.toggle-title { font-size: 14px; font-weight: 600; color: #1f2937; }
.toggle-description { font-size: 12px; color: #6b7280; }
.toggle-switch { width: 52px; height: 28px; background: #d1d5db; border-radius: 14px; position: relative; transition: all 0.3s; }
.toggle-slider { position: absolute; top: 2px; left: 2px; width: 24px; height: 24px; background: white; border-radius: 50%; transition: all 0.3s; }
.toggle-slider::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: white; transition: transform 0.3s; }

.form-actions { display: flex; gap: 12px; padding-top: 12px; }
.submit-btn { flex: 1; background: linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%); color: white; padding: 14px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; justify-content: center; }
.cancel-btn { padding: 14px 32px; background: white; border: 2px solid #e5e7eb; color: #6b7280; border-radius: 10px; font-weight: 600; text-decoration: none; display: flex; align-items: center; }

/* Loading State */
.loading-state { text-align: center; padding: 60px; background: white; border-radius: 16px; border: 1px solid #e5e7eb; }
.spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner.dark { border-color: #e5e7eb; border-top-color: #FF5F6D; width: 40px; height: 40px; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .settings-grid { grid-template-columns: 1fr; }
}
</style>
