<template>
  <div class="testimonials-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 class="page-title">آراء العملاء</h1>
            <p class="page-subtitle">إدارة التقييمات ومراجعة آراء العملاء المعلقة</p>
          </div>
        </div>
        <router-link to="/testimonials/create" class="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إضافة رأي جديد
        </router-link>
      </div>

      <div class="filter-bar">
        <div class="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="بحث باسم العميل أو الشركة..."
            class="search-input"
          />
        </div>

        <select v-model="filterStatus" class="filter-select">
          <option value="all">جميع الحالات</option>
          <option value="approved">تمت الموافقة</option>
          <option value="pending">بانتظار الموافقة</option>
        </select>
      </div>
    </div>

    <div v-if="testimonialsStore.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">جاري تحميل الآراء...</p>
    </div>

    <div v-else-if="testimonialsStore.error" class="error-state">
      <p>{{ testimonialsStore.error }}</p>
      <button @click="testimonialsStore.fetchTestimonials()" class="retry-btn">إعادة المحاولة</button>
    </div>

    <div v-else>
      <div v-if="filteredTestimonials.length > 0" class="testimonials-grid">
        <div v-for="item in filteredTestimonials" :key="item.id" class="testimonial-card">
          <div class="card-header">
            <img
              v-if="isValidImage(item.clientImageUrl)"
              :src="item.clientImageUrl"
              alt="Client"
              class="client-avatar"
              @error="(e) => { e.target.onerror = null; e.target.style.display = 'none'; item.clientImageUrl = null; }"
            />

            <div v-else class="client-avatar-placeholder">
              {{ item.clientName ? item.clientName.charAt(0).toUpperCase() : 'U' }}
            </div>

            <div class="client-info">
              <h3 class="client-name">{{ item.clientName }}</h3>
              <p class="client-role">
                {{ item.clientPosition }}
                <span v-if="item.clientCompany"> @ {{ item.clientCompany }}</span>
              </p>
            </div>

            <div class="status-badge" :class="item.isApproved ? 'approved' : 'pending'">
              {{ item.isApproved ? 'منشور' : 'معلق' }}
            </div>
          </div>

          <div class="rating-stars">
            <svg
              v-for="n in 5"
              :key="n"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              :class="n <= item.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

          <div class="card-body">
            <p class="review-text">"{{ truncateText(item.testimonialText) }}"</p>
          </div>

          <div class="card-actions">
            <div class="approval-actions" v-if="!item.isApproved">
               <button @click="handleApprove(item.id)" class="icon-btn approve" title="موافقة ونشر">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>

            <div class="edit-delete-actions">
              <router-link :to="`/testimonials/${item.id}/edit`" class="icon-btn edit" title="تعديل">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </router-link>
              <button @click="handleDelete(item.id)" class="icon-btn delete" title="حذف">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 class="empty-title">لا توجد آراء عملاء</h3>
        <p class="empty-description">لم يتم إضافة أي آراء عملاء حتى الآن.</p>
        <router-link to="/testimonials/create" class="empty-action-btn">
          إضافة أول رأي
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTestimonialsStore } from '@/stores/testimonials';

const testimonialsStore = useTestimonialsStore();
const searchQuery = ref('');
const filterStatus = ref('all');

onMounted(() => {
  testimonialsStore.fetchTestimonials();
});

const filteredTestimonials = computed(() => {
  let items = testimonialsStore.testimonials || [];

  // Filter by Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter(t =>
      (t.clientName && t.clientName.toLowerCase().includes(query)) ||
      (t.clientCompany && t.clientCompany.toLowerCase().includes(query))
    );
  }

  // Filter by Status
  if (filterStatus.value === 'approved') {
    items = items.filter(t => t.isApproved);
  } else if (filterStatus.value === 'pending') {
    items = items.filter(t => !t.isApproved);
  }

  return items;
});

const truncateText = (text) => {
  if (!text) return '';
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
};

// ✅ دالة جديدة للتحقق من صحة الصورة ومنع روابط localhost
const isValidImage = (url) => {
  if (!url) return false;
  // منع عرض الصور إذا كانت تشير إلى السيرفر المحلي أثناء التشغيل على Netlify
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return false;
  }
  return true;
};

const handleApprove = async (id) => {
  if (confirm('هل أنت متأكد من الموافقة على هذا الرأي ونشره؟')) {
    const result = await testimonialsStore.approveTestimonial(id);
    if (result === null) return;
  }
};

const handleDelete = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الرأي نهائياً؟')) {
    const result = await testimonialsStore.deleteTestimonial(id);
    if (result === null) return;
  }
};
</script>

<style scoped>
/* نفس الستايل السابق تماماً */
.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header Styles matching Dashboard */
.header-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.page-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
}

.add-btn svg {
  width: 20px;
  height: 20px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 16px;
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 14px;
}

/* Grid Layout */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
}

.testimonial-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.client-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f3f4f6;
}

.client-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4b5563;
  font-size: 20px;
}

.client-info {
  flex: 1;
}

.client-name {
  font-weight: 700;
  color: #111827;
  font-size: 16px;
}

.client-role {
  font-size: 12px;
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.approved {
  background-color: #d1fae5;
  color: #047857;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.rating-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 12px;
}

.rating-stars svg {
  width: 16px;
  height: 16px;
}

.text-yellow-400 { color: #fbbf24; }
.text-gray-300 { color: #d1d5db; }

.card-body {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  flex: 1;
}

.review-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  font-style: italic;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
}

.approval-actions {
  display: flex;
  gap: 8px;
}

.edit-delete-actions {
  display: flex;
  gap: 8px;
  margin-right: auto; /* Pushes these buttons to the left */
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn.approve {
  color: #10b981;
  background: #ecfdf5;
  border-color: #a7f3d0;
}
.icon-btn.approve:hover { background: #d1fae5; }

.icon-btn.edit {
  color: #6366f1;
  background: #eef2ff;
  border-color: #c7d2fe;
}
.icon-btn.edit:hover { background: #e0e7ff; }

.icon-btn.delete {
  color: #ef4444;
  background: #fef2f2;
  border-color: #fecaca;
}
.icon-btn.delete:hover { background: #fee2e2; }

/* Loading & Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #FF5F6D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #9ca3af;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-description {
  color: #6b7280;
  margin-bottom: 20px;
}

.empty-action-btn {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  .filter-bar {
    flex-direction: column;
  }
  .title-wrapper {
    width: 100%;
  }
  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
