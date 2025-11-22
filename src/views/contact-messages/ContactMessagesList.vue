<template>
  <div class="messages-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">رسائل التواصل</h2>
        <p class="page-subtitle">إدارة ومتابعة رسائل الزوار والعملاء</p>
      </div>
      <div class="header-actions">
        <button
          class="filter-btn"
          :class="{ 'active': filterUnread }"
          @click="filterUnread = !filterUnread"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ filterUnread ? 'عرض الكل' : 'غير المقروءة فقط' }}
        </button>

        <button class="refresh-btn" @click="refreshData" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" :class="{'spin': loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">إجمالي الرسائل</p>
          <p class="stat-value">{{ totalMessages }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon unread">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">غير المقروءة</p>
          <p class="stat-value">{{ unreadCount }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading && !messages.length" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل الرسائل...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-text">{{ error }}</p>
      <button @click="refreshData" class="retry-btn">إعادة المحاولة</button>
    </div>

    <div v-else-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="empty-title">لا توجد رسائل</h3>
      <p class="empty-text">لم تتلق أي رسائل تواصل حتى الآن.</p>
    </div>

    <div v-else-if="filteredMessages.length === 0" class="empty-state">
      <h3 class="empty-title">لا توجد رسائل غير مقروءة</h3>
      <p class="empty-text">لقد قمت بقراءة جميع الرسائل الواردة.</p>
      <button class="reset-filter-btn" @click="filterUnread = false">عرض كل الرسائل</button>
    </div>

    <div v-else class="messages-list">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="message-card"
        :class="{ 'unread': !message.isRead }"
      >
        <div class="message-indicator"></div>
        <div class="message-header">
          <div class="sender-info">
            <div class="sender-avatar" :class="{ 'active': !message.isRead }">
              <span>{{ getInitials(message.name) }}</span>
            </div>
            <div class="sender-details">
              <h3 class="sender-name">{{ message.name }}</h3>
              <p class="sender-email">{{ message.email }}</p>
            </div>
          </div>
          <div class="message-meta">
            <span class="message-time">{{ formatDate(message.createdAt) }}</span>
            <span v-if="!message.isRead" class="message-badge new">جديدة</span>
          </div>
        </div>

        <div class="message-body">
          <h4 class="message-subject">{{ message.subject || 'بدون عنوان' }}</h4>
          <p class="message-preview">
            {{ truncateText(message.message, 150) }}
          </p>
        </div>

        <div class="message-footer">
          <router-link :to="{ name: 'ContactMessageView', params: { id: message.id }}" class="action-btn view-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            عرض التفاصيل
          </router-link>

          <button
            v-if="!message.isRead"
            class="action-btn mark-btn"
            @click="handleMarkAsRead(message.id)"
            :disabled="processingId === message.id"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            تحديد كمقروءة
          </button>

           <button
            v-else
            class="action-btn unmark-btn"
            @click="handleMarkAsUnread(message.id)"
            :disabled="processingId === message.id"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            تحديد كغير مقروءة
          </button>

          <button
            class="action-btn delete-btn"
            @click="handleDelete(message.id)"
            :disabled="processingId === message.id"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { storeToRefs } from 'pinia';
import { useContactMessagesStore } from '@/stores/contactMessages';

const store = useContactMessagesStore();
const { messages, unreadCount, loading, error } = storeToRefs(store);
const { fetchMessages, markAsRead, markAsUnread, deleteMessage } = store;

const filterUnread = ref(false);
const processingId = ref(null);

// جلب الرسائل عند التحميل
onMounted(() => {
  refreshData();
});

const refreshData = async () => {
  await fetchMessages();
};

// تصفية الرسائل
const filteredMessages = computed(() => {
  let list = messages.value;
  if (filterUnread.value) {
    list = list.filter(m => !m.isRead);
  }
  // ترتيب تنازلي حسب التاريخ (الأحدث أولاً)
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const totalMessages = computed(() => messages.value.length);

// معالجة الإجراءات
const handleMarkAsRead = async (id) => {
  processingId.value = id;
  try {
    await markAsRead(id);
  } catch (err) {
    console.error(err);
  } finally {
    processingId.value = null;
  }
};

const handleMarkAsUnread = async (id) => {
  processingId.value = id;
  try {
    await markAsUnread(id);
  } catch (err) {
    console.error(err);
  } finally {
    processingId.value = null;
  }
};

const handleDelete = async (id) => {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.')) return;

  processingId.value = id;
  try {
    await deleteMessage(id);
  } catch {
    alert('حدث خطأ أثناء الحذف');
  } finally {
    processingId.value = null;
  }
};

// دوال مساعدة
const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

<style scoped>
.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.filter-btn, .refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
}

.filter-btn:hover, .refresh-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.filter-btn.active {
  background-color: #eef2ff;
  color: #4f46e5;
  border-color: #c7d2fe;
}

.refresh-btn .icon.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.stat-icon.unread {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1;
}

/* Messages List */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  border-right: 4px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.message-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.message-card.unread {
  border-right-color: #4f46e5;
  background: #fbfbfe;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
  flex-wrap: wrap;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.sender-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.sender-avatar.active {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
}

.sender-details {
  flex: 1;
  overflow: hidden;
}

.sender-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sender-email {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

.message-badge.new {
  background-color: #e0e7ff;
  color: #4338ca;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.message-body {
  margin-bottom: 20px;
}

.message-subject {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.message-preview {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-footer {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.view-btn {
  background-color: #4f46e5;
  color: white;
}

.view-btn:hover {
  background-color: #4338ca;
}

.mark-btn {
  background-color: white;
  border-color: #d1d5db;
  color: #374151;
}

.mark-btn:hover {
  background-color: #f9fafb;
  color: #111827;
}

.unmark-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.delete-btn {
  background-color: #fef2f2;
  color: #dc2626;
  margin-right: auto; /* Push delete to left */
}

.delete-btn:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  margin-top: 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.reset-filter-btn {
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

/* Loading & Error */
.loading-state, .error-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

.error-text {
  color: #dc2626;
  margin-bottom: 10px;
}

.retry-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .message-footer {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .delete-btn {
    margin-right: 0;
  }
}
</style>
