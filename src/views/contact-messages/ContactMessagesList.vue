<template>
  <div class="messages-container">

    <div v-if="authStore.isGuest" class="guest-placeholder">
      <div class="guest-content">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="lock-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2>محتوى محمي (Protected Content)</h2>
        <p>
          أهلاً بك في لوحة التحكم! نظراً لأنك تستخدم حساب <strong>"زائر"</strong>،
          تم إخفاء رسائل التواصل الحقيقية حفاظاً على <strong>خصوصية وسرية بيانات المتصلين</strong>.
        </p>
        <div class="info-box">
          💡 يمكنك تجربة إرسال رسالة بنفسك من الواجهة الرئيسية للموقع،
          ولكن لن تظهر هنا إلا للمشرف المسؤول (Admin).
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center p-5">
        <div class="loader"></div>
        <p>جاري تحميل الرسائل...</p>
      </div>

      <div v-else-if="filteredMessages.length === 0" class="empty-state">
        <p>لا توجد رسائل للعرض حالياً.</p>
      </div>

      <div v-else class="messages-list">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="message-card"
          :class="{ 'unread': !message.isRead }"
        >
          <div class="message-header">
             <h3 class="sender-name">{{ message.name || message.email }}</h3>
             <span class="msg-date">{{ new Date(message.createdAt).toLocaleDateString('ar-EG') }}</span>
          </div>

          <div class="message-subject">
            {{ message.subject }}
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
              تحديد كمقروءة
            </button>

             <button
              v-else
              class="action-btn unmark-btn"
              @click="handleMarkAsUnread(message.id)"
              :disabled="processingId === message.id"
            >
              تحديد كغير مقروءة
            </button>

            <button
              class="action-btn delete-btn"
              @click="handleDelete(message.id)"
              :disabled="processingId === message.id"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth'; //
import { useContactMessagesStore } from '@/stores/contactMessages'; //
import Swal from 'sweetalert2';

// 1. تهيئة الـ Stores
const authStore = useAuthStore();
const messagesStore = useContactMessagesStore();

// 2. تعريف المتغيرات المحسوبة (Computed Properties)
const filteredMessages = computed(() => messagesStore.filteredMessages);
const processingId = computed(() => messagesStore.processingId);
const loading = computed(() => messagesStore.loading);

// 3. جلب البيانات عند فتح الصفحة
onMounted(() => {
  // ✅ هام جداً: لا نحاول جلب البيانات إذا كان المستخدم Guest
  // لأن الباك إند سيرفض الطلب ويرجع خطأ 403
  if (authStore.isAdmin) {
    messagesStore.fetchMessages();
  }
});

// 4. دوال التعامل مع الأحداث (تعمل فقط للأدمن)
const handleMarkAsRead = async (id) => {
  await messagesStore.markAsRead(id);
};

const handleMarkAsUnread = async (id) => {
  await messagesStore.markAsUnread(id);
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "لن تتمكن من استرجاع هذه الرسالة!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذفها',
    cancelButtonText: 'إلغاء'
  });

  if (result.isConfirmed) {
    await messagesStore.deleteMessage(id);
    Swal.fire(
      'تم الحذف!',
      'تم حذف الرسالة بنجاح.',
      'success'
    );
  }
};
</script>

<style scoped>
/* --- تنسيقات وضع الزائر --- */
.guest-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  margin-top: 20px;
}

.guest-content {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
}

.icon-wrapper {
  background-color: #fee2e2;
  color: #ef4444;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.lock-icon {
  width: 40px;
  height: 40px;
}

.guest-content h2 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.guest-content p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.info-box {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

/* --- تنسيقات البطاقات (Admin) --- */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.message-card.unread {
  background-color: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.sender-name {
  font-weight: 700;
  color: #111827;
  font-size: 1.1rem;
}

.msg-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.message-subject {
  color: #374151;
  font-weight: 500;
  margin-bottom: 1rem;
}

.message-footer {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  color: white;
  text-decoration: none;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: wait;
}

.view-btn { background-color: #3b82f6; }
.view-btn:hover { background-color: #2563eb; }

.mark-btn { background-color: #10b981; }
.mark-btn:hover { background-color: #059669; }

.unmark-btn { background-color: #f59e0b; }
.unmark-btn:hover { background-color: #d97706; }

.delete-btn { background-color: #ef4444; }
.delete-btn:hover { background-color: #dc2626; }

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 1.1rem;
}
</style>
