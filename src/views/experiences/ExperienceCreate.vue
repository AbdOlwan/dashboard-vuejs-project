<template>
  <div class="experience-form-container">
    <div class="header-section">
      <div class="header-content">
        <router-link to="/experiences" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          العودة للخبرات
        </router-link>
        <h1 class="page-title">إضافة خبرة جديدة</h1>
      </div>
    </div>

    <div class="form-section">
      <form @submit.prevent="handleSubmit" class="experience-form">
        <div class="form-group">
          <label class="form-label">المسمى الوظيفي <span class="required">*</span></label>
          <input type="text" v-model="form.position" class="form-input" placeholder="مثال: مطور Full Stack" required />
        </div>

        <div class="form-group">
          <label class="form-label">اسم الشركة <span class="required">*</span></label>
          <input type="text" v-model="form.companyName" class="form-input" placeholder="مثال: شركة التقنية" required />
        </div>

        <div class="form-group">
          <label class="form-label">الموقع <span class="required">*</span></label>
          <input type="text" v-model="form.location" class="form-input" placeholder="مثال: القاهرة، مصر" required />
        </div>

        <div class="form-group">
          <label class="form-label">نوع التوظيف <span class="required">*</span></label>
          <select v-model="form.employmentType" class="form-input" required>
            <option value="">اختر نوع التوظيف</option>
            <option value="Full-time">دوام كامل</option>
            <option value="Part-time">دوام جزئي</option>
            <option value="Contract">عقد</option>
            <option value="Freelance">عمل حر</option>
            <option value="Internship">تدريب</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">تاريخ البداية <span class="required">*</span></label>
            <input type="month" v-model="dates.start" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ النهاية</label>
            <input type="month" v-model="dates.end" class="form-input" :disabled="form.isCurrentJob" />
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.isCurrentJob" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">أعمل حالياً في هذه الوظيفة</span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">الوصف <span class="required">*</span></label>
          <textarea v-model="form.description" class="form-textarea" rows="5" placeholder="وصف المهام والمسؤوليات..." required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading">جاري الحفظ...</span>
            <span v-else>حفظ الخبرة</span>
          </button>
          <router-link to="/experiences" class="cancel-btn">إلغاء</router-link>
        </div>
      </form>

      <div class="preview-section">
        <h3 class="preview-title">معاينة مباشرة</h3>
        <div class="preview-card">
          <div class="card-header">
            <div class="company-logo">
              <span>{{ form.companyName ? form.companyName.charAt(0).toUpperCase() : '?' }}</span>
            </div>
            <span :class="['status-badge', form.isCurrentJob ? 'current' : 'previous']">
              {{ form.isCurrentJob ? 'حالية' : 'سابقة' }}
            </span>
          </div>
          <h3 class="job-title">{{ form.position || 'المسمى الوظيفي' }}</h3>
          <p class="company-name">{{ form.companyName || 'اسم الشركة' }}</p>
          <p class="job-location">{{ form.location || 'الموقع' }}</p>
          <div class="job-duration">
            <span>{{ dates.start ? formatDate(dates.start) : 'البداية' }} - {{ form.isCurrentJob ? 'حتى الآن' : (dates.end ? formatDate(dates.end) : 'النهاية') }}</span>
          </div>
          <p class="job-description">{{ form.description || 'الوصف...' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useExperiencesStore } from '@/stores/experiences';

const router = useRouter();
const experiencesStore = useExperiencesStore();
const loading = ref(false);

// حقول مساعدة للتعامل مع input type="month"
const dates = reactive({
  start: '',
  end: ''
});

const form = reactive({
  position: '',
  companyName: '',
  companyLogoUrl: '', // يمكن إضافته مستقبلاً
  location: '',
  employmentType: '',
  description: '',
  isCurrentJob: false,
  displayOrder: 0
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // تجهيز البيانات للـ API (إضافة اليوم الأول من الشهر للتاريخ)
    const payload = {
      ...form,
      startDate: dates.start ? `${dates.start}-01T00:00:00` : null,
      endDate: form.isCurrentJob ? null : (dates.end ? `${dates.end}-01T00:00:00` : null)
    };

    await experiencesStore.createExperience(payload);
    router.push('/experiences');
  } catch (error) {
    alert('فشل الحفظ: ' + error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* نفس التنسيقات الأساسية المستخدمة في الملفات السابقة لتوحيد التصميم */
.experience-form-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
.header-section { margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 700; color: #1f2937; }
.back-button { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; text-decoration: none; margin-bottom: 10px; }
.back-button:hover { color: #4facfe; }
.back-button svg { width: 18px; height: 18px; }

.form-section { display: grid; grid-template-columns: 1fr 350px; gap: 32px; }
.experience-form { background: white; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; }
.required { color: #ef4444; }
.form-input, .form-textarea { width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; transition: border-color 0.2s; }
.form-input:focus,
.form-textarea:focus {
  border-color: #4facfe;
  outline: none;
  box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.2); /* <-- "ring" effect */
  transition: box-shadow 0.18s ease, border-color 0.12s ease;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.checkbox-group { margin: 20px 0; }
.checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.checkbox-input { width: 16px; height: 16px; accent-color: #4facfe; }
.checkbox-text { font-size: 14px; font-weight: 500; color: #374151; }

.form-actions { display: flex; gap: 12px; margin-top: 32px; }
.submit-btn { flex: 1; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.cancel-btn { padding: 12px 24px; background: #f3f4f6; color: #4b5563; border-radius: 8px; text-decoration: none; font-weight: 600; }

/* Preview Card Styling (Matching Dashboard) */
.preview-section { position: sticky; top: 20px; height: fit-content; }
.preview-title { font-size: 16px; font-weight: 700; color: #6b7280; margin-bottom: 12px; }
.preview-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.company-logo { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status-badge.current { background: #d1fae5; color: #065f46; }
.status-badge.previous { background: #e0e7ff; color: #3730a3; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.job-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.company-name { color: #4facfe; font-weight: 600; margin-bottom: 8px; }
.job-location, .job-duration { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
.job-description { font-size: 13px; color: #4b5563; line-height: 1.5; margin-top: 12px; border-top: 1px solid #f3f4f6; padding-top: 12px; }

@media (max-width: 900px) {
  .form-section { grid-template-columns: 1fr; }
  .preview-section { display: none; } /* Hide preview on mobile */
}
</style>
