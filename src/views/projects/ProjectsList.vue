<template>
  <div class="projects-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
          <div>
            <h1 class="page-title">إدارة المشاريع</h1>
            <p class="page-subtitle">إدارة وعرض جميع المشاريع في البورتفوليو</p>
          </div>
        </div>
        <router-link to="/projects/create" class="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إضافة مشروع جديد
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
            placeholder="ابحث عن مشروع..."
            class="search-input"
          />
        </div>
        <select v-model="selectedType" class="filter-select">
          <option value="">كل الأنواع</option>
          <option value="Web">موقع ويب</option>
          <option value="Mobile">تطبيق موبايل</option>
          <option value="Desktop">تطبيق سطح مكتب</option>
          <option value="API">API</option>
          <option value="Other">أخرى</option>
        </select>
        <div class="results-count">
          <span class="count-number">{{ filteredProjects.length }}</span>
          مشروع
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">جاري تحميل المشاريع...</p>
    </div>

    <div v-else-if="filteredProjects.length > 0" class="projects-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-image">
          <img
            v-if="project.imageUrl"
            :src="project.imageUrl"
            :alt="project.titleAr"
            class="image"
          />
          <div v-else class="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div class="badges">
            <span v-if="project.isFeatured" class="badge featured">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              مميز
            </span>
            <span class="badge" :class="project.isActive ? 'active' : 'inactive'">
              {{ project.isActive ? 'نشط' : 'غير نشط' }}
            </span>
          </div>
        </div>

        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">{{ project.titleAr }}</h3>
            <span class="project-type">{{ getProjectType(project.projectType) }}</span>
          </div>

          <p class="project-description">{{ project.descriptionAr }}</p>

          <div v-if="project.technologies && project.technologies.length" class="technologies">
            <template v-for="(tech, index) in project.technologies" :key="index">
              <span v-if="tech" class="tech-tag">
                {{ tech.name || tech }}
              </span>
            </template>
          </div>

          <div v-if="project.projectUrl || project.githubUrl" class="project-links">
            <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank" class="link-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              معاينة
            </a>
            <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="link-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>

          <div class="project-actions">
            <!-- ✅ زر التعديل - سيفتح الصفحة لكن بدون حفظ فعلي للـ Guest -->
            <router-link :to="`/projects/${project.id}/edit`" class="action-btn edit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              تعديل
            </router-link>

            <!-- ✅ تبديل التمييز - سيعرض رسالة Guest -->
            <button
              @click="toggleFeatured(project.id)"
              class="action-btn"
              :class="project.isFeatured ? 'featured-active' : ''"
              :title="project.isFeatured ? 'إلغاء التمييز' : 'جعله مميزاً'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" :fill="project.isFeatured ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            <!-- ✅ تبديل النشاط - سيعرض رسالة Guest -->
            <button
              @click="toggleActive(project.id)"
              class="action-btn"
              :class="project.isActive ? 'active-toggle' : 'inactive-toggle'"
              :title="project.isActive ? 'إلغاء التفعيل' : 'تفعيل'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            <!-- ✅ زر الحذف - سيعرض رسالة Guest -->
            <button @click="deleteProject(project.id)" class="action-btn delete">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="empty-title">لا توجد مشاريع</h3>
      <p class="empty-description">ابدأ بإضافة أول مشروع لك في البورتفوليو</p>
      <router-link to="/projects/create" class="empty-action-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة مشروع جديد
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { useNotification } from '@/composables/useNotification';

const projectsStore = useProjectsStore();
const { success, error } = useNotification();

const searchQuery = ref('');
const selectedType = ref('');
const loading = computed(() => projectsStore.loading);
const projects = computed(() => projectsStore.projects);

const filteredProjects = computed(() => {
  let result = projects.value;

  if (searchQuery.value) {
    result = result.filter(p =>
      (p.titleAr && p.titleAr.includes(searchQuery.value)) ||
      (p.descriptionAr && p.descriptionAr.includes(searchQuery.value)) ||
      (p.title && p.title.includes(searchQuery.value)) ||
      (p.shortDescription && p.shortDescription.includes(searchQuery.value))
    );
  }

  if (selectedType.value) {
    result = result.filter(p => p.projectType === selectedType.value);
  }

  return result;
});

