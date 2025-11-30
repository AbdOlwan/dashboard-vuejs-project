<template>
  <div class="education-form-container">
    <!-- Guest Banner -->
    <div v-if="authStore.isGuest" class="guest-banner">
      <div class="banner-icon">👁️</div>
      <div class="banner-content">
        <h4>وضع المشاهدة فقط</h4>
        <p>أنت تشاهد هذه الصفحة كزائر. جميع الحقول للعرض فقط ولا يمكن تعديلها.</p>
      </div>
    </div>

    <div class="page-header">
      <div class="header-info">
        <h1 class="page-title">
          {{ authStore.isGuest ? 'مشاهدة' : 'تعديل' }} التعليم
        </h1>
        <p class="page-subtitle">
          {{ authStore.isGuest ? 'عرض تفاصيل المؤهل الدراسي' : 'تحديث بيانات المؤهل الدراسي' }}
        </p>
      </div>
      <button @click="router.push('/education')" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        عودة
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="education-form">
      <div class="form-grid">
        <!-- Degree -->
        <div class="form-group full-width">
          <label class="form-label required">الدرجة العلمية</label>
          <input
            v-model="formData.degree"
            type="text"
            class="form-input"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
            placeholder="مثال: بكالوريوس علوم الحاسب"
            required
          />
        </div>

        <!-- Institution Name -->
        <div class="form-group full-width">
          <label class="form-label required">اسم المؤسسة التعليمية</label>
          <input
            v-model="formData.institutionName"
            type="text"
            class="form-input"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
            placeholder="مثال: جامعة القاهرة"
            required
          />
        </div>

        <!-- Field of Study -->
        <div class="form-group">
          <label class="form-label">مجال الدراسة</label>
          <input
            v-model="formData.fieldOfStudy"
            type="text"
            class="form-input"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
            placeholder="مثال: علوم الحاسب"
          />
        </div>

        <!-- Grade -->
        <div class="form-group">
          <label class="form-label">التقدير</label>
          <input
            v-model="formData.grade"
            type="text"
            class="form-input"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
            placeholder="مثال: ممتاز، جيد جداً"
          />
        </div>

        <!-- Start Date -->
        <div class="form-group">
          <label class="form-label required">تاريخ البدء</label>
          <input
            v-model="formData.startDate"
            type="date"
            class="form-input"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
            required
          />
        </div>

        <!-- End Date -->
        <div class="form-group">
          <label class="form-label">تاريخ الانتهاء</label>
          <input
            v-model="formData.endDate"
            type="date"
            class="form-input"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
          />
          <p class="form-hint">اتركه فارغاً إذا كنت لا تزال تدرس</p>
        </div>

        <!-- Description -->
        <div class="form-group full-width">
          <label class="form-label">الوصف</label>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            :class="{ 'read-only': authStore.isGuest }"
            :readonly="authStore.isGuest"
            rows="4"
            placeholder="أضف تفاصيل إضافية عن المؤهل الدراسي..."
          ></textarea>
        </div>

        <!-- Is Active -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="formData.isActive"
              type="checkbox"
              :disabled="authStore.isGuest"
              class="form-checkbox"
            />
            <span>عرض في الصفحة العامة</span>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button
          type="button"
          @click="router.push('/education')"
          class="btn-secondary"
        >
          إلغاء
        </button>
        <button
          v-if="!authStore.isGuest"
          type="submit"
          class="btn-primary"
          :disabled="submitting"
        >
          <span v-if="!submitting">حفظ التغييرات</span>
          <span v-else>جاري الحفظ...</span>
        </button>
        <button
          v-else
          type="button"
          @click="handleGuestSaveAttempt"
          class="btn-guest"
        >
          <span>💾</span>
          محاولة الحفظ
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useEducationStore } from '@/stores/education';
import { handleGuestAction, showViewOnlyMessage } from '@/utils/roleHandler';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const educationStore = useEducationStore();

const loading = ref(true);
const submitting = ref(false);
const formData = ref({
  degree: '',
  institutionName: '',
  fieldOfStudy: '',
  grade: '',
  startDate: '',
  endDate: '',
  description: '',
  isActive: true
});

onMounted(async () => {
  // عرض رسالة للـ Guest عند دخول الصفحة
  if (authStore.isGuest) {
    showViewOnlyMessage();
  }

  // جلب البيانات
  try {
    const educationId = parseInt(route.params.id);
    const education = await educationStore.education.find(e => e.id === educationId);

    if (education) {
      formData.value = { ...education };
    } else {
      // جلب من API إذا لم يكن موجوداً في Store
      const data = await educationStore.fetchEducation();
      const item = data.find(e => e.id === educationId);
      if (item) formData.value = { ...item };
    }
  } catch (error) {
    console.error('Error loading education:', error);
  } finally {
    loading.value = false;
  }
});

// ... existing imports

const handleSubmit = async () => {
  // We can keep this UI check for better UX, or rely on the try/catch
  if (handleGuestAction()) return;

  submitting.value = true;
  try {
    const educationId = parseInt(route.params.id);
    await educationStore.updateEducation(educationId, formData.value);
    router.push('/education');
  } catch (err) {
    // ✅ Standardized Error Handling
    if (err.message === 'GUEST_ACTION_BLOCKED') return;

    console.error('Error updating education:', err);
  } finally {
    submitting.value = false;
  }
};

const handleGuestSaveAttempt = () => {
  handleGuestAction();
};
</script>

<style scoped>
.education-form-container { padding: 24px; max-width: 900px; margin: 0 auto; }

/* Guest Banner */
.guest-banner {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border: 2px solid #c084fc;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: fadeInDown 0.5s ease;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.banner-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.banner-content h4 {
  color: #7c3aed;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.banner-content p {
  color: #6b21a8;
  font-size: 14px;
  margin: 0;
}

/* Page Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.page-subtitle { color: #6b7280; font-size: 14px; margin: 0; }

.btn-back {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back:hover { background: #f9fafb; }
.btn-back svg { width: 20px; height: 20px; }

/* Loading */
.loading-state { text-align: center; padding: 60px 20px; }
.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #4f46e5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Form */
.education-form { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.form-group { display: flex; flex-direction: column; }
.form-group.full-width { grid-column: 1 / -1; }

.form-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.form-label.required::after { content: ' *'; color: #ef4444; }

.form-input, .form-textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}
.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Read-only styling for Guest */
.form-input.read-only, .form-textarea.read-only {
  background: #f9fafb;
  color: #6b7280;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.form-hint { font-size: 12px; color: #6b7280; margin-top: 4px; }

.checkbox-group { flex-direction: row; align-items: center; }
.checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.form-checkbox { width: 18px; height: 18px; cursor: pointer; }
.form-checkbox:disabled { cursor: not-allowed; opacity: 0.5; }

/* Form Actions */
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }

.btn-primary, .btn-secondary, .btn-guest {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary { background: #4f46e5; color: white; }
.btn-primary:hover { background: #4338ca; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }

.btn-secondary { background: #f3f4f6; color: #374151; }
.btn-secondary:hover { background: #e5e7eb; }

.btn-guest {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}
.btn-guest:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-group.full-width { grid-column: 1; }
}
</style>
