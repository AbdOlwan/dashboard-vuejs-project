<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>تسجيل حساب جديد</h1>
        <p>إنشاء حساب مدير للوحة التحكم</p>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">اسم المستخدم</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            placeholder="أدخل اسم المستخدم"
            required
            minlength="3"
          />
        </div>

        <div class="form-group">
          <label for="email">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            placeholder="example@email.com"
            required
            dir="ltr"
          />
        </div>

        <div class="form-group">
          <label for="password">كلمة المرور</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            placeholder="********"
            required
            minlength="6"
          />
          <p class="form-hint">يجب أن تكون 6 أحرف على الأقل</p>
        </div>

        <div class="form-group">
          <label for="confirmPassword">تأكيد كلمة المرور</label>
          <input
            v-model="form.confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <button type="submit" :disabled="isLoading" class="register-btn">
          <span v-if="isLoading">جاري التسجيل...</span>
          <span v-else>تسجيل حساب</span>
        </button>
      </form>

      <div class="login-link">
        <p>لديك حساب بالفعل؟ <router-link to="/login">تسجيل الدخول</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
  // مسح الرسائل السابقة
  errorMessage.value = '';
  successMessage.value = '';

  // التحقق من تطابق كلمات المرور
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'كلمات المرور غير متطابقة';
    return;
  }

  isLoading.value = true;

  try {
    await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password
    });

    successMessage.value = 'تم إنشاء الحساب بنجاح! جاري التحويل لصفحة الدخول...';

    // الانتقال لصفحة الدخول بعد 2 ثانية
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    if (error.response?.status === 400) {
      errorMessage.value = error.response.data?.message || 'اسم المستخدم أو البريد مستخدم بالفعل';
    } else {
      errorMessage.value = 'حدث خطأ أثناء التسجيل، حاول مرة أخرى';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
}

.register-header p {
  color: #7f8c8d;
  font-size: 14px;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fecaca;
}

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #a7f3d0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background-color: #fafafa;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.register-btn {
  width: 100%;
  padding: 13px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.register-btn:hover:not(:disabled) {
  background-color: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.register-btn:active:not(:disabled) {
  transform: translateY(0);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
}
</style>
