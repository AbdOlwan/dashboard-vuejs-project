<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">مرحباً بك، {{ authStore.user?.username }} 👋</h1>
        <p class="welcome-subtitle">إليك نظرة سريعة على إحصائيات البورتفوليو الخاص بك</p>
      </div>
      <div class="welcome-date">
        <svg xmlns="http://www.w3.org/2000/svg" class="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <div v-if="loading && !stats.projects" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل الإحصائيات...</p>
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card projects">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">المشاريع</p>
          <p class="stat-number">{{ stats.projects }}</p>
          <p class="stat-change positive">مشروع في المعرض</p>
        </div>
        <router-link to="/projects" class="stat-link">
          عرض الكل
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div class="stat-card skills">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">المهارات</p>
          <p class="stat-number">{{ stats.skills }}</p>
          <p class="stat-change positive">مهارة تقنية</p>
        </div>
        <router-link to="/skills" class="stat-link">
          عرض الكل
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div class="stat-card experiences">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">الخبرات</p>
          <p class="stat-number">{{ stats.experiences }}</p>
          <p class="stat-change">محطة وظيفية</p>
        </div>
        <router-link to="/experiences" class="stat-link">
          عرض الكل
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div class="stat-card messages">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">الرسائل</p>
          <p class="stat-number">{{ stats.messages }}</p>
          <p class="stat-change highlight" v-if="stats.unreadMessages > 0">
             {{ stats.unreadMessages }} رسائل غير مقروءة
          </p>
          <p class="stat-change" v-else>لا توجد رسائل جديدة</p>
        </div>
        <router-link to="/contact-messages" class="stat-link">
          عرض الكل
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <div class="quick-actions-section">
      <h2 class="section-title">إجراءات سريعة</h2>
      <div class="actions-grid">
        <router-link to="/projects/create" class="action-card">
          <div class="action-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="action-info">
            <h3 class="action-title">إضافة مشروع جديد</h3>
            <p class="action-description">قم بإضافة مشروع جديد لبورتفوليو</p>
          </div>
        </router-link>

        <router-link to="/certifications/create" class="action-card">
          <div class="action-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div class="action-info">
            <h3 class="action-title">إضافة شهادة</h3>
            <p class="action-description">قم بإضافة شهادة جديدة</p>
          </div>
        </router-link>

        <router-link to="/skills/create" class="action-card">
          <div class="action-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="action-info">
            <h3 class="action-title">إضافة مهارة</h3>
            <p class="action-description">أضف مهارة جديدة لملفك</p>
          </div>
        </router-link>

        <router-link to="/contact-messages" class="action-card">
          <div class="action-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div class="action-info">
            <h3 class="action-title">الرسائل الجديدة</h3>
            <p class="action-description">تحقق من الرسائل غير المقروءة</p>
          </div>
        </router-link>
      </div>
    </div>

    <div class="activity-section">
      <div class="section-header">
        <h2 class="section-title">النشاط الأخير</h2>
      </div>

      <div v-if="loading && recentActivities.length === 0" class="loading-state mini">
        <div class="spinner"></div>
        <p>جاري تحميل النشاط...</p>
      </div>

      <div v-else-if="recentActivities.length === 0" class="no-activity">
        <div class="empty-icon">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p>لا يوجد نشاط حديث لعرضه حتى الآن.</p>
      </div>

      <div v-else class="activity-list">
        <div v-for="(item, index) in recentActivities" :key="index" class="activity-item">

          <div class="activity-icon" :class="{
            'blue': item.type === 'project',
            'green': item.type === 'message',
            'purple': item.type === 'skill',
            'orange': item.type === 'experience'
          }">
            <svg v-if="item.type === 'project'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            <svg v-else-if="item.type === 'message'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <svg v-else-if="item.type === 'skill'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <svg v-else-if="item.type === 'experience'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>

          <div class="activity-content">
            <p class="activity-text">
              <span v-if="item.type === 'project'"><strong>مشروع جديد:</strong> {{ item.title }}</span>
              <span v-else-if="item.type === 'message'">
                 <strong>رسالة جديدة من:</strong> {{ item.name }}
                 <span v-if="!item.isRead" class="badge-new">جديد</span>
              </span>
              <span v-else-if="item.type === 'skill'"><strong>مهارة مضافة:</strong> {{ item.name }}</span>
              <span v-else-if="item.type === 'experience'"><strong>خبرة عمل:</strong> {{ item.position }} في {{ item.companyName }}</span>
            </p>
            <span class="activity-time">{{ timeAgo(item.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import projectsService from '@/services/projectsService';
import skillsService from '@/services/skillsService';
import experiencesService from '@/services/experiencesService';
import contactMessagesService from '@/services/contactMessagesService';

const authStore = useAuthStore();
const loading = ref(true);

const stats = ref({
  projects: 0,
  skills: 0,
  experiences: 0,
  messages: 0,
  unreadMessages: 0
});

const recentActivities = ref([]);

const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const requests = [
      projectsService.getAll(),
      skillsService.getAll(),
      experiencesService.getAll()
    ];

    // ✅ فقط الـ Admin يمكنه جلب الرسائل
    if (authStore.isAdmin) {
      requests.push(contactMessagesService.getAll());
    } else {
      requests.push(Promise.resolve([]));
    }

    const [projectsRes, skillsRes, experiencesRes, messagesRes] = await Promise.all(requests);

    const projects = Array.isArray(projectsRes) ? projectsRes : (projectsRes.data || []);
    const skills = Array.isArray(skillsRes) ? skillsRes : (skillsRes.data || []);
    const experiences = Array.isArray(experiencesRes) ? experiencesRes : (experiencesRes.data || []);
    const messages = Array.isArray(messagesRes) ? messagesRes : (messagesRes.data || []);

    stats.value.projects = projects.length;
    stats.value.skills = skills.length;
    stats.value.experiences = experiences.length;
    stats.value.messages = messages.length;
    stats.value.unreadMessages = messages.filter(m => !m.isRead).length;

    const activities = [
      ...projects.map(i => ({ ...i, type: 'project', date: new Date(i.createdAt || i.startDate) })),
      ...skills.map(i => ({ ...i, type: 'skill', date: new Date(i.createdAt) })),
      ...experiences.map(i => ({ ...i, type: 'experience', date: new Date(i.createdAt || i.startDate) })),
      ...messages.map(i => ({ ...i, type: 'message', date: new Date(i.createdAt) }))
    ];

    recentActivities.value = activities
      .filter(a => !isNaN(a.date))
      .sort((a, b) => b.date - a.date)
      .slice(0, 6);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return "منذ " + Math.floor(interval) + " سنة";
  interval = seconds / 2592000;
  if (interval > 1) return "منذ " + Math.floor(interval) + " شهر";
  interval = seconds / 86400;
  if (interval > 1) return "منذ " + Math.floor(interval) + " يوم";
  interval = seconds / 3600;
  if (interval > 1) return "منذ " + Math.floor(interval) + " ساعة";
  interval = seconds / 60;
  if (interval > 1) return "منذ " + Math.floor(interval) + " دقيقة";
  return "الآن";
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.welcome-content { flex: 1; }
.welcome-title { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
.welcome-subtitle { font-size: 16px; opacity: 0.9; }

.welcome-date {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  font-size: 14px;
  font-weight: 500;
}
.date-icon { width: 20px; height: 20px; }

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 16px;
  color: #6b7280;
}
.loading-state.mini { padding: 20px; }
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.08;
  transition: all 0.3s;
}

.stat-card.projects::before { background: #667eea; }
.stat-card.skills::before { background: #f093fb; }
.stat-card.experiences::before { background: #4facfe; }
.stat-card.messages::before { background: #fa709a; }

.stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08); }
.stat-card:hover::before { transform: scale(1.5); }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-card.projects .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card.skills .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card.experiences .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card.messages .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.stat-icon svg { width: 28px; height: 28px; color: white; stroke-width: 2; }

.stat-info { margin-bottom: 16px; }
.stat-label { font-size: 14px; color: #6b7280; margin-bottom: 4px; }
.stat-number { font-size: 32px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.stat-change { font-size: 13px; color: #6b7280; }
.stat-change.positive { color: #10b981; }
.stat-change.highlight { color: #f59e0b; font-weight: 600; }

.stat-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.stat-link:hover { gap: 10px; color: #4338ca; }
.stat-link svg { width: 16px; height: 16px; }

/* Quick Actions */
.quick-actions-section { margin-bottom: 40px; }
.section-title { font-size: 22px; font-weight: 700; color: #1f2937; margin-bottom: 20px; }

.actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }

.action-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
  text-decoration: none;
  cursor: pointer;
}
.action-card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); }

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.action-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.action-icon.purple { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.action-icon.green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.action-icon.orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.action-icon svg { width: 24px; height: 24px; color: white; stroke-width: 2; }

.action-info { overflow: hidden; }
.action-title { font-size: 16px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.action-description { font-size: 13px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Activity Section */
.activity-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

.no-activity {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}
.no-activity .empty-icon {
  width: 60px; height: 60px;
  margin: 0 auto 16px;
  color: #d1d5db;
}
.no-activity .empty-icon svg { width: 100%; height: 100%; }

.activity-list { display: flex; flex-direction: column; gap: 16px; }

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.activity-item:hover { background: #fff; border-color: #e5e7eb; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.activity-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.activity-icon.green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.activity-icon.purple { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.activity-icon.orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.activity-icon svg { width: 20px; height: 20px; color: white; }

.activity-content { flex: 1; }
.activity-text { font-size: 15px; color: #374151; margin-bottom: 4px; }
.activity-text strong { color: #1f2937; font-weight: 700; }
.activity-time { font-size: 12px; color: #9ca3af; }

.badge-new {
  background-color: #fef2f2;
  color: #ef4444;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 6px;
  border: 1px solid #fee2e2;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-section { flex-direction: column; gap: 20px; text-align: center; }
  .stats-grid, .actions-grid { grid-template-columns: 1fr; }
}
</style>
