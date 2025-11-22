<template>
  <div class="form-wrapper">
    <div class="form-container">
      <div class="form-header">
        <div>
          <h2 class="title">إضافة شهادة جديدة</h2>
          <p class="subtitle">أضف تفاصيل الشهادة إلى قاعدة البيانات</p>
        </div>
        <router-link to="/certifications" class="btn btn-secondary">إلغاء</router-link>
      </div>

      <form @submit.prevent="handleSubmit" class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label class="label required">اسم الشهادة</label>
            <input v-model="form.name" type="text" class="input" required placeholder="مثال: شهادة إدارة المشاريع PMP" />
          </div>
          <div class="form-group">
            <label class="label required">الجهة المانحة</label>
            <input v-model="form.issuingOrganization" type="text" class="input" required placeholder="مثال: PMI, Google, Coursera" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="label required">تاريخ الإصدار</label>
            <input v-model="form.issueDate" type="date" class="input" required />
          </div>
          <div class="form-group">
            <label class="label">تاريخ الانتهاء (اختياري)</label>
            <input v-model="form.expiryDate" type="date" class="input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="label">رقم الاعتماد (Credential ID)</label>
            <input v-model="form.credentialId" type="text" class="input" />
          </div>
          <div class="form-group">
            <label class="label">ترتيب العرض</label>
            <input v-model.number="form.displayOrder" type="number" class="input" />
          </div>
        </div>

        <div class="form-group">
          <label class="label">رابط الشهادة (URL)</label>
          <input v-model="form.certificateUrl" type="url" class="input ltr" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label class="label">رابط الشارة (Badge URL)</label>
          <input v-model="form.badgeUrl" type="url" class="input ltr" placeholder="https://..." />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'جاري الحفظ...' : 'حفظ البيانات' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useCertificationsStore } from '@/stores/certifications';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const store = useCertificationsStore();
const router = useRouter();
const loading = ref(false);

// الحقول مطابقة تماماً لـ C# Create DTO
const form = reactive({
  name: '',
  issuingOrganization: '',
  issueDate: '',
  expiryDate: null,
  credentialId: '',
  certificateUrl: '',
  badgeUrl: '',
  displayOrder: 0
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    // إرسال البيانات للـ Store
    await store.createCertification({
      ...form,
      expiryDate: form.expiryDate || null // تحويل النص الفارغ إلى null
    });

    Swal.fire('نجاح', 'تمت إضافة الشهادة بنجاح', 'success');
    router.push('/certifications');
  } catch (error) {
    Swal.fire('خطأ', error.response?.data?.message || 'حدث خطأ أثناء الحفظ', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-wrapper { padding: 24px; display: flex; justify-content: center; }
.form-container { width: 100%; max-width: 800px; }
.form-header { display: flex; justify-content: space-between; margin-bottom: 24px; align-items: center; }
.title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.subtitle { color: #6b7280; font-size: 14px; margin: 4px 0 0 0; }

.form-card { background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.form-group { margin-bottom: 20px; }
.label { display: block; font-weight: 500; margin-bottom: 8px; color: #374151; font-size: 14px; }
.label.required::after { content: "*"; color: #dc2626; margin-right: 4px; }
.input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
.input:focus { border-color: #4f46e5; outline: none; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.ltr { direction: ltr; text-align: left; }

.form-actions { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; }
.btn { padding: 10px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; text-decoration: none; font-size: 14px; }
.btn-primary { background: #4f46e5; color: white; }
.btn-primary:hover { background: #4338ca; }
.btn-secondary { background: white; border: 1px solid #d1d5db; color: #374151; }
.btn-secondary:hover { background: #f9fafb; }

@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>
