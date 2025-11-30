<template>
  <div class="experience-form-container">
    <!-- Banner للـ Guest -->
    <div v-if="authStore.isGuest" class="guest-view-banner">
      <div class="banner-content">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <div>
          <h4>وضع المشاهدة فقط 👀</h4>
          <p>أنت تستعرض التفاصيل في وضع القراءة. التعديل متاح للمسؤولين فقط.</p>
        </div>
      </div>
    </div>

    <div class="header-section">
      <div class="header-content">
        <router-link to="/experiences" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          العودة للخبرات
        </router-link>
        <h1 class="page-title">
          {{ authStore.isGuest ? 'مشاهدة تفاصيل الخبرة' : 'تعديل الخبرة' }}
        </h1>
      </div>
    </div>

    <div v-if="dataLoading" class="loading-container">
      <div class="spinner"></div>
      <p>جاري تحميل بيانات الخبرة...</p>
    </div>

    <div v-else class="form-section">
      <form @submit.prevent="handleSubmit" class="experience-form">
        <div class="form-group">
          <label class="form-label">المسمى الوظيفي <span class="required">*</span></label>
          <input
            type="text"
            v-model="form.position"
            class="form-input"
            :disabled="authStore.isGuest"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">اسم الشركة <span class="required">*</span></label>
          <input
            type="text"
            v-model="form.companyName"
            class="form-input"
            :disabled="authStore.isGuest"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">الموقع <span class="required">*</span></label>
          <input
            type="text"
            v-model="form.location"
            class="form-input"
            :disabled="authStore.isGuest"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">نوع التوظيف <span class="required">*</span></label>
          <select
            v-model="form.employmentType"
            class="form-input"
            :disabled="authStore.isGuest"
            required
          >
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
            <input
              type="month"
              v-model="dates.start"
              class="form-input"
              :disabled="authStore.isGuest"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ النهاية</label>
            <input
              type="month"
              v-model="dates.end"
              class="form-input"
              :disabled="form.isCurrentJob || authStore.isGuest"
            />
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.isCurrentJob"
              class="checkbox-input"
              :disabled="authStore.isGuest"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">أعمل حالياً في هذه الوظيفة</span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">الوصف <span class="required">*</span></label>
          <textarea
            v-model="form.description"
            class="form-textarea"
            rows="5"
            :disabled="authStore.isGuest"
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button
            v-if="!authStore.isGuest"
            type="submit"
            class="submit-btn"
            :disabled="submitting"
          >
            {{ submitting ? 'جاري التحديث...' : 'حفظ التعديلات' }}
          </button>

          <button
            v-if="authStore.isGuest"
            type="button"
            @click="handleGuestSaveAttempt"
            class="submit-btn guest-disabled"
          >
            حفظ التعديلات
          </button>

          <router-link to="/experiences" class="cancel-btn">
            {{ authStore.isGuest ? 'رجوع' : 'إلغاء' }}
          </router-link>

          <button
            v-if="!authStore.isGuest"
            type="button"
            @click="handleDelete"
            class="delete-btn"
          >
            حذف الخبرة
          </button>

          <button
            v-if="authStore.isGuest"
            type="button"
            @click="handleGuestDeleteAttempt"
            class="delete-btn guest-disabled"
          >
            حذف الخبرة
          </button>
        </div>
      </form>

       <div class="preview-section">
        <h3 class="preview-title">معاينة {{ authStore.isGuest ? 'التفاصيل' : 'بعد التعديل' }}</h3>
        <div class="preview-card">
          <div class="card-header">
            <div class="company-logo">
              <span>{{ form.companyName ? form.companyName.charAt(0).toUpperCase() : '?' }}</span>
            </div>
            <span :class="['status-badge', form.isCurrentJob ? 'current' : 'previous']">
              {{ form.isCurrentJob ? 'حالية' : 'سابقة' }}
            </span>
          </div>
          <h3 class="job-title">{{ form.position }}</h3>
          <p class="company-name">{{ form.companyName }}</p>
          <p class="job-location">{{ form.location }}</p>
          <div class="job-duration">
            <span>{{ dates.start }} - {{ form.isCurrentJob ? 'حتى الآن' : dates.end }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExperiencesStore } from '@/stores/experiences';
import { useAuthStore } from '@/stores/auth';
import { handleGuestAction, showViewOnlyMessage } from '@/utils/roleHandler';

const router = useRouter();
const route = useRoute();
const experiencesStore = useExperiencesStore();
const authStore = useAuthStore();

const dataLoading = ref(true);
const submitting = ref(false);

const dates = reactive({ start: '', end: '' });
const form = reactive({
  id: 0,
  position: '',
  companyName: '',
  location: '',
  employmentType: '',
  description: '',
  isCurrentJob: false,
  displayOrder: 0
});

