<template>
  <div class="create-container">
    <div class="header-section">
      <router-link to="/" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        رجوع للرئيسية
      </router-link>
      <div class="header-content">
        <div class="icon-wrapper settings-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">إعدادات الموقع</h1>
          <p class="page-subtitle">إدارة الإعدادات العامة للبورتفوليو</p>
        </div>
      </div>
    </div>

    <!-- ✅ رسالة تحذيرية للـ Guest -->
    <div v-if="authStore.isGuest" class="warning-banner">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="warning-icon">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <strong>وضع المشاهدة فقط</strong>
        <p>أنت تتصفح الإعدادات في وضع القراءة فقط. لا يمكنك إجراء أي تعديلات.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">المعلومات العامة</h2>
            <p class="section-subtitle">إعدادات اسم الموقع والوصف لمحركات البحث (SEO)</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label required">اسم الموقع</label>
            <input
              v-model="formData.siteName"
              type="text"
              required
              class="form-input"
              placeholder="البورتفوليو الخاص بـ..."
              :disabled="authStore.isGuest"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label">الوصف التعريفي (SEO)</label>
            <textarea
              v-model="formData.siteDescription"
              rows="4"
              class="form-textarea"
              placeholder="اكتب وصفاً جذاباً للموقع لجذب الزوار..."
              :disabled="authStore.isGuest"
            ></textarea>
            <div class="char-count">{{ formData.siteDescription.length }} حرف</div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">التواصل والملفات</h2>
            <p class="section-subtitle">إدارة بريد التواصل وملف السيرة الذاتية</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بريد التواصل</label>
            <input
              v-model="formData.contactEmail"
              type="email"
              class="form-input"
              placeholder="example@email.com"
              dir="ltr"
              :disabled="authStore.isGuest"
            />
            <p class="form-hint">البريد الذي ستستقبل عليه رسائل الزوار</p>
          </div>

          <div class="form-group">
            <label class="form-label">ملف السيرة الذاتية (PDF)</label>
            <input
              type="file"
              @change="handleCvUpload"
              class="form-input file-input"
              accept="application/pdf"
              :disabled="authStore.isGuest"
            />
            <p class="form-hint">سيتم عرض رابط تحميل لهذا الملف في الموقع</p>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">إعدادات النظام</h2>
            <p class="section-subtitle">إعدادات متقدمة مثل وضع الصيانة</p>
          </div>
        </div>

        <div class="settings-grid">
          <label class="toggle-card" :class="{ disabled: authStore.isGuest }">
            <input
              v-model="formData.maintenanceMode"
              type="checkbox"
              class="toggle-input"
              :disabled="authStore.isGuest"
            />
            <div class="toggle-content">
              <div class="toggle-icon maintenance">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 class="toggle-title">وضع الصيانة</h3>
                <p class="toggle-description">سيتم عرض صفحة "قيد الصيانة" للزوار</p>
              </div>
            </div>
            <div class="toggle-switch">
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>

      <!-- ✅ إظهار الأزرار فقط للـ Admin -->
      <div v-if="authStore.canModify" class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري حفظ الإعدادات...' : 'حفظ الإعدادات' }}
        </button>
        <button type="button" class="cancel-btn" @click="resetForm" :disabled="loading">
          إلغاء
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import siteSettingsService from '@/services/siteSettingsService';
import { useAuthStore } from '@/stores/auth'; // ✅ استيراد AuthStore
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ استيراد المعالج

const authStore = useAuthStore(); // ✅ تفعيل AuthStore
const loading = ref(false);
const selectedCvFile = ref(null);
const rawSettings = ref([]);

const settingsMap = {
  siteName: 'General_SiteName',
  siteDescription: 'SEO_Description',
  contactEmail: 'Contact_Email',
  maintenanceMode: 'System_MaintenanceMode',
  cvUrl: 'Files_CVUrl'
};

