<template>
  <div class="experiences-container">
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">إدارة الخبرات العملية</h1>
        <p class="page-subtitle">قم بإضافة وإدارة خبراتك العملية والوظيفية</p>
      </div>
      <button @click="handleAddClick" class="add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة خبرة جديدة
      </button>
    </div>

    <div v-if="experiencesStore.loading && experiencesStore.experiences.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <div v-else-if="experiencesStore.experiences.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3>لا توجد خبرات مضافة</h3>
      <p>لم تقم بإضافة أي خبرات عملية بعد. ابدأ بإضافة خبرتك الأولى.</p>
      <button @click="handleAddClick" class="empty-btn">
        إضافة خبرة جديدة
      </button>
    </div>

    <div v-else>
      <div class="stats-overview">
        <div class="stat-box">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-number">{{ experiencesStore.experiences.length }}</p>
            <p class="stat-label">إجمالي الخبرات</p>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-number">{{ experiencesStore.currentExperiences.length }}</p>
            <p class="stat-label">خبرات حالية</p>
          </div>
        </div>
      </div>

      <div class="experiences-grid">
        <div v-for="exp in experiencesStore.sortedExperiences" :key="exp.id" class="experience-card">
          <div class="card-header">
            <div class="company-logo">
              <span v-if="!exp.companyLogoUrl" class="logo-text">{{ exp.companyName.charAt(0).toUpperCase() }}</span>
              <img v-else :src="exp.companyLogoUrl" :alt="exp.companyName" class="logo-img" />
            </div>
            <span :class="['status-badge', exp.isCurrentJob ? 'current' : 'previous']">
              {{ exp.isCurrentJob ? 'حالية' : 'سابقة' }}
            </span>
          </div>

          <h3 class="job-title">{{ exp.position }}</h3>
          <p class="company-name">{{ exp.companyName }}</p>

          <div class="job-details">
             <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{{ exp.location }}</span>
             </div>
             <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(exp.startDate) }} - {{ exp.isCurrentJob ? 'حتى الآن' : formatDate(exp.endDate) }}</span>
             </div>
          </div>

          <div class="card-actions">
            <button @click="handleEditClick(exp.id)" class="action-btn edit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ authStore.isGuest ? 'مشاهدة' : 'تعديل' }}
            </button>
            <button @click="handleDelete(exp.id)" class="action-btn delete">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useExperiencesStore } from '@/stores/experiences';
import { useAuthStore } from '@/stores/auth';
import { handleGuestAction } from '@/utils/roleHandler';

const router = useRouter();
const experiencesStore = useExperiencesStore();
const authStore = useAuthStore();

onMounted(() => {
  experiencesStore.fetchExperiences();
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
};

const handleAddClick = () => {
  if (handleGuestAction()) return; // إذا كان Guest، سيظهر الرسالة ويتوقف
  router.push('/experiences/create');
};

const handleEditClick = (id) => {
  // السماح بالدخول للجميع، لكن الصفحة ستكون للمشاهدة فقط للـ Guest
  router.push(`/experiences/${id}/edit`);
};

// في ExperiencesList.vue

const handleDelete = async (id) => {
  // هذا الفحص المبدئي ممتاز، وسيبقى كخط دفاع أول
  if (handleGuestAction()) return;

  if (confirm('هل أنت متأكد من رغبتك في حذف هذه الخبرة؟ لا يمكن التراجع عن هذا الإجراء.')) {
    try {
      await experiencesStore.deleteExperience(id);
    } catch (error) {
      // ✅ خط الدفاع الثاني: تجاهل الخطأ القادم من الـ Store
      if (error.message === 'GUEST_ACTION_BLOCKED') return;

      alert('حدث خطأ أثناء الحذف: ' + error);
    }
  }
};
</script>

<style scoped>
.experiences-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Header & Gradient similar to Dashboard */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
}

.header-content { flex: 1; }

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-subtitle { font-size: 16px; opacity: 0.9; }

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #4facfe;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.add-btn svg { width: 20px; height: 20px; }

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
  border-top: 4px solid #4facfe;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.empty-icon svg { width: 40px; height: 40px; color: #9ca3af; }

.empty-btn {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  background: #4facfe;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

/* Stats */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.stat-box:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.stat-icon svg { width: 28px; height: 28px; color: white; stroke-width: 2; }

.stat-number { font-size: 32px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.stat-label { font-size: 14px; color: #6b7280; }

/* Grid Cards */
.experiences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.experience-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.experience-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.company-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-text { color: white; font-size: 20px; font-weight: bold; }
.logo-img { width: 100%; height: 100%; object-fit: cover; }

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.current { background: #d1fae5; color: #065f46; }
.status-badge.previous { background: #e0e7ff; color: #3730a3; }

.job-title { font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.company-name { font-size: 16px; color: #4facfe; font-weight: 600; margin-bottom: 12px; }

.job-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.detail-item svg { width: 16px; height: 16px; }

.card-actions {
  display: flex;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.action-btn svg { width: 18px; height: 18px; }

.action-btn.edit { background: #eff6ff; color: #2563eb; }
.action-btn.edit:hover { background: #dbeafe; }

.action-btn.delete { background: #fef2f2; color: #dc2626; }
.action-btn.delete:hover { background: #fee2e2; }

@media (max-width: 768px) {
  .header-section { flex-direction: column; text-align: center; gap: 20px; }
  .stats-overview { grid-template-columns: 1fr; }
  .experiences-grid { grid-template-columns: 1fr; }
}
</style>
