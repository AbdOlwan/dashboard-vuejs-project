<template>
  <div class="education-form-container">
    <div class="page-header">
      <button @click="router.back()" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        رجوع
      </button>
      <h1 class="page-title">تعديل بيانات التعليم</h1>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <div v-else class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">اسم المؤسسة التعليمية <span class="required">*</span></label>
            <input
              v-model="formData.institutionName"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">الدرجة العلمية <span class="required">*</span></label>
            <input
              v-model="formData.degree"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">مجال الدراسة</label>
            <input
              v-model="formData.fieldOfStudy"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ البدء <span class="required">*</span></label>
            <input
              v-model="formData.startDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ التخرج</label>
            <div class="date-input-wrapper">
              <input
                v-model="formData.endDate"
                type="date"
                class="form-input"
                :disabled="isCurrent"
              />
              <label class="checkbox-label">
                <input type="checkbox" v-model="isCurrent" @change="handleCurrentChange" />
                <span>أدرس هنا حالياً</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">التقدير / المعدل</label>
            <input
              v-model="formData.grade"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">ترتيب العرض</label>
            <input
              v-model.number="formData.displayOrder"
              type="number"
              class="form-input"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label">الوصف وتفاصيل أخرى</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="router.back()" class="btn-secondary">إلغاء</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'جاري التحديث...' : 'حفظ التعديلات' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEducationStore } from '@/stores/education';
import educationService from '@/services/educationService';

const router = useRouter();
const route = useRoute();
const educationStore = useEducationStore();

const isLoading = ref(true);
const isSubmitting = ref(false);
const isCurrent = ref(false);
const educationId = route.params.id;

const formData = ref({
  id: null,
  institutionName: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: null,
  grade: '',
  description: '',
  institutionLogoUrl: '',
  displayOrder: 0
});

onMounted(async () => {
  try {
    // التصحيح هنا: استخدام getById بدلاً من axios المباشر
    const response = await educationService.getById(educationId);

    // حسب هيكلة BaseService غالباً البيانات تكون في response.data مباشرة إذا كان يرجع الـ body
    // أو response.data.data إذا كان يرجع الـ axios response
    // الكود التالي يتعامل مع الاحتمالين بأمان
    const data = response.data || response;

    formData.value = {
      id: data.id,
      institutionName: data.institutionName,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: data.startDate ? data.startDate.split('T')[0] : '',
      endDate: data.endDate ? data.endDate.split('T')[0] : null,
      grade: data.grade,
      description: data.description,
      institutionLogoUrl: data.institutionLogoUrl,
      displayOrder: data.displayOrder
    };

    isCurrent.value = !data.endDate;

  } catch (error) {
    console.error('Error fetching education:', error);
    // alert('فشل تحميل البيانات'); // يمكن تفعيلها إذا أردت تنبيهاً
  } finally {
    isLoading.value = false;
  }
});

const handleCurrentChange = () => {
  if (isCurrent.value) {
    formData.value.endDate = null;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (isCurrent.value) formData.value.endDate = null;

    await educationStore.updateEducation(educationId, formData.value);
    router.push('/education');
  } catch (error) {
    console.error('Failed to update education:', error);
    alert('حدث خطأ أثناء تحديث البيانات');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* نفس التنسيقات السابقة */
.education-form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-family: inherit;
}

.back-btn:hover {
  background: #f9fafb;
  color: #1f2937;
}

.back-btn svg {
  width: 18px;
  height: 18px;
  transform: rotate(180deg);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-input, .form-textarea {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.date-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
