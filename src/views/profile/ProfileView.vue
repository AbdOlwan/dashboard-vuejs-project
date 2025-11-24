<template>
  <div class="profile-container">
    <!-- Header -->
    <div class="header-section">
      <div class="header-content">
        <div class="icon-wrapper">
          <User class="icon" />
        </div>
        <div>
          <h1 class="page-title">الملف الشخصي</h1>
          <p class="page-subtitle">إدارة بيانات حسابك</p>
        </div>
      </div>
    </div>

    <div class="profile-grid">
      <!-- Profile Info Card -->
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">معلومات الحساب</h2>
          <button
            v-if="!isEditingProfile"
            @click="isEditingProfile = true"
            class="edit-btn"
          >
            <Edit2 class="btn-icon" />
            تعديل
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleUpdateProfile" class="profile-form">
          <div class="form-group">
            <label class="form-label">اسم المستخدم</label>
            <input
              v-model="profileForm.username"
              type="text"
              class="form-input"
              :disabled="!isEditingProfile"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">البريد الإلكتروني</label>
            <input
              v-model="profileForm.email"
              type="email"
              class="form-input"
              :disabled="!isEditingProfile"
              required
              dir="ltr"
            />
          </div>

          <div class="form-group">
            <label class="form-label">حالة الحساب</label>
            <div class="status-badge" :class="{ active: profileForm.isActive }">
              {{ profileForm.isActive ? 'نشط' : 'غير نشط' }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ الإنشاء</label>
            <input
              :value="formatDate(profileForm.createdAt)"
              type="text"
              class="form-input"
              disabled
            />
          </div>

          <div v-if="isEditingProfile" class="form-actions">
            <button type="submit" :disabled="isLoading" class="save-btn">
              <Save class="btn-icon" v-if="!isLoading" />
              <div v-else class="spinner"></div>
              {{ isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
            </button>
            <button
              type="button"
              @click="cancelProfileEdit"
              class="cancel-btn"
              :disabled="isLoading"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password Card -->
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">تغيير كلمة المرور</h2>
          <Lock class="card-icon" />
        </div>

        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>

        <div v-if="passwordSuccess" class="success-message">
          {{ passwordSuccess }}
        </div>

        <form @submit.prevent="handleChangePassword" class="profile-form">
          <div class="form-group">
            <label class="form-label">كلمة المرور الحالية</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-input"
              placeholder="********"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور الجديدة</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              placeholder="********"
              required
              minlength="6"
            />
            <p class="form-hint">يجب أن تكون 6 أحرف على الأقل</p>
          </div>

          <div class="form-group">
            <label class="form-label">تأكيد كلمة المرور الجديدة</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-input"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="isChangingPassword"
            class="save-btn full-width"
          >
            <Key class="btn-icon" v-if="!isChangingPassword" />
            <div v-else class="spinner"></div>
            {{ isChangingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { User, Edit2, Save, Lock, Key } from 'lucide-vue-next';

const authStore = useAuthStore();

const isEditingProfile = ref(false);
const isLoading = ref(false);
const isChangingPassword = ref(false);

const errorMessage = ref('');
const successMessage = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');

const profileForm = reactive({
  username: '',
  email: '',
  isActive: true,
  createdAt: ''
});

const originalProfile = reactive({});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// تحميل بيانات المستخدم
onMounted(async () => {
  await loadUserData();
});

const loadUserData = async () => {
  try {
    const user = await authStore.fetchCurrentUser();
    Object.assign(profileForm, user);
    Object.assign(originalProfile, user);
  } catch  {
    errorMessage.value = 'فشل تحميل بيانات المستخدم';
  }
};

// تحديث الملف الشخصي
const handleUpdateProfile = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    await authStore.updateProfile({
      username: profileForm.username,
      email: profileForm.email,
      isActive: profileForm.isActive
    });

    successMessage.value = 'تم تحديث البيانات بنجاح';
    isEditingProfile.value = false;
    Object.assign(originalProfile, profileForm);

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

  } catch (error) {
    errorMessage.value = error.message || 'فشل تحديث البيانات';
  } finally {
    isLoading.value = false;
  }
};

// إلغاء تعديل الملف الشخصي
const cancelProfileEdit = () => {
  Object.assign(profileForm, originalProfile);
  isEditingProfile.value = false;
  errorMessage.value = '';
  successMessage.value = '';
};

// تغيير كلمة المرور
const handleChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';

  // التحقق من تطابق كلمات المرور
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'كلمات المرور الجديدة غير متطابقة';
    return;
  }

  isChangingPassword.value = true;

  try {
    await authStore.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });

    passwordSuccess.value = 'تم تغيير كلمة المرور بنجاح';

    // مسح النموذج
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';

    setTimeout(() => {
      passwordSuccess.value = '';
    }, 3000);

  } catch (error) {
    if (error.statusCode === 401) {
      passwordError.value = 'كلمة المرور الحالية غير صحيحة';
    } else {
      passwordError.value = error.message || 'فشل تغيير كلمة المرور';
    }
  } finally {
    isChangingPassword.value = false;
  }
};

// تنسيق التاريخ
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper .icon {
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

/* Profile Grid */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.card-icon {
  width: 24px;
  height: 24px;
  color: #6b7280;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Messages */
.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 1px solid #fecaca;
}

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 1px solid #a7f3d0;
}

/* Form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-input:focus:not(:disabled) {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.save-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-btn.full-width {
  width: 100%;
}

.cancel-btn {
  padding: 12px 24px;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .profile-card {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
