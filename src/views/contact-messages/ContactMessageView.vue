<template>
  <div class="messages-container">
    <div class="messages-list">
      <div v-for="message in filteredMessages" :key="message.id" class="message-card" :class="{ 'unread': !message.isRead }">
        <div class="message-footer">
          <router-link :to="{ name: 'ContactMessageView', params: { id: message.id }}" class="action-btn view-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            عرض التفاصيل
          </router-link>

          <template v-if="authStore.isAdmin">
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useContactMessagesStore } from '@/stores/contactMessages';
import { useAuthStore } from '@/stores/auth'; // Import

const store = useContactMessagesStore();
const authStore = useAuthStore(); // Init

// Expose the store values used in the template
const filteredMessages = computed(() => store.filteredMessages);
const processingId = computed(() => store.processingId);

// Action wrappers used by the template
const handleMarkAsRead = async (id) => {
  try {
    if (store.markAsRead) {
      await store.markAsRead(id);
    } else if (store.markRead) {
      await store.markRead(id);
    }
  } catch (e) {
    console.error(e);
  }
};

const handleMarkAsUnread = async (id) => {
  try {
    if (store.markAsUnread) {
      await store.markAsUnread(id);
    } else if (store.markUnread) {
      await store.markUnread(id);
    }
  } catch (e) {
    console.error(e);
  }
};

const handleDelete = async (id) => {
  try {
    if (store.deleteMessage) {
      await store.deleteMessage(id);
    } else if (store.delete) {
      await store.delete(id);
    }
  } catch (e) {
    console.error(e);
  }
};

// ... existing script ...
</script>
