<template>
  <div class="education-form-container">
    <!-- Admin Check -->
    <div v-if="!authStore.isAdmin" class="access-denied">
      <div class="denied-icon">🔒</div>
      <h3>عذراً، هذه الصفحة للمسؤولين فقط</h3>
      <p>أنت في وضع المشاهدة ولا يمكنك إضافة محتوى جديد.</p>
      <button @click="router.push('/education')" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        العودة للقائمة
      </button>
    </div>

    <!-- Admin Form -->
    <div v-else>
      <div class="page-header">
        <div class="header-info">
          <h1 class="page-title">إضافة تعليم جديد</h1>
          <p class="page-subtitle">أضف مؤهل دراسي جديد إلى ملفك الشخصي</p>
        </div>
        <button @click="router.push('/education')" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          عودة
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="education-form">
        <div class="form-grid">
          <!-- Degree -->
          <div class="form-group full-width">
            <label class="form-label required">الدرجة العلمية</label>
            <input
              v-model="formData.degree"
              type="text"
              class="form-input"
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
            />
            <p class="form-hint">اتركه فارغاً إذا كنت لا تزال تدرس</p>
          </div>

          <!-- Description -->
          <div class="form-group full-width">
            <label class="form-label">الوصف</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
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
            type="submit"
            class="btn-primary"
            :disabled="submitting"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-if="!submitting">حفظ</span>
            <span v-else>جاري الحفظ...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useEducationStore } from '@/stores/education';

const router = useRouter();
const authStore = useAuthStore();
const educationStore = useEducationStore();

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

onMounted(() => {
  // إعادة توجيه الـ Guest تلقائياً
  if (!authStore.isAdmin) {
    // يمكن إلغاء التعليق للتوجيه التلقائي
    // router.push('/education');
  }
});


const handleSubmit = async () => {
  // Remove the old manual check if relying on the store/handler
  // if (!authStore.isAdmin) return;

  submitting.value = true;
  try {
    await educationStore.createEducation(formData.value);
    router.push('/education');
  } catch (err) {
    // ✅ Standardized Error Handling
    if (err.message === 'GUEST_ACTION_BLOCKED') return;

    console.error('Error creating education:', err);
    // Optional: showError(err.message);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.education-form-container { padding: 24px; max-width: 900px; margin: 0 auto; }

/* Access Denied */
.access-denied {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-width: 500px;
  margin: 60px auto;
}

.denied-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.access-denied h3 {
  color: #dc2626;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.access-denied p {
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
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

.form-hint { font-size: 12px; color: #6b7280; margin-top: 4px; }

.checkbox-group { flex-direction: row; align-items: center; }
.checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.form-checkbox { width: 18px; height: 18px; cursor: pointer; }

/* Form Actions */
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }

.btn-primary, .btn-secondary {
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
.btn-primary:hover { background: #4338ca; transform: translateY(-2px); }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
.btn-primary svg { width: 18px; height: 18px; }

.btn-secondary { background: #f3f4f6; color: #374151; }
.btn-secondary:hover { background: #e5e7eb; }

/* Responsive */
@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-group.full-width { grid-column: 1; }
  .access-denied { padding: 40px 24px; margin: 40px 20px; }
}
</style>