const getProjectType = (type) => {
  const types = {
    Web: 'موقع ويب',
    Mobile: 'تطبيق موبايل',
    Desktop: 'تطبيق سطح مكتب',
    API: 'API',
    Other: 'أخرى'
  };
  return types[type] || type;
};

// ✅ الدوال ستتعامل مع الصلاحيات داخلياً عبر Store
const toggleFeatured = async (id) => {
  try {
    await projectsStore.toggleFeatured(id);
    success('تم تحديث حالة التمييز بنجاح');
  } catch (err) {
    // ✅ لا نعرض رسالة خطأ إذا كان Guest لأن handleGuestAction عرض رسالة جميلة
    if (err.message !== 'GUEST_ACTION_BLOCKED') {
      error('حدث خطأ أثناء التحديث');
    }
  }
};

const toggleActive = async (id) => {
  try {
    await projectsStore.toggleActive(id);
    success('تم تحديث حالة النشر بنجاح');
  } catch (err) {
    if (err.message !== 'GUEST_ACTION_BLOCKED') {
      error('حدث خطأ أثناء التحديث');
    }
  }
};

const deleteProject = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

  try {
    await projectsStore.deleteProject(id);
    success('تم حذف المشروع بنجاح');
  } catch (err) {
    if (err.message !== 'GUEST_ACTION_BLOCKED') {
      error('حدث خطأ أثناء الحذف');
    }
  }
};

onMounted(() => {
  projectsStore.fetchProjects();
});
</script>

<style scoped>
.projects-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Header Section */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-btn svg {
  width: 20px;
  height: 20px;
}

/* Filter Bar */
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
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  color: #667eea;
  font-size: 16px;
}

/* Loading State */
.loading-state {
  background: white;
  border-radius: 16px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 16px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

/* Project Image */
.project-image {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.project-card:hover .image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.image-placeholder svg {
  width: 64px;
  height: 64px;
  color: rgba(255, 255, 255, 0.5);
  stroke-width: 1.5;
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.badge.featured {
  background: rgba(251, 191, 36, 0.9);
  color: white;
}

.badge.featured svg {
  width: 14px;
  height: 14px;
}

.badge.active {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.badge.inactive {
  background: rgba(107, 114, 128, 0.9);
  color: white;
}

/* Project Content */
.project-content {
  padding: 20px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  margin-bottom: 12px;
}

.project-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
}

.project-type {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.project-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Technologies */
.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tech-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

/* Project Links */
.project-links {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.link-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f9fafb;
  color: #4b5563;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.link-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.link-btn svg {
  width: 16px;
  height: 16px;
}

/* Project Actions */
.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.edit {
  background: #eef2ff;
  color: #4f46e5;
}

.action-btn.edit:hover {
  background: #e0e7ff;
}

.action-btn.featured-active {
  background: #fef3c7;
  color: #f59e0b;
}

.action-btn.featured-active:hover {
  background: #fde68a;
}

.action-btn:not(.edit):not(.delete):not(.featured-active) {
  background: #f3f4f6;
  color: #6b7280;
}

.action-btn:not(.edit):not(.delete):not(.featured-active):hover {
  background: #e5e7eb;
}

.action-btn.active-toggle {
  background: #d1fae5;
  color: #10b981;
}

.action-btn.active-toggle:hover {
  background: #a7f3d0;
}

.action-btn.inactive-toggle {
  background: #f3f4f6;
  color: #9ca3af;
}

.action-btn.delete {
  background: #fee2e2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fecaca;
}

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.empty-action-btn svg {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .projects-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .title-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .page-title {
    font-size: 22px;
  }

  .add-btn {
    justify-content: center;
  }

  .filter-bar {
    flex-direction: column;
  }

  .results-count {
    justify-content: center;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-actions {
    flex-wrap: wrap;
  }

  .action-btn {
    font-size: 0;
    padding: 12px;
  }

  .action-btn svg {
    margin: 0;
  }
}
</style>
