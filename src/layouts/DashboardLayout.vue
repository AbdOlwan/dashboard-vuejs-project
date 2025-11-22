<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: !sidebarOpen }">
      <div class="sidebar-inner">
        <!-- Logo & Toggle -->
        <div class="sidebar-header">
          <h1 v-if="sidebarOpen" class="logo">لوحة التحكم</h1>
          <button @click="sidebarOpen = !sidebarOpen" class="toggle-btn">
            <Menu class="icon" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActiveRoute(item.path) }"
          >
            <component :is="getIcon(item.icon)" class="nav-icon" />
            <span v-if="sidebarOpen" class="nav-text">{{ item.name }}</span>
            <span
              v-if="sidebarOpen && item.badge && unreadCount > 0"
              class="badge"
            >
              {{ unreadCount }}
            </span>
          </router-link>
        </nav>

        <!-- User Section -->
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <User class="icon" />
            </div>
            <div v-if="sidebarOpen" class="user-details">
              <p class="user-name">{{ user?.username || 'Admin' }}</p>
              <button @click="handleLogout" class="logout-btn">
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-area" :class="{ expanded: !sidebarOpen }">
      <!-- Header -->
      <header class="main-header">
        <div class="header-content">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <div class="header-actions">
            <button class="icon-btn">
              <Bell class="icon" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  Menu, User, Bell,
  LayoutDashboard, FolderKanban, Code, Briefcase,
  GraduationCap, Award, Cpu, Mail, MessageSquare,
  User as UserIcon, Share2, Settings
} from 'lucide-vue-next';

const authStore = useAuthStore();
const route = useRoute();

const sidebarOpen = ref(true);
const user = computed(() => authStore.user);
const unreadCount = ref(0);

const menuItems = [
  { name: 'لوحة التحكم', path: '/', icon: 'LayoutDashboard' },
  { name: 'المشاريع', path: '/projects', icon: 'FolderKanban' },
  { name: 'المهارات', path: '/skills', icon: 'Code' },
  { name: 'الخبرات', path: '/experiences', icon: 'Briefcase' },
  { name: 'التعليم', path: '/education', icon: 'GraduationCap' },
  { name: 'الشهادات', path: '/certifications', icon: 'Award' },
  { name: 'التقنيات', path: '/technologies', icon: 'Cpu' },
  { name: 'الرسائل', path: '/contact-messages', icon: 'Mail', badge: 'unreadCount' },
  { name: 'آراء العملاء', path: '/testimonials', icon: 'MessageSquare' },
  { name: 'عني', path: '/about-me', icon: 'User' },
  { name: 'وسائل التواصل', path: '/social-media', icon: 'Share2' },
  { name: 'الإعدادات', path: '/settings', icon: 'Settings' },
];

const iconComponents = {
  LayoutDashboard, FolderKanban, Code, Briefcase,
  GraduationCap, Award, Cpu, Mail, MessageSquare,
  User: UserIcon, Share2, Settings
};

const getIcon = (iconName) => iconComponents[iconName];

const isActiveRoute = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const currentPageTitle = computed(() => {
  return route.meta.title || 'لوحة التحكم';
});

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  direction: rtl;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  right: 0;
  top: 0;
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
  margin: 0;
  white-space: nowrap;
}

.toggle-btn {
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #f1f3f5;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  text-decoration: none;
  color: #495057;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background-color: #f1f3f5;
}

.nav-item.active {
  background-color: #e7f5ff;
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 14px;
  white-space: nowrap;
}

.badge {
  margin-right: auto;
  background-color: #ff6b6b;
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e9ecef;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #e7f5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar .icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  font-size: 12px;
  color: #ff6b6b;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.logout-btn:hover {
  color: #ff5252;
}

/* Main Content */
.main-area {
  flex: 1;
  margin-right: 260px;
  transition: margin-right 0.3s ease;
}

.main-area.expanded {
  margin-right: 80px;
}

.main-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #212529;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: #f1f3f5;
}

.icon {
  width: 20px;
  height: 20px;
  color: #495057;
}

.page-content {
  padding: 24px;
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
