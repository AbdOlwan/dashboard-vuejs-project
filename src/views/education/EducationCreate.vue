<template>
  <div class="education-form-container">
    <div class="page-header">
      <button @click="router.back()" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        رجوع
      </button>
      <h1 class="page-title">إضافة تعليم جديد</h1>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">اسم المؤسسة التعليمية <span class="required">*</span></label>
            <input
              v-model="formData.institutionName"
              type="text"
              class="form-input"
              placeholder="مثال: جامعة القاهرة"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">الدرجة العلمية <span class="required">*</span></label>
            <input
              v-model="formData.degree"
              type="text"
              class="form-input"
              placeholder="مثال: بكالوريوس، ماجستير"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">مجال الدراسة</label>
            <input
              v-model="formData.fieldOfStudy"
              type="text"
              class="form-input"
              placeholder="مثال: علوم الحاسب"
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
              placeholder="مثال: جيد جداً، 3.5 GPA"
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
              placeholder="أضف أي تفاصيل إضافية حول دراستك..."
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="router.back()" class="btn-secondary">إلغاء</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'جاري الحفظ...' : 'حفظ التعليم' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEducationStore } from '@/stores/education';

const router = useRouter();
const educationStore = useEducationStore();

const isSubmitting = ref(false);
const isCurrent = ref(false);

const formData = ref({
  institutionName: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: null,
  grade: '',
  description: '',
  institutionLogoUrl: '', // Included as per DTO but kept hidden or optional
  displayOrder: 0
});

const handleCurrentChange = () => {
  if (isCurrent.value) {
    formData.value.endDate = null;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Ensure endDate is null if currently studying
    if (isCurrent.value) formData.value.endDate = null;

    await educationStore.createEducation(formData.value);
    router.push('/education');
  } catch (error) {
    console.error('Failed to create education:', error);
    alert('حدث خطأ أثناء حفظ البيانات');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
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
  transform: rotate(180deg); /* For RTL */
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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
