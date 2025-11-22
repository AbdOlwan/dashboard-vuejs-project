<template>
  <div class="form-wrapper">
    <div v-if="pageLoading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else class="form-container">
      <div class="form-header">
        <div>
          <h2 class="title">تعديل الشهادة</h2>
          <p class="subtitle">تعديل بيانات: {{ form.name }}</p>
        </div>
        <router-link to="/certifications" class="btn btn-secondary">إلغاء</router-link>
      </div>

      <form @submit.prevent="handleSubmit" class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label class="label required">اسم الشهادة</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div class="form-group">
            <label class="label required">الجهة المانحة</label>
            <input v-model="form.issuingOrganization" type="text" class="input" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="label required">تاريخ الإصدار</label>
            <input v-model="form.issueDate" type="date" class="input" required />
          </div>
          <div class="form-group">
            <label class="label">تاريخ الانتهاء</label>
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

        <div class="form-group checkbox-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.isActive">
            <span class="checkmark"></span>
            نشط (ظاهر في الموقع)
          </label>
        </div>

        <div class="form-group">
          <label class="label">رابط الشهادة (URL)</label>
          <input v-model="form.certificateUrl" type="url" class="input ltr" />
        </div>

        <div class="form-group">
          <label class="label">رابط الشارة (Badge URL)</label>
          <input v-model="form.badgeUrl" type="url" class="input ltr" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'جاري الحفظ...' : 'حفظ التعديلات' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useCertificationsStore } from '@/stores/certifications';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const store = useCertificationsStore();
const route = useRoute();
const router = useRouter();

const pageLoading = ref(true);
const saving = ref(false);

const form = reactive({
  name: '',
  issuingOrganization: '',
  issueDate: '',
  expiryDate: null,
  credentialId: '',
  certificateUrl: '',
  badgeUrl: '',
  displayOrder: 0,
  isActive: true
});

// تحويل التاريخ من ISO String إلى YYYY-MM-DD
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

onMounted(async () => {
  const id = route.params.id;
  try {
    // محاولة العثور على الشهادة في الستور أولاً
    let cert = store.certifications.find(c => c.id == id);

    // إذا لم تكن موجودة (تم عمل ريفريش للصفحة)، جلبها من API
    if (!cert) {
      await store.fetchCertifications();
      cert = store.certifications.find(c => c.id == id);
    }

    if (cert) {
      form.name = cert.name;
      form.issuingOrganization = cert.issuingOrganization;
      form.issueDate = formatDateForInput(cert.issueDate);
      form.expiryDate = cert.expiryDate ? formatDateForInput(cert.expiryDate) : null;
      form.credentialId = cert.credentialId;
      form.certificateUrl = cert.certificateUrl;
      form.badgeUrl = cert.badgeUrl;
      form.displayOrder = cert.displayOrder;
      form.isActive = cert.isActive;
    } else {
      Swal.fire('خطأ', 'لم يتم العثور على الشهادة', 'error');
      router.push('/certifications');
    }
  } catch (error) {
    console.error(error);
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  saving.value = true;
  try {
    const id = route.params.id;
    await store.updateCertification(id, {
      ...form,
      expiryDate: form.expiryDate || null
    });

    Swal.fire('تم', 'تم تحديث الشهادة بنجاح', 'success');
    router.push('/certifications');
  } catch (error) {
    Swal.fire('خطأ', error.response?.data?.message || 'فشل التحديث', 'error');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* نفس تنسيقات Create لضمان التناسق */
.form-wrapper { padding: 24px; display: flex; justify-content: center; }
.form-container { width: 100%; max-width: 800px; }
.form-header { display: flex; justify-content: space-between; margin-bottom: 24px; align-items: center; }
.title { font-size: 22px; font-weight: 700; margin: 0; }
.subtitle { color: #6b7280; font-size: 14px; margin: 4px 0 0 0; }
.form-card { background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.form-group { margin-bottom: 20px; }
.label { display: block; font-weight: 500; margin-bottom: 8px; font-size: 14px; }
.label.required::after { content: "*"; color: #dc2626; margin-right: 4px; }
.input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; }
.input:focus { border-color: #4f46e5; outline: none; }
.ltr { direction: ltr; text-align: left; }
.form-actions { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px; display: flex; justify-content: flex-end; }
.btn { padding: 10px 24px; border-radius: 8px; cursor: pointer; border: none; font-weight: 500; text-decoration: none; }
.btn-primary { background: #4f46e5; color: white; }
.btn-secondary { background: white; border: 1px solid #d1d5db; color: #374151; }

/* Loading Spinner */
.loading-container { display: flex; justify-content: center; padding: 50px; }
.spinner { width: 40px; height: 40px; border: 3px solid #f3f4f6; border-top-color: #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Checkbox Style */
.checkbox-group { display: flex; align-items: center; }
.checkbox-container { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; font-size: 14px; }
.checkbox-container input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkmark { height: 20px; width: 20px; background-color: #eee; border-radius: 4px; position: relative; }
.checkbox-container:hover input ~ .checkmark { background-color: #ccc; }
.checkbox-container input:checked ~ .checkmark { background-color: #4f46e5; }
.checkmark:after { content: ""; position: absolute; display: none; }
.checkbox-container input:checked ~ .checkmark:after { display: block; }
.checkbox-container .checkmark:after { left: 7px; top: 3px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }

@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>
