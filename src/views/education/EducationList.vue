<template>
  <div class="education-list-container">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">إدارة التعليم</h1>
        <p class="page-subtitle">عرض وإدارة المؤهلات العلمية والشهادات الأكاديمية</p>
      </div>
      <router-link to="/education/create" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة تعليم
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <div v-else-if="educationList.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3>لا توجد مؤهلات تعليمية</h3>
      <p>لم تقم بإضافة أي مؤهلات دراسية بعد.</p>
      <router-link to="/education/create" class="btn-primary mt-4">
        إضافة أول مؤهل
      </router-link>
    </div>

    <div v-else class="education-grid">
      <div v-for="edu in educationList" :key="edu.id" class="education-card">
        <div class="card-header">
          <div class="degree-info">
            <h3 class="degree-title">{{ edu.degree }}</h3>
            <span class="institution-name">{{ edu.institutionName }}</span>
          </div>
          <div class="card-actions">
            <router-link :to="`/education/${edu.id}/edit`" class="action-btn edit" title="تعديل">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </router-link>
            <button @click="confirmDelete(edu)" class="action-btn delete" title="حذف">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">المجال:</span>
            <span class="value">{{ edu.fieldOfStudy || 'غير محدد' }}</span>
          </div>
          <div class="info-row">
            <span class="label">الفترة:</span>
            <span class="value period">
              {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'حتى الآن' }}
            </span>
          </div>
          <div class="info-row" v-if="edu.grade">
            <span class="label">التقدير:</span>
            <span class="value badge">{{ edu.grade }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-icon warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>تأكيد الحذف</h3>
        <p>هل أنت متأكد من رغبتك في حذف <strong>{{ itemToDelete?.degree }}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeDeleteModal">إلغاء</button>
          <button class="btn-danger" @click="handleDelete">حذف</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useEducationStore } from '@/stores/education';

const educationStore = useEducationStore();
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const loading = computed(() => educationStore.loading);
const educationList = computed(() => educationStore.education);

onMounted(async () => {
  await educationStore.fetchEducation();
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'short' }).format(date);
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const handleDelete = async () => {
  if (itemToDelete.value) {
    await educationStore.deleteEducation(itemToDelete.value.id);
    closeDeleteModal();
  }
};
</script>

<style scoped>
.education-list-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 4px;
}

/* Buttons */
.btn-primary {
  background: #4f46e5;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-danger {
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* Loading & Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

.empty-icon svg {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

/* Grid */
.education-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.education-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.education-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.degree-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.institution-name {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.edit {
  background: #e0e7ff;
  color: #4f46e5;
}

.action-btn.edit:hover {
  background: #c7d2fe;
}

.action-btn.delete {
  background: #fee2e2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fecaca;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #6b7280;
}

.value {
  color: #1f2937;
  font-weight: 500;
}

.value.badge {
  background: #ecfdf5;
  color: #059669;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.modal-icon.warning {
  color: #d97706;
  background: #fef3c7;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-icon svg {
  width: 24px;
  height: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}
</style>
