<template>
  <div class="create-container">
    <!-- Header Section -->
    <div class="header-section">
      <router-link to="/skills" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        رجوع
      </router-link>
      <div class="header-content">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">إضافة مهارة جديدة</h1>
          <p class="page-subtitle">أضف مهارة جديدة إلى البورتفوليو الخاص بك</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="form-container">
      <!-- Basic Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">معلومات المهارة</h2>
            <p class="section-subtitle">أدخل اسم المهارة وتصنيفها</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label required">اسم المهارة</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="مثال: Vue.js, React, Node.js"
            />
            <p class="form-hint">أدخل اسم المهارة أو التقنية</p>
          </div>

          <div class="form-group full-width">
            <label class="form-label required">التصنيف</label>
            <select v-model="formData.category" required class="form-select">
              <option value="">اختر التصنيف</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="Tools">Tools</option>
              <option value="SoftSkills">Soft Skills</option>
            </select>
            <p class="form-hint">اختر التصنيف المناسب للمهارة</p>
          </div>
        </div>
      </div>

      <!-- Additional Details Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">تفاصيل إضافية</h2>
            <p class="section-subtitle">حدد ترتيب العرض وأيقونة المهارة</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ترتيب العرض</label>
            <input
              v-model.number="formData.displayOrder"
              type="number"
              min="0"
              class="form-input"
              placeholder="0"
            />
            <p class="form-hint">الأقل رقماً يظهر أولاً (0 = الأول)</p>
          </div>

          <div class="form-group">
            <label class="form-label">رابط الأيقونة (اختياري)</label>
            <input
              v-model="formData.iconUrl"
              type="url"
              class="form-input"
              placeholder="https://example.com/icon.png"
              dir="ltr"
            />
            <p class="form-hint">رابط URL للأيقونة إن وجدت</p>
          </div>
        </div>
      </div>

      <!-- Settings Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">الإعدادات</h2>
            <p class="section-subtitle">حدد حالة نشر المهارة</p>
          </div>
        </div>

        <div class="settings-grid">
          <label class="toggle-card">
            <input v-model="formData.isActive" type="checkbox" class="toggle-input" />
            <div class="toggle-content">
              <div class="toggle-icon active">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 class="toggle-title">نشط</h3>
                <p class="toggle-description">ستكون المهارة مرئية للزوار</p>
              </div>
            </div>
            <div class="toggle-switch">
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري الحفظ...' : 'حفظ المهارة' }}
        </button>
        <router-link to="/skills" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useSkillsStore } from '@/stores/skills';
import { useNotification } from '@/composables/useNotification';

const router = useRouter();
const skillsStore = useSkillsStore();
const { success, error } = useNotification();

const loading = ref(false);

const formData = reactive({
  name: '',
  category: '',
  displayOrder: 0,
  iconUrl: '',
  isActive: true,
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    // ✅ إرسال البيانات بالمسميات الصحيحة (PascalCase) للـ API
    await skillsStore.createSkill({
      Name: formData.name,
      Category: formData.category,
      DisplayOrder: formData.displayOrder,
      IconUrl: formData.iconUrl || null, // إرسال null إذا كان فارغاً
    });

    success('تم إضافة المهارة بنجاح');
    router.push('/skills');
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'حدث خطأ أثناء إضافة المهارة';
    error(errorMsg);
    console.error('خطأ في إنشاء المهارة:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Container */
.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Header Section */
.header-section {
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.back-btn:hover {
  color: #1f2937;
  gap: 8px;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-content {
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
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* Form Container */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.section-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-icon.purple {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.section-icon.orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.section-icon svg {
  width: 24px;
  height: 24px;
  color: white;
  stroke-width: 2;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  font-size: 16px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-card:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.toggle-input {
  display: none;
}

.toggle-input:checked + .toggle-content + .toggle-switch .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-input:checked + .toggle-content + .toggle-switch .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.toggle-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toggle-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.toggle-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.toggle-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.toggle-description {
  font-size: 12px;
  color: #6b7280;
}

.toggle-switch {
  width: 52px;
  height: 28px;
  background: #d1d5db;
  border-radius: 14px;
  position: relative;
  transition: all 0.3s;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: white;
  transition: transform 0.3s;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.submit-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn svg {
  width: 20px;
  height: 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.cancel-btn {
  padding: 14px 32px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

/* Responsive */
@media (max-width: 768px) {
  .create-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .form-section {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
