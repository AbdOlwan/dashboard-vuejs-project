<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">الشهادات والاعتمادات</h2>
        <p class="page-subtitle">إدارة الشهادات المهنية والكورسات الموثقة في قاعدة البيانات</p>
      </div>
      <button
        v-if="authStore.isAdmin || authStore.isGuest"
        @click="handleCreateClick"
        class="btn btn-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة شهادة
      </button>
    </div>

    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <div v-else-if="error" class="state-container error">
      <p>{{ error }}</p>
      <button @click="fetchCertifications" class="btn btn-secondary">إعادة المحاولة</button>
    </div>

    <div v-else-if="!certifications || certifications.length === 0" class="state-container empty">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <h3>لا توجد شهادات مضافة</h3>
      <p>لم يتم العثور على أي شهادات في قاعدة البيانات.</p>
      <button v-if="authStore.isAdmin || authStore.isGuest" @click="handleCreateClick" class="btn btn-primary">
        إضافة أول شهادة
      </button>
    </div>

    <div v-else class="grid-container">
      <div v-for="cert in certifications" :key="cert.id" class="card">
        <div class="card-header">
          <div class="icon-wrapper">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div class="header-info">
            <h3 class="cert-name" :title="cert.name">{{ cert.name }}</h3>
            <span class="cert-issuer">{{ cert.issuingOrganization || 'غير محدد' }}</span>
          </div>
          <div class="status-badge" :class="cert.isActive ? 'active' : 'inactive'">
            {{ cert.isActive ? 'نشط' : 'مخفي' }}
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">الإصدار:</span>
            <span class="value">{{ formatDate(cert.issueDate) }}</span>
          </div>
          <div class="info-row" v-if="cert.expiryDate">
            <span class="label">الانتهاء:</span>
            <span class="value">{{ formatDate(cert.expiryDate) }}</span>
          </div>
        </div>

        <div class="card-actions" v-if="authStore.isAdmin || authStore.isGuest">

          <button @click="toggleActive(cert)" class="btn-icon" :title="cert.isActive ? 'إخفاء' : 'تنشيط'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="cert.isActive ? 'text-green' : 'text-gray'">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <router-link :to="`/certifications/${cert.id}/edit`" class="btn btn-sm btn-outline">
            {{ authStore.isGuest ? 'عرض التفاصيل' : 'تعديل' }}
          </router-link>

          <button @click="deleteCert(cert.id)" class="btn btn-sm btn-danger">
            حذف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCertificationsStore } from '@/stores/certifications';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'; // Import router
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';
import { handleGuestAction } from '@/utils/roleHandler'; // Import Role Handler

const store = useCertificationsStore();
const authStore = useAuthStore();
const router = useRouter(); // Init router
const { certifications, loading, error } = storeToRefs(store);

onMounted(() => {
  store.fetchCertifications();
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' });
};

// التعامل مع زر الإضافة
const handleCreateClick = () => {
  // إذا كان ضيفاً، نعرض الرسالة السحرية ونوقف التنفيذ
  if (handleGuestAction()) return;

  // إذا كان أدمن، نذهب للصفحة
  router.push('/certifications/create');
};

// ... existing script setup imports ...

// ... inside script setup ...

const toggleActive = async (cert) => {
  // التحقق السحري للضيف (UI check)
  if (handleGuestAction()) return;

  if (!authStore.isAdmin) return;

  try {
    await store.toggleActive(cert.id);
  } catch (err) {
    // ✅ Silent return if guest action was blocked
    if (err.message === 'GUEST_ACTION_BLOCKED') return;
    Swal.fire('خطأ', 'فشل تحديث الحالة', 'error');
  }
};

const deleteCert = async (id) => {
  // التحقق السحري للضيف (UI check)
  if (handleGuestAction()) return;

  if (!authStore.isAdmin) return;

  const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "لن تتمكن من استرجاع هذه البيانات!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذفها',
    cancelButtonText: 'إلغاء'
  });

  if (result.isConfirmed) {
    try {
      await store.deleteCertification(id);
      Swal.fire('تم الحذف!', 'تم حذف الشهادة بنجاح.', 'success');
    } catch (err) {
      // ✅ Silent return if guest action was blocked
      if (err.message === 'GUEST_ACTION_BLOCKED') return;
      Swal.fire('خطأ!', 'حدث خطأ أثناء الحذف.', 'error');
    }
  }
};
</script>

<style scoped>
/* نفس التنسيقات السابقة تماماً */
.dashboard-page { padding: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 4px 0; }
.page-subtitle { color: #6b7280; font-size: 14px; margin: 0; }
.state-container { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; }
.spinner { width: 40px; height: 40px; border: 3px solid #f3f4f6; border-top-color: #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon { width: 64px; height: 64px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #9ca3af; }
.empty-icon svg { width: 32px; height: 32px; }
.grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
.card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; transition: all 0.3s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.card-header { padding: 16px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 12px; }
.icon-wrapper { width: 42px; height: 42px; background: #e0e7ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4f46e5; flex-shrink: 0; }
.icon-wrapper svg { width: 24px; height: 24px; }
.header-info { flex: 1; overflow: hidden; }
.cert-name { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cert-issuer { font-size: 13px; color: #6b7280; }
.status-badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.inactive { background: #f3f4f6; color: #6b7280; }
.card-body { padding: 16px; flex: 1; }
.info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
.label { color: #6b7280; }
.value { color: #374151; font-weight: 500; }
.card-actions { padding: 12px 16px; background: #f9fafb; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 8px; align-items: center; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-weight: 500; font-size: 14px; border: none; cursor: pointer; text-decoration: none; transition: background 0.2s; }
.btn-sm { padding: 6px 12px; font-size: 12px; }
.btn-primary { background: #4f46e5; color: white; }
.btn-primary:hover { background: #4338ca; }
.btn-secondary { background: #f3f4f6; color: #374151; }
.btn-outline { background: white; border: 1px solid #d1d5db; color: #374151; }
.btn-danger { background: #fee2e2; color: #991b1b; }
.btn-danger:hover { background: #fecaca; }
.btn-icon { background: none; border: none; cursor: pointer; padding: 4px; margin-left: auto; }
.text-green { color: #166534; }
.text-gray { color: #9ca3af; }
.btn-icon svg { width: 20px; height: 20px; }
</style>
