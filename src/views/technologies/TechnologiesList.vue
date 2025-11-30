<template>
  <div class="technologies-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 class="page-title">إدارة التقنيات</h1>
            <p class="page-subtitle">إدارة لغات البرمجة، أطر العمل، والأدوات المعروضة في الموقع</p>
          </div>
        </div>
        <router-link to="/technologies/create" class="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إضافة تقنية جديدة
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
            placeholder="ابحث باسم التقنية..."
            class="search-input"
          />
        </div>

        <select v-model="selectedCategory" class="filter-select">
          <option value="">كل الفئات</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>

        <div class="results-count">
          <span class="count-number">{{ filteredTechnologies.length }}</span>
          تقنية
        </div>
      </div>
    </div>

    <div v-if="store.loading && !store.technologies.length" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">جاري تحميل التقنيات من قاعدة البيانات...</p>
    </div>

    <div v-else-if="!store.loading && filteredTechnologies.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h3 class="empty-title">لا توجد تقنيات</h3>
      <p class="empty-description">
        {{ searchQuery || selectedCategory ? 'لا توجد نتائج تطابق بحثك.' : 'لم تقم بإضافة أي تقنيات بعد.' }}
      </p>
      <router-link v-if="!searchQuery && !selectedCategory" to="/technologies/create" class="empty-action-btn">
        إضافة أول تقنية
      </router-link>
    </div>

    <div v-else class="technologies-list">
      <div
        v-for="tech in filteredTechnologies"
        :key="tech.id"
        class="tech-card"
        :style="{ borderTopColor: tech.color || 'transparent' }"
      >
        <div class="tech-header">
            <div class="tech-icon" :style="{ background: tech.color || 'linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%)' }">
                <i v-if="tech.iconUrl && !tech.iconUrl.includes('/')" :class="tech.iconUrl" style="font-size: 24px; color: white;"></i>
                <img v-else-if="tech.iconUrl && tech.iconUrl.includes('/')" :src="tech.iconUrl" alt="icon" style="width: 28px; height: 28px; object-fit: contain;" />
                <span v-else class="icon-placeholder">{{ tech.name ? tech.name[0].toUpperCase() : '?' }}</span>
            </div>
            <div class="tech-details">
                <h3 class="tech-name">{{ tech.name }}</h3>
                <p class="tech-category">{{ getCategoryLabel(tech.category) }}</p>
            </div>
        </div>

        <div class="tech-meta">
            <div class="meta-item toggle-wrapper">
                <label class="switch">
                  <input
                    type="checkbox"
                    :checked="tech.isActive"
                    @change="toggleStatus(tech)"
                    :disabled="store.loading"
                  >
                  <span class="slider round"></span>
                </label>
                <span class="status-text" :class="{ active: tech.isActive }">
                  {{ tech.isActive ? 'نشط' : 'غير نشط' }}
                </span>
            </div>
        </div>

        <div class="tech-actions">
          <router-link :to="`/technologies/${tech.id}/edit`" class="action-btn edit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            تعديل
          </router-link>
          <button @click="handleDelete(tech.id)" class="action-btn delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            حذف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTechnologiesStore } from '@/stores/technologies';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ Import
// Store Setup
const store = useTechnologiesStore();

// Filters
const searchQuery = ref('');
const selectedCategory = ref('');

const categories = ref([
    { value: 'Language', label: 'لغة برمجة' },
    { value: 'Framework', label: 'إطار عمل' },
    { value: 'Library', label: 'مكتبة' },
    { value: 'Tool', label: 'أداة' },
    { value: 'Database', label: 'قاعدة بيانات' },
    { value: 'Platform', label: 'منصة' }
]);

const getCategoryLabel = (value) => {
    const cat = categories.value.find(c => c.value === value);
    return cat ? cat.label : value;
};

// Fetch Data on Mount
onMounted(async () => {
  await store.fetchTechnologies();
});

// Computed Filtered List
// src/views/TechnologiesList.vue

// ... الكود السابق

const filteredTechnologies = computed(() => {
  // 1. التأكد من أن البيانات هي مصفوفة فعلاً
  let result = store.technologies;

  // حماية: إذا كانت النتيجة كائن (Wrapper) وليست مصفوفة، نحاول استخراج المصفوفة
  if (result && !Array.isArray(result) && Array.isArray(result.data)) {
      result = result.data;
  } else if (result && !Array.isArray(result) && Array.isArray(result.result)) {
      result = result.result;
  }

  // إذا لم تكن مصفوفة حتى الآن، نعيد مصفوفة فارغة لتجنب الانهيار
  if (!Array.isArray(result)) {
      return [];
  }

  // 2. تصفية القيم الفارغة (null/undefined) قبل أي عملية أخرى
  result = result.filter(t => t !== null && t !== undefined);

  // 3. تطبيق فلاتر البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t =>
      t.name?.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    result = result.filter(t => t.category === selectedCategory.value);
  }

  return result;
});

// Actions
const toggleStatus = async (tech) => {
  // ✅ Check guest before action to prevent UI flip if possible,
  // or rely on catch block to revert
  if (handleGuestAction()) {
      // Revert the checkbox immediately because v-model already changed it
      tech.isActive = !tech.isActive;
      return;
  }

  try {
    await store.toggleActive(tech.id);
  } catch (err) {
    // ✅ Silent return if guest action was blocked (double safety)
    if (err.message === 'GUEST_ACTION_BLOCKED') {
        tech.isActive = !tech.isActive; // Revert
        return;
    }

    alert('حدث خطأ أثناء تغيير الحالة');
    await store.fetchTechnologies();
  }
};

const handleDelete = async (id) => {
  // ✅ Check guest before showing confirm dialog
  if (handleGuestAction()) return;

  if (!confirm('هل أنت متأكد من حذف هذه التقنية؟ سيتم إزالتها من قاعدة البيانات.')) return;

  try {
    await store.deleteTechnology(id);
  } catch (err) {
    // ✅ Silent return
    if (err.message === 'GUEST_ACTION_BLOCKED') return;

    alert('حدث خطأ أثناء الحذف: ' + (err.message || 'خطأ غير معروف'));
  }
};

</script>

<style scoped>
.technologies-container {
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
  background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%);
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
  background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.4);
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
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
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
  border-color: #FF6F61;
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.filter-select {
  padding: 12px 16px;
  padding-left: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  cursor: pointer;
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
}

.count-number {
  font-weight: 700;
  color: #FF6F61;
  font-size: 16px;
}

/* Loading & Empty States */
.loading-state, .empty-state {
  background: white;
  border-radius: 16px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #FF6F61;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #FF6F61 0%, #FF9A8B 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 20px;
  background: #1f2937;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.empty-action-btn:hover {
  background: #374151;
}

/* Technologies List Grid */
.technologies-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.tech-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  border-top: 4px solid transparent; /* For colored border based on tech color */
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.tech-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.tech-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.icon-placeholder {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.tech-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.tech-category {
  font-size: 14px;
  color: #6b7280;
}

.tech-meta {
  margin-bottom: 20px;
}

/* Toggle Switch */
.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
}

.status-text.active {
  color: #059669;
}

/* Actions */
.tech-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  text-decoration: none;
}

.action-btn.edit {
  background: #f3f4f6;
  color: #4b5563;
  border-color: #e5e7eb;
}

.action-btn.edit:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fee2e2;
}

.action-btn.delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .title-wrapper {
    flex-direction: column;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
