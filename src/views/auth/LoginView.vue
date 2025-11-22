<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>تسجيل الدخول</h1>
        <p>لوحة تحكم البورتفوليو</p>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">اسم المستخدم</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            placeholder="أدخل اسم المستخدم"
            required
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
          />
        </div>

        <div class="form-group-checkbox">
          <label class="checkbox-label">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="checkbox-input"
            />
            <span>تذكرني</span>
          </label>
        </div>

        <button type="submit" :disabled="isLoading" class="login-btn">
          <span v-if="isLoading">جاري الدخول...</span>
          <span v-else>دخول</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    } else {
      errorMessage.value = 'حدث خطأ غير متوقع، حاول مرة أخرى';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
}

.login-header p {
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

.form-group-checkbox {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: #4b5563;
  font-size: 14px;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  cursor: pointer;
  accent-color: #667eea;
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  background-color: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
