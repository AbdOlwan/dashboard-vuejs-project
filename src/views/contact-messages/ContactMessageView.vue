<template>
  <div class="message-view-container">
    <div class="page-header">
      <router-link to="/contact-messages" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        العودة للقائمة
      </router-link>

      <div v-if="message" class="header-actions">
        <a :href="`mailto:${message.email}`" class="action-btn-header reply-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          رد عبر البريد
        </a>
        <button class="action-btn-header delete-btn" @click="handleDelete">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          حذف
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>جاري تحميل تفاصيل الرسالة...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3>لم يتم العثور على الرسالة</h3>
      <p>{{ error }}</p>
      <router-link to="/contact-messages" class="back-home-btn">العودة للرسائل</router-link>
    </div>

    <div v-else-if="message" class="message-card">
      <div class="message-header">
        <div class="sender-section">
          <div class="sender-avatar">
            <span>{{ getInitials(message.name) }}</span>
          </div>
          <div class="sender-info">
            <h2 class="sender-name">{{ message.name }}</h2>
            <p class="sender-email">{{ message.email }}</p>
            <div class="message-meta">
              <span class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(message.createdAt) }}
              </span>
              <span
                class="status-badge"
                :class="message.isRead ? 'read' : 'unread'"
              >
                {{ message.isRead ? 'مقروءة' : 'جديدة' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="message-subject">
        <h3>{{ message.subject || 'بدون عنوان' }}</h3>
      </div>

      <div class="message-content">
        <p style="white-space: pre-line;">{{ message.message }}</p>
      </div>

      <div class="contact-details">
        <h4 class="details-title">معلومات الاتصال الإضافية</h4>
        <div class="details-grid">
          <div class="detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p class="detail-label">البريد الإلكتروني</p>
              <a :href="`mailto:${message.email}`" class="detail-value link">{{ message.email }}</a>
            </div>
          </div>

          <div class="detail-item" v-if="message.phone">
            <svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <p class="detail-label">رقم الجوال</p>
              <a :href="`tel:${message.phone}`" class="detail-value link">{{ message.phone }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="message-actions">
        <button
          v-if="!message.isRead"
          class="btn-action btn-mark"
          @click="toggleReadStatus"
          :disabled="actionLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          تعليم كمقروءة
        </button>

        <button
          v-else
          class="btn-action btn-archive"
          @click="toggleReadStatus"
          :disabled="actionLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
          تعليم كغير مقروءة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import contactMessagesService from '@/services/contactMessagesService';
import { useContactMessagesStore } from '@/stores/contactMessages';

const route = useRoute();
const router = useRouter();
const store = useContactMessagesStore();

const messageId = parseInt(route.params.id);
const message = ref(null);
const loading = ref(true);
const error = ref(null);
const actionLoading = ref(false);

// جلب بيانات الرسالة
const fetchMessageDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    // محاولة جلب البيانات من الـ API مباشرة لضمان الحداثة
    const response = await contactMessagesService.getById(messageId);
    // استجابة BaseService ترجع response.data مباشرة
    if(response && response.id) {
        message.value = response;

        // إذا كانت الرسالة غير مقروءة، يمكننا تعليمها كمقروءة تلقائياً عند الفتح
        // if (!message.value.isRead) {
        //   await toggleReadStatus();
        // }
    } else {
        error.value = "البيانات غير صالحة";
    }
  } catch (err) {
    console.error(err);
    error.value = err.message || 'تعذر تحميل الرسالة';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!messageId) {
    error.value = "رقم الرسالة غير صحيح";
    loading.value = false;
    return;
  }
  fetchMessageDetails();
});

const toggleReadStatus = async () => {
  if (!message.value) return;

  actionLoading.value = true;
  try {
    if (message.value.isRead) {
        await store.markAsUnread(messageId);
        message.value.isRead = false;
    } else {
        await store.markAsRead(messageId);
        message.value.isRead = true;
    }
  } catch  {
    alert('حدث خطأ أثناء تحديث حالة الرسالة');
  } finally {
    actionLoading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) return;

  try {
    await store.deleteMessage(messageId);
    router.push('/contact-messages'); // العودة للقائمة بعد الحذف
  } catch  {
    alert('حدث خطأ أثناء الحذف');
  }
};

// Helpers
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>

<style scoped>
.message-view-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  text-decoration: none;
}

.back-btn:hover {
  color: #4f46e5;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.action-btn-header .icon {
  width: 16px;
  height: 16px;
}

.reply-btn {
  background-color: #4f46e5;
  color: white;
}

.reply-btn:hover {
  background-color: #4338ca;
}

.delete-btn {
  background-color: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #fee2e2;
}

/* Message Card */
.message-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.message-header {
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.sender-section {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.sender-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
}

.sender-info {
  flex: 1;
}

.sender-name {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.sender-email {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.unread {
  background-color: #e0e7ff;
  color: #4338ca;
}

.status-badge.read {
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Subject & Content */
.message-subject h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.message-content {
  line-height: 1.8;
  color: #374151;
  font-size: 16px;
  margin-bottom: 32px;
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

/* Contact Details */
.contact-details {
  margin-bottom: 24px;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.details-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.detail-icon {
  width: 20px;
  height: 20px;
  color: #4f46e5;
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.detail-value.link {
  color: #4f46e5;
  text-decoration: none;
}

.detail-value.link:hover {
  text-decoration: underline;
}

/* Actions */
.message-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-mark {
  background-color: #f0fdf4;
  color: #15803d;
}

.btn-mark:hover {
  background-color: #dcfce7;
}

.btn-archive {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-archive:hover {
  background-color: #e5e7eb;
}

/* Loading & Error */
.loading-container, .error-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.error-icon {
  width: 64px;
  height: 64px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.error-icon svg {
  width: 32px;
  height: 32px;
}

.back-home-btn {
  display: inline-block;
  margin-top: 16px;
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 640px) {
  .message-card {
    padding: 20px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .message-actions {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }
}
</style>