const originalData = {
  siteName: '',
  siteDescription: '',
  contactEmail: '',
  maintenanceMode: false,
};

const formData = reactive({ ...originalData });

onMounted(async () => {
  await fetchSettings();
});

const fetchSettings = async () => {
  loading.value = true;
  try {
    const response = await siteSettingsService.getAll();
    const settingsList = Array.isArray(response) ? response : (response.data || []);

    rawSettings.value = settingsList;

    settingsList.forEach(setting => {
      if (setting.settingKey === settingsMap.siteName) formData.siteName = setting.settingValue;
      if (setting.settingKey === settingsMap.siteDescription) formData.siteDescription = setting.settingValue;
      if (setting.settingKey === settingsMap.contactEmail) formData.contactEmail = setting.settingValue;
      if (setting.settingKey === settingsMap.maintenanceMode) formData.maintenanceMode = setting.settingValue === 'true';
    });

  } catch (err) {
    console.error('Error fetching settings:', err);
    alert('فشل تحميل الإعدادات');
  } finally {
    loading.value = false;
  }
};

const handleCvUpload = (event) => {
  // ✅ التحقق من صلاحيات Guest
  if (handleGuestAction('edit')) {
    event.target.value = ''; // مسح الملف المختار
    return;
  }

  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedCvFile.value = file;
  } else {
    alert('الرجاء اختيار ملف PDF فقط');
    event.target.value = '';
  }
};

const handleSubmit = async () => {
  // ✅ التحقق من صلاحيات Guest
  if (handleGuestAction('edit')) return;

  loading.value = true;
  try {
    const promises = [];

    const processSetting = (formKey, value) => {
      const dbKey = settingsMap[formKey];
      const existingSetting = rawSettings.value.find(s => s.settingKey === dbKey);

      const payload = {
        settingKey: dbKey,
        settingValue: String(value),
        description: 'Updated via Admin Panel'
      };

      if (existingSetting) {
        promises.push(siteSettingsService.update(existingSetting.id, payload));
      } else {
        promises.push(siteSettingsService.create(payload));
      }
    };

    processSetting('siteName', formData.siteName);
    processSetting('siteDescription', formData.siteDescription);
    processSetting('contactEmail', formData.contactEmail);
    processSetting('maintenanceMode', formData.maintenanceMode);

    if (selectedCvFile.value) {
       console.warn('Upload logic needs a FileService. Skipping file upload save.');
    }

    await Promise.all(promises);

    alert('تم حفظ الإعدادات بنجاح');
    await fetchSettings();

  } catch (err) {
    console.error(err);
    alert('حدث خطأ أثناء حفظ الإعدادات');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, originalData);
  selectedCvFile.value = null;
  const fileInput = document.querySelector('.file-input');
  if (fileInput) fileInput.value = '';
  fetchSettings();
};
</script>

<style scoped>
.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* ✅ رسالة تحذير للـ Guest */
.warning-banner {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.warning-icon {
  width: 32px;
  height: 32px;
  color: #d97706;
  flex-shrink: 0;
}

.warning-banner strong {
  display: block;
  color: #92400e;
  font-size: 16px;
  margin-bottom: 4px;
  font-weight: 700;
}

.warning-banner p {
  color: #b45309;
  font-size: 14px;
  margin: 0;
}

/* Header */
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
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper.settings-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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

.section-icon.green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:disabled,
.form-textarea:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-input.file-input {
  padding: 10px 16px;
  cursor: pointer;
}

.form-input.file-input:disabled {
  cursor: not-allowed;
}

.form-input.file-input::file-selector-button {
  display: none;
}

.form-input:focus:not(:disabled),
.form-select:focus,
.form-textarea:focus:not(:disabled) {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

.char-count {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
  text-align: left;
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

.toggle-card:hover:not(.disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.toggle-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.toggle-icon.maintenance {
  background: linear-gradient(135deg, #f97316 0%, #facc15 100%);
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
  cursor: pointer;
}

.cancel-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
