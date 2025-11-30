<template>
  <div class="create-container">
    <div class="header-section">
      <router-link to="/testimonials" class="back-btn">
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
          <h1 class="page-title">إضافة رأي جديد</h1>
          <p class="page-subtitle">إدخال تفاصيل تقييم العميل</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
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
            <input
              v-model="formData.clientName"
              type="text"
              required
              class="form-input"
              placeholder="مثال: محمد أحمد"
            />
          </div>

          <div class="form-group">
            <label class="form-label">المسمى الوظيفي</label>
            <input
              v-model="formData.clientPosition"
              type="text"
              class="form-input"
              placeholder="مثال: مدير التسويق"
            />
          </div>

          <div class="form-group">
            <label class="form-label">اسم الشركة</label>
            <input
              v-model="formData.clientCompany"
              type="text"
              class="form-input"
              placeholder="مثال: شركة التقنية الحديثة"
            />
          </div>

          <div class="form-group">
            <label class="form-label">رابط الصورة (URL)</label>
            <input
              v-model="formData.clientImageUrl"
              type="url"
              class="form-input"
              :class="{ 'border-red-500': urlError }"
              placeholder="https://example.com/image.jpg"
              dir="ltr"
              @input="validateUrl"
            />
            <span v-if="urlError" class="error-text">{{ urlError }}</span>

            <div v-if="formData.clientImageUrl && !urlError" class="image-preview">
              <p class="preview-label">معاينة:</p>
              <img
                :src="formData.clientImageUrl"
                @error="handleImageError"
                alt="preview"
              />
            </div>
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
            <h2 class="section-title">تفاصيل الرأي والتقييم</h2>
            <p class="section-subtitle">نص الرأي وعدد النجوم الممنوحة</p>
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
            <textarea
                v-model="formData.testimonialText"
                rows="4"
                required
                class="form-input"
                placeholder="اكتب رأي العميل هنا..."
            ></textarea>
        </div>

        <div class="form-group mt-4">
            <label class="form-label">ترتيب العرض</label>
            <input
              v-model.number="formData.displayOrder"
              type="number"
              class="form-input"
              style="max-width: 150px;"
            />
            <span class="form-hint">الرقم الأقل يظهر أولاً (0 هو الأعلى)</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading || urlError" class="submit-btn">
          <span v-if="!loading">حفظ الرأي</span>
          <div v-else class="spinner"></div>
        </button>
        <router-link to="/testimonials" class="cancel-btn">إلغاء</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useTestimonialsStore } from '@/stores/testimonials';

const router = useRouter();
const testimonialsStore = useTestimonialsStore();
const loading = ref(false);
const urlError = ref(null);

const formData = reactive({
  clientName: '',
  clientPosition: '',
  clientCompany: '',
  clientImageUrl: '',
  testimonialText: '',
  rating: 5,
  displayOrder: 0
});

// ✅ التحقق من صحة الرابط
const validateUrl = () => {
  const url = formData.clientImageUrl;
  if (!url) {
    urlError.value = null;
    return;
  }

  // منع الروابط المحلية
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    urlError.value = '⛔ لا يمكن استخدام روابط محلية (Localhost) في بيئة الإنتاج';
    return;
  }

  urlError.value = null;
};

// ✅ التعامل مع خطأ تحميل الصورة في المعاينة
const handleImageError = () => {
  urlError.value = '⚠️ الرابط لا يؤدي إلى صورة صالحة';
};

const handleSubmit = async () => {
  if (urlError.value) return;

  loading.value = true;
  try {
    const result = await testimonialsStore.createTestimonial(formData);

    if (result === null) {
      // Guest blocked
      return;
    }

    router.push('/testimonials');
  } catch (error) {
    console.error('Error creating testimonial:', error);
    alert('حدث خطأ أثناء إضافة الرأي');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Reusing the design system */
.create-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.header-section { background: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 16px; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 14px; font-weight: 600; text-decoration: none; }
.back-btn:hover { color: #111827; }
.header-content { display: flex; align-items: center; gap: 16px; }
.icon-wrapper { width: 56px; height: 56px; background: linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; }
.icon-wrapper svg { width: 28px; height: 28px; }
.page-title { font-size: 24px; font-weight: 700; color: #111827; }
.page-subtitle { font-size: 14px; color: #6b7280; }
.form-container { display: flex; flex-direction: column; gap: 24px; }
.form-section { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.section-header { display: flex; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
.section-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.section-icon.blue { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }
.section-icon.gold { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.section-icon svg { width: 24px; height: 24px; }
.section-title { font-size: 18px; font-weight: 700; color: #1f2937; }
.section-subtitle { font-size: 13px; color: #6b7280; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.mb-6 { margin-bottom: 24px; }
.mt-4 { margin-top: 16px; }
.form-label { font-weight: 600; font-size: 14px; color: #374151; }
.form-label.required::after { content: " *"; color: #ef4444; }

.form-input { padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: border-color 0.2s; }
.form-input:focus { outline: none; border-color: #FF5F6D; }
.border-red-500 { border-color: #ef4444 !important; }
.error-text { font-size: 12px; color: #ef4444; margin-top: 4px; }

/* Image Preview */
.image-preview { margin-top: 8px; display: flex; align-items: center; gap: 10px; padding: 8px; background: #f9fafb; border-radius: 8px; }
.preview-label { font-size: 12px; color: #6b7280; }
.image-preview img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

.form-hint { font-size: 12px; color: #9ca3af; }
.rating-input { display: flex; align-items: center; gap: 4px; }
.star-btn { background: none; border: none; cursor: pointer; padding: 2px; color: #d1d5db; transition: transform 0.1s; }
.star-btn svg { width: 32px; height: 32px; }
.star-btn.active { color: #fbbf24; }
.star-btn:hover { transform: scale(1.1); }
.rating-text { margin-right: 8px; font-weight: 600; color: #6b7280; }
.form-actions { display: flex; gap: 12px; padding-top: 12px; }
.submit-btn { flex: 1; background: linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%); color: white; padding: 14px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; justify-content: center; }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.cancel-btn { padding: 14px 32px; background: white; border: 2px solid #e5e7eb; color: #6b7280; border-radius: 10px; font-weight: 600; text-decoration: none; display: flex; align-items: center; }
.cancel-btn:hover { background: #f9fafb; color: #374151; }
.spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
</style>
