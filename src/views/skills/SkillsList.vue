<template>
  <div class="skills-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 class="page-title">إدارة المهارات</h1>
            <p class="page-subtitle">إدارة وعرض جميع المهارات في البورتفوليو</p>
          </div>
        </div>
        <router-link to="/skills/create" class="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إضافة مهارة جديدة
        </router-link>
      </div>

      <div class="filter-bar">
        <div class="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="ابحث عن مهارة..." class="search-input" />
        </div>
        <select v-model="selectedCategory" class="filter-select">
          <option value="">كل التصنيفات</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="DevOps">DevOps</option>
          <option value="Tools">Tools</option>
          <option value="SoftSkills">Soft Skills</option>
        </select>
        <div class="results-count">
          <span class="count-number">{{ filteredSkills.length }}</span>
          مهارة
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">جاري تحميل المهارات...</p>
    </div>

    <div v-else-if="filteredSkills.length > 0" class="skills-grid">
      <div v-for="skill in filteredSkills" :key="skill.id" class="skill-card">
        <div class="skill-content">
          <div class="skill-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 class="skill-name">{{ skill.name }}</h3>
          <span class="skill-category">{{ skill.category }}</span>

          <div style="margin-top: 10px;">
             <span class="badge" :class="skill.isActive ? 'active' : 'inactive'">
              {{ skill.isActive ? 'نشط' : 'غير نشط' }}
            </span>
          </div>
        </div>

        <div class="skill-actions">
          <router-link :to="`/skills/${skill.id}/edit`" class="action-btn edit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            تعديل
          </router-link>
          <button @click="deleteSkill(skill.id)" class="action-btn delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            حذف
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h3 class="empty-title">لا توجد مهارات</h3>
      <p class="empty-description">ابدأ بإضافة أول مهارة لك في البورتفوليو</p>
      <router-link to="/skills/create" class="empty-action-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        إضافة مهارة جديدة
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia'; // ✅ استيراد storeToRefs
import { useSkillsStore } from '@/stores/skills'; // ✅ استيراد الـ Store
import { useNotification } from '@/composables/useNotification'; // تفعيل التنبيهات

const skillsStore = useSkillsStore();
const { success, error } = useNotification();

// ✅ استخدام البيانات من الـ Store مباشرة
const { skills, loading } = storeToRefs(skillsStore);

const searchQuery = ref('');
const selectedCategory = ref('');

const filteredSkills = computed(() => {
  // ✅ استخدام skills الحقيقية
  let result = skills.value;

  if (searchQuery.value) {
    result = result.filter(s => s.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }

  if (selectedCategory.value) {
    result = result.filter(s => s.category === selectedCategory.value);
  }

  return result;
});

const deleteSkill = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذه المهارة؟')) return;

  try {
    // ✅ استدعاء الحذف الفعلي
    await skillsStore.deleteSkill(id);
    success('تم حذف المهارة بنجاح');
  } catch (err) {
    error('حدث خطأ أثناء الحذف');
    console.error(err);
  }
};

onMounted(() => {
  // ✅ جلب البيانات عند التحميل
  skillsStore.fetchSkills();
});
</script>

<style scoped>
/* نفس الستايل السابق تماماً */
.skills-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
.header-section { background: white; border-radius: 16px; padding: 28px; margin-bottom: 28px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
.header-content { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.title-wrapper { display: flex; align-items: center; gap: 16px; }
.icon-wrapper { width: 56px; height: 56px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-wrapper svg { width: 28px; height: 28px; color: white; stroke-width: 2; }
.page-title { font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: #6b7280; }
.add-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border-radius: 10px; font-weight: 600; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
.add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
.add-btn svg { width: 20px; height: 20px; }
.filter-bar { display: flex; gap: 16px; align-items: center; }
.search-wrapper { flex: 1; position: relative; }
.search-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #9ca3af; }
.search-input { width: 100%; padding: 12px 48px 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: all 0.2s; }
.search-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.filter-select { padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; background: white; cursor: pointer; transition: all 0.2s; }
.filter-select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.results-count { display: flex; align-items: center; gap: 6px; background: #f3f4f6; padding: 12px 20px; border-radius: 10px; font-size: 14px; color: #6b7280; white-space: nowrap; }
.count-number { font-weight: 700; color: #667eea; font-size: 16px; }
.loading-state { background: white; border-radius: 16px; padding: 60px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.loading-spinner { width: 48px; height: 48px; border: 4px solid #f3f4f6; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { color: #6b7280; font-size: 16px; }
.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.skill-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; transition: all 0.3s; display: flex; flex-direction: column; }
.skill-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12); }
.skill-content { padding: 24px; text-align: center; flex: 1; }
.skill-icon { width: 72px; height: 72px; margin: 0 auto 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; }
.skill-icon svg { width: 36px; height: 36px; stroke-width: 2; }
.skill-name { font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px; }
.skill-category { background: #f3f4f6; color: #6b7280; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; white-space: nowrap; display: inline-block; margin-bottom: 16px; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
.badge.active { background: rgba(16, 185, 129, 0.1); color: #059669; }
.badge.inactive { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
.skill-actions { display: flex; gap: 0; border-top: 1px solid #f3f4f6; }
.action-btn { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; background: white; }
.action-btn svg { width: 18px; height: 18px; }
.action-btn.edit { color: #4f46e5; border-bottom-left-radius: 16px; }
.action-btn.edit:hover { background: #eef2ff; }
.action-btn.delete { color: #ef4444; border-left: 1px solid #f3f4f6; border-bottom-right-radius: 16px; }
.action-btn.delete:hover { background: #fee2e2; }
.empty-state { background: white; border-radius: 16px; padding: 80px 40px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
.empty-icon { width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
.empty-icon svg { width: 40px; height: 40px; color: white; stroke-width: 2; }
.empty-title { font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px; }
.empty-description { font-size: 16px; color: #6b7280; margin-bottom: 24px; }
.empty-action-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; border-radius: 10px; font-weight: 600; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
.empty-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
.empty-action-btn svg { width: 20px; height: 20px; }
@media (max-width: 768px) { .skills-container { padding: 16px; } .header-content { flex-direction: column; gap: 16px; align-items: stretch; } .title-wrapper { flex-direction: column; text-align: center; } .page-title { font-size: 22px; } .add-btn { justify-content: center; } .filter-bar { flex-direction: column; } .results-count { justify-content: center; } .skills-grid { grid-template-columns: 1fr; } }
</style>