// تحويل صيغة التاريخ من ISO إلى YYYY-MM للـ Input
const isoToMonth = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${year}-${month}`;
};

onMounted(async () => {
  const id = route.params.id;
  try {
    const experience = await experiencesStore.getExperienceById(id);
    if (!experience) throw new Error('الخبرة غير موجودة');

    // تعبئة النموذج
    form.id = experience.id;
    form.position = experience.position;
    form.companyName = experience.companyName;
    form.location = experience.location;
    form.employmentType = experience.employmentType;
    form.description = experience.description;
    form.isCurrentJob = experience.isCurrentJob;
    form.displayOrder = experience.displayOrder;

    // تعبئة التواريخ
    dates.start = isoToMonth(experience.startDate);
    dates.end = isoToMonth(experience.endDate);

    // عرض رسالة للـ Guest
    if (authStore.isGuest) {
      showViewOnlyMessage();
    }

  } catch (error) {
    alert('خطأ في جلب البيانات: ' + error.message);
    router.push('/experiences');
  } finally {
    dataLoading.value = false;
  }
});

// في ExperienceEdit.vue

const handleSubmit = async () => {
  // فحص مبدئي
  if (authStore.isGuest) {
    handleGuestAction();
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      ...form,
      startDate: `${dates.start}-01T00:00:00`,
      endDate: form.isCurrentJob ? null : (dates.end ? `${dates.end}-01T00:00:00` : null)
    };

    await experiencesStore.updateExperience(form.id, payload);
    router.push('/experiences');
  } catch (error) {
    // ✅ تجاهل خطأ الزائر
    if (error.message === 'GUEST_ACTION_BLOCKED') return;

    alert('فشل التحديث: ' + error.message);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async () => {
  if (authStore.isGuest) {
    handleGuestAction();
    return;
  }

  if (confirm('هل أنت متأكد من حذف هذه الخبرة؟')) {
    try {
      await experiencesStore.deleteExperience(form.id);
      router.push('/experiences');
    } catch (error) {
      // ✅ تجاهل خطأ الزائر
      if (error.message === 'GUEST_ACTION_BLOCKED') return;

      alert('فشل الحذف: ' + error.message);
    }
  }
};

const handleGuestSaveAttempt = () => {
  handleGuestAction();
};

const handleGuestDeleteAttempt = () => {
  handleGuestAction();
};
</script>

<style scoped>
.experience-form-container { max-width: 1400px; margin: 0 auto; padding: 20px; }

/* Guest Banner */
.guest-view-banner {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.25);
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
}

.banner-content svg {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  stroke-width: 2;
}

.banner-content h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.banner-content p {
  font-size: 14px;
  opacity: 0.95;
  margin: 0;
}

.header-section { margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 700; color: #1f2937; }
.back-button { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; text-decoration: none; margin-bottom: 10px; transition: color 0.2s; }
.back-button:hover { color: #4facfe; }
.back-button svg { width: 18px; height: 18px; }

.loading-container { text-align: center; padding: 40px; }
.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #4facfe; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.form-section { display: grid; grid-template-columns: 1fr 350px; gap: 32px; }
.experience-form { background: white; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; }
.required { color: #ef4444; }

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus, .form-textarea:focus {
  border-color: #4facfe;
  outline: none;
  box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.2);
}

.form-input:disabled, .form-textarea:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.checkbox-group { margin: 20px 0; }
.checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.checkbox-input { width: 16px; height: 16px; accent-color: #4facfe; }
.checkbox-input:disabled { cursor: not-allowed; opacity: 0.5; }

.form-actions { display: flex; gap: 12px; margin-top: 32px; }

.submit-btn {
  flex: 1;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(.guest-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.submit-btn.guest-disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-btn {
  padding: 12px 24px;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.cancel-btn:hover { background: #e5e7eb; }

.delete-btn {
  padding: 12px 24px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover:not(.guest-disabled) { background: #fee2e2; }

.delete-btn.guest-disabled {
  background: #f9fafb;
  color: #9ca3af;
  border-color: #e5e7eb;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Preview Card */
.preview-section { position: sticky; top: 20px; height: fit-content; }
.preview-title { font-size: 16px; font-weight: 700; color: #6b7280; margin-bottom: 12px; }
.preview-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.company-logo { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status-badge.current { background: #d1fae5; color: #065f46; }
.status-badge.previous { background: #e0e7ff; color: #3730a3; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.job-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.company-name { color: #4facfe; font-weight: 600; margin-bottom: 8px; }
.job-location, .job-duration { color: #6b7280; font-size: 13px; margin-bottom: 8px; }

@media (max-width: 900px) {
  .form-section { grid-template-columns: 1fr; }
  .preview-section { display: none; }
  .form-actions { flex-direction: column; }
  .banner-content { flex-direction: column; text-align: center; }
}
</style>
