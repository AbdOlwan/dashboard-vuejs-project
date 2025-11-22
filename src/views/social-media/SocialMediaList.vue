<template>
  <div class="social-media-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V10.5m-1.5-7.5l4.5 4.5m-4.5-4.5V7.5M19.5 10.5h-4" />
            </svg>
          </div>
          <div>
            <h1 class="page-title">إدارة وسائل التواصل</h1>
            <p class="page-subtitle">إدارة وعرض روابط وسائل التواصل الخاصة بك</p>
          </div>
        </div>
        <router-link to="/social-media/create" class="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إضافة رابط جديد
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
            placeholder="ابحث باسم المنصة..."
            class="search-input"
          />
        </div>
        <div class="results-count">
          <span class="count-number">{{ filteredLinks.length }}</span>
          رابط
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">جاري تحميل البيانات...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchLinks" class="retry-btn">إعادة المحاولة</button>
    </div>

    <div v-else-if="filteredLinks.length > 0" class="social-media-list">
      <div
        v-for="link in filteredLinks"
        :key="link.id"
        class="link-card"
        :class="{ 'inactive-card': !link.isActive }"
      >
        <div class="link-info">
          <div class="platform-icon">
             <i :class="getIconClass(link.platform)" style="font-size: 24px; color: white;"></i>
          </div>
          <div class="link-details">
            <h3 class="platform-name">{{ link.platform }}</h3>
            <a :href="link.profileUrl" target="_blank" class="link-url" dir="ltr">{{ link.profileUrl }}</a>
          </div>
        </div>

        <div class="link-meta">
            <div class="meta-item">
                <span class="meta-label">الترتيب:</span>
                <span class="meta-value">{{ link.displayOrder }}</span>
            </div>

            <button
              @click="toggleActive(link)"
              class="status-toggle"
              :class="{ active: link.isActive }"
              :disabled="actionLoading === link.id"
            >
              <span v-if="actionLoading === link.id" class="small-spinner"></span>
              <span v-else>{{ link.isActive ? 'نشط' : 'غير نشط' }}</span>
            </button>
        </div>

        <div class="link-actions">
          <router-link :to="`/social-media/${link.id}/edit`" class="action-btn edit" title="تعديل">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </router-link>
          <button @click="deleteLink(link.id)" class="action-btn delete" title="حذف" :disabled="actionLoading === link.id">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V10.5m-1.5-7.5l4.5 4.5m-4.5-4.5V7.5M19.5 10.5h-4" />
        </svg>
      </div>
      <h3 class="empty-title">لا توجد روابط تواصل</h3>
      <p class="empty-description">لم تقم بإضافة أي حسابات تواصل اجتماعي بعد.</p>
      <router-link to="/social-media/create" class="empty-action-btn">
        إضافة رابط جديد
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import socialMediaService from '@/services/socialMediaService';

const loading = ref(true);
const error = ref(null);
const links = ref([]);
const searchQuery = ref('');
const actionLoading = ref(null); // Stores ID of item currently being acted upon

// Helper to map Platform names to FontAwesome classes (or generic icon)
const getIconClass = (platform) => {
  const map = {
    'LinkedIn': 'fab fa-linkedin-in',
    'GitHub': 'fab fa-github',
    'Twitter': 'fab fa-twitter', // or fa-x-twitter
    'Facebook': 'fab fa-facebook-f',
    'Instagram': 'fab fa-instagram',
    'Website': 'fas fa-globe',
    'YouTube': 'fab fa-youtube'
  };
  // Returns mapped icon or a generic link icon
  return map[platform] || 'fas fa-link';
};

// Fetch Data
// src/views/SocialMediaList.vue

const fetchLinks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await socialMediaService.getAll();

    // تصحيح: BaseService يعيد المصفوفة جاهزة، لا حاجة لـ .data هنا
    // إذا كان الـ response مصفوفة نستخدمها، وإلا نحاول الوصول لـ .data (للاحتياط)
    if (Array.isArray(response)) {
        links.value = response;
    } else {
        links.value = response.data || [];
    }

  } catch (err) {
    console.error(err);
    error.value = 'حدث خطأ أثناء تحميل البيانات. يرجى التحقق من الاتصال.';
  } finally {
    loading.value = false;
  }
};

// Filter Logic
const filteredLinks = computed(() => {
  let result = links.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(l =>
      (l.platform && l.platform.toLowerCase().includes(query)) ||
      (l.profileUrl && l.profileUrl.toLowerCase().includes(query))
    );
  }
  // Sort by DisplayOrder (ascending)
  return result.sort((a, b) => a.displayOrder - b.displayOrder);
});

// Delete Action
const deleteLink = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذا الرابط نهائياً؟')) return;

  actionLoading.value = id;
  try {
    await socialMediaService.delete(id);
    // Remove from local list on success
    links.value = links.value.filter(l => l.id !== id);
  } catch (err) {
    alert('فشل الحذف: ' + (err.message || 'خطأ غير معروف'));
  } finally {
    actionLoading.value = null;
  }
};

// Toggle Active Action
const toggleActive = async (link) => {
  actionLoading.value = link.id;
  try {
    await socialMediaService.toggleActive(link.id);
    // Update local state
    link.isActive = !link.isActive;
  } catch (err) {
    alert('فشل تغيير الحالة: ' + (err.message || 'خطأ غير معروف'));
  } finally {
    actionLoading.value = null;
  }
};

onMounted(() => {
  fetchLinks();
});
</script>

<style scoped>
/* same styles as before with minor tweaks */
.social-media-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 28px;
  height: 28px;
  color: white;
  stroke-width: 2;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
}

.add-btn svg {
  width: 20px;
  height: 20px;
}

.filter-bar {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #43e97b;
  box-shadow: 0 0 0 3px rgba(67, 233, 123, 0.1);
}

.results-count {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f3f4f6;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

.count-number {
  font-weight: 700;
  color: #43e97b;
  font-size: 16px;
}

/* Loading & Error */
.loading-state, .error-state {
  background: white;
  border-radius: 16px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.error-state {
  color: #ef4444;
}
.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #43e97b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* List Items */
.social-media-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.link-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.link-card.inactive-card {
  opacity: 0.7;
  background: #f9fafb;
}

.link-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 2;
}

.platform-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-details {
    overflow: hidden;
}

.platform-name {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.link-url {
  font-size: 14px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 300px;
  text-decoration: none;
}
.link-url:hover { color: #43e97b; }

.link-meta {
    display: flex;
    align-items: center;
    gap: 32px;
    flex: 1;
    justify-content: flex-end;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-toggle {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
}

.status-toggle.active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-toggle:not(.active) {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}
.status-toggle:hover { filter: brightness(0.95); }

.small-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;
}

/* Actions */
.link-actions {
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  background: #f3f4f6;
}

.action-btn.edit { color: #4f46e5; }
.action-btn.edit:hover { background: #eef2ff; }
.action-btn.delete { color: #ef4444; }
.action-btn.delete:hover { background: #fee2e2; }

/* Empty State */
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: white;
  stroke-width: 2;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content, .filter-bar { flex-direction: column; gap: 16px; align-items: stretch; }
  .link-card { flex-direction: column; align-items: flex-start; }
  .link-meta { width: 100%; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-top: 12px; }
  .link-actions { position: absolute; top: 16px; left: 16px; }
}
</style>
