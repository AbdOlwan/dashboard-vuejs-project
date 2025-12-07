<template>
  <div class="create-container">
    <div class="header-section">
      <router-link to="/projects" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        رجوع
      </router-link>
      <div class="header-content">
        <div class="icon-wrapper edit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">تعديل المشروع</h1>
          <p class="page-subtitle">قم بتحديث تفاصيل المشروع الحالي</p>
        </div>
      </div>
    </div>

    <div v-if="pageLoading" class="form-loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل بيانات المشروع...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form-container">
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">المعلومات الأساسية</h2>
            <p class="section-subtitle">أدخل عنوان ووصف المشروع</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label required">العنوان (Title)</label>
            <input
              v-model="formData.Title"
              type="text"
              required
              class="form-input"
              placeholder="مثال: نظام إدارة المحتوى"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">الوصف المختصر (ShortDescription)</label>
            <textarea
              v-model="formData.ShortDescription"
              required
              rows="2"
              class="form-textarea"
              placeholder="اكتب وصفاً مختصراً للمشروع..."
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label class="form-label required">الوصف الكامل (FullDescription)</label>
            <textarea
              v-model="formData.FullDescription"
              required
              rows="5"
              class="form-textarea"
              placeholder="اكتب وصفاً تفصيلياً للمشروع..."
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">تفاصيل المشروع</h2>
            <p class="section-subtitle">حدد نوع المشروع والتقنيات المستخدمة</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">نوع المشروع</label>
            <select v-model="formData.ProjectType" required class="form-select" :disabled="isViewOnly">
              <option value="">اختر نوع المشروع</option>
              <option value="Web">موقع ويب</option>
              <option value="Mobile">تطبيق موبايل</option>
              <option value="Desktop">تطبيق سطح مكتب</option>
              <option value="API">API</option>
              <option value="Other">أخرى</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">ترتيب العرض</label>
            <input
              v-model.number="formData.DisplayOrder"
              type="number"
              min="0"
              class="form-input"
              placeholder="0"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label">التقنيات المستخدمة</label>
            <div v-if="technologiesLoading" class="tech-loading-state">
              <div class="tech-loading-spinner"></div>
              <span>جاري تحميل التقنيات...</span>
            </div>

            <div v-else-if="technologies.length > 0" class="checkbox-group-container">
              <label
                v-for="tech in technologies"
                :key="tech.id"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  :value="tech.id"
                  v-model="formData.TechnologyIds"
                  :disabled="isViewOnly"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">{{ tech.name }} ({{ tech.category }})</span>
              </label>
            </div>
             <div v-else class="form-hint">
              لا توجد تقنيات مُعرفة.
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">الروابط</h2>
            <p class="section-subtitle">أضف روابط المشروع والمصدر</p>
          </div>
        </div>

        <div class="form-grid">
           <div class="form-group">
            <label class="form-label required">رابط الصورة المصغرة</label>
            <input
              v-model="formData.ThumbnailUrl"
              type="url"
              required
              class="form-input"
              dir="ltr"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>

          <div class="form-group">
            <label class="form-label">رابط المشروع</label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <input
                v-model="formData.LiveDemoUrl"
                type="url"
                class="form-input with-icon"
                dir="ltr"
                :readonly="isViewOnly"
                :disabled="isViewOnly"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">رابط GitHub</label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <input
                v-model="formData.GithubUrl"
                type="url"
                class="form-input with-icon"
                dir="ltr"
                :readonly="isViewOnly"
                :disabled="isViewOnly"
              />
            </div>
          </div>

           <div class="form-group">
            <label class="form-label">رابط يوتيوب</label>
            <input
              v-model="formData.YouTubeVideoUrl"
              type="url"
              class="form-input"
              dir="ltr"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>
        </div>
      </div>

       <div class="form-section">
         <div class="section-header">
          <div class="section-icon" style="background: linear-gradient(135deg, #22c55e 0%, #10b981 100%)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">التواريخ</h2>
            <p class="section-subtitle">تاريخ البدء والانتهاء</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">تاريخ البدء</label>
            <input v-model="formData.StartDate" type="date" required class="form-input" :readonly="isViewOnly" :disabled="isViewOnly" />
          </div>
          <div class="form-group">
            <label class="form-label">تاريخ الانتهاء</label>
            <input v-model="formData.EndDate" type="date" class="form-input" :readonly="isViewOnly" :disabled="isViewOnly" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.656-.126-1.283-.356-1.857M9 20H4v-2a3 3 0 015-2.236M9 20v-2a3 3 0 00-5-2.236M12 18V3" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">معلومات العميل</h2>
            <p class="section-subtitle">اسم العميل وتقييمه للمشروع</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">اسم العميل</label>
            <input
              v-model="formData.ClientName"
              type="text"
              class="form-input"
              placeholder="مثال: شركة س"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>
          <div class="form-group">
            <label class="form-label">تقييم العميل</label>
            <input
              v-model.number="formData.Rating"
              type="number"
              min="1"
              max="5"
              class="form-input"
              placeholder="5"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>
          <div class="form-group full-width">
            <label class="form-label">ملاحظات العميل</label>
            <input
              v-model="formData.ClientFeedback"
              type="text"
              class="form-input"
              placeholder="مثال: عمل ممتاز"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">إعدادات إضافية</h2>
            <p class="section-subtitle">حالة المشروع وخيارات العرض</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">حالة المشروع</label>
            <input
              v-model="formData.Status"
              type="text"
              class="form-input"
              placeholder="مثال: مكتمل"
              :readonly="isViewOnly"
              :disabled="isViewOnly"
            />
          </div>
          <div class="form-group checkbox-group">
            <label class="form-label">خيارات العرض</label>
            <div class="checkbox-group-container">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.IsActive" :disabled="isViewOnly" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">نشر المشروع (IsActive)</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.IsFeatured" :disabled="isViewOnly" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">مشروع مميز (IsFeatured)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading || isViewOnly" class="submit-btn">
          <svg v-if="!loading && !isViewOnly" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else-if="loading" class="spinner"></div>
          {{ loading ? 'جاري حفظ التعديلات...' : isViewOnly ? 'وضع المشاهدة فقط 👁️' : 'حفظ التعديلات' }}
        </button>
        <router-link to="/projects" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { showViewOnlyMessage } from '@/utils/roleHandler';
import { storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores/projects';
import { useTechnologiesStore } from '@/stores/technologies';
import { useNotification } from '@/composables/useNotification';

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();
const technologiesStore = useTechnologiesStore();
const { success, error } = useNotification();

const authStore = useAuthStore();
const isGuest = computed(() => authStore.isGuest);
const isViewOnly = computed(() => isGuest.value || route.query.mode === 'view');

const { technologies, loading: technologiesLoading } = storeToRefs(technologiesStore);

const loading = ref(false);
const pageLoading = ref(true);
const projectId = route.params.id;

if (isViewOnly.value) {
  showViewOnlyMessage();
}

// 1. تحديث تعريف البيانات ليشمل الصور
const formData = reactive({
  Title: '',
  ShortDescription: '',
  FullDescription: '',
  ProjectType: '',
  ThumbnailUrl: '',
  GithubUrl: '',
  LiveDemoUrl: '',
  YouTubeVideoUrl: '',
  StartDate: '',
  EndDate: null,
  DisplayOrder: 0,
  IsFeatured: false,
  IsActive: true,
  TechnologyIds: [],
  ProjectImages: [], // ✅ إضافة مصفوفة الصور هنا
  ClientName: '',
  ClientFeedback: '',
  Rating: null,
  Status: '',
});

const loadProjectData = (project) => {
  console.log('🔍 Loading project data:', project);

  formData.Title = project.title || project.titleAr || '';
  formData.ShortDescription = project.shortDescription || project.shortDescriptionAr || '';
  formData.FullDescription = project.fullDescription || project.fullDescriptionAr || '';
  formData.ProjectType = project.projectType || '';
  formData.ThumbnailUrl = project.thumbnailUrl || '';
  formData.GithubUrl = project.githubUrl || '';
  formData.LiveDemoUrl = project.liveDemoUrl || '';
  formData.YouTubeVideoUrl = project.youTubeVideoUrl || project.youtubeVideoUrl || '';

  if (project.startDate) {
    formData.StartDate = project.startDate.split('T')[0];
  }
  if (project.endDate) {
    formData.EndDate = project.endDate.split('T')[0];
  } else {
    formData.EndDate = null;
  }

  formData.DisplayOrder = project.displayOrder || 0;
  formData.IsFeatured = project.isFeatured || false;
  formData.IsActive = project.isActive !== undefined ? project.isActive : true;

  if (project.technologies && Array.isArray(project.technologies)) {
    formData.TechnologyIds = project.technologies.map(t => t.id || t);
  } else {
    formData.TechnologyIds = [];
  }

  // ✅ تحميل الصور الموجودة لضمان إرسالها مرة أخرى عند التعديل
  if (project.projectImages && Array.isArray(project.projectImages)) {
    formData.ProjectImages = project.projectImages.map(img => ({
      ImageUrl: img.imageUrl,
      Caption: img.caption,
      DisplayOrder: img.displayOrder
    }));
  } else {
    formData.ProjectImages = [];
  }

  formData.ClientName = project.clientName || '';
  formData.ClientFeedback = project.clientFeedback || '';
  formData.Rating = project.rating || null;
  formData.Status = project.status || '';
};

onMounted(async () => {
  pageLoading.value = true;
  try {
    await technologiesStore.fetchTechnologies();
    const project = await projectsStore.fetchProjectById(projectId);
    if (!project) throw new Error('المشروع غير موجود');
    loadProjectData(project);
  } catch (err) {
    console.error('❌ Error loading project:', err);
    error(err.message || 'فشل في تحميل بيانات المشروع.');
    router.push('/projects');
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  loading.value = true;

  try {
    if (formData.EndDate === '') {
      formData.EndDate = null;
    }

    // ✅ بناء Payload نظيف بدلاً من إرسال formData مباشرة
    // هذا يضمن تطابق الهيكل مع DTO في السيرفر
    const payload = {
      Id: projectId, // بعض السيرفرات تطلب الـ Id داخل الجسم أيضاً
      Title: formData.Title,
      ShortDescription: formData.ShortDescription,
      FullDescription: formData.FullDescription,
      ProjectType: formData.ProjectType,
      ThumbnailUrl: formData.ThumbnailUrl,
      GithubUrl: formData.GithubUrl,
      LiveDemoUrl: formData.LiveDemoUrl,
      YouTubeVideoUrl: formData.YouTubeVideoUrl,
      StartDate: formData.StartDate,
      EndDate: formData.EndDate,
      IsFeatured: formData.IsFeatured,
      IsActive: formData.IsActive,
      DisplayOrder: formData.DisplayOrder,
      TechnologyIds: formData.TechnologyIds,
      // ✅ إرسال الصور (حتى لو كانت فارغة لتجنب NullReference)
      ProjectImages: formData.ProjectImages.map(img => ({
        ImageUrl: img.ImageUrl,
        Caption: img.Caption,
        DisplayOrder: img.DisplayOrder
      })),
      ClientName: formData.ClientName,
      ClientFeedback: formData.ClientFeedback,
      Rating: formData.Rating
    };

    console.log('📤 Submitting Clean Payload:', payload);

    await projectsStore.updateProject(projectId, payload);
    success('تم تحديث المشروع بنجاح!');
    router.push('/projects');

  } catch (err) {
    console.error('❌ Error updating project:', err);
    if (err.message !== 'GUEST_ACTION_BLOCKED') {
      error(err.message || 'فشل في تحديث المشروع.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #5a67d8;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.edit-icon {
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
  color: white;
  stroke-width: 2;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.form-loading-state {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-loading-state p {
  margin-top: 10px;
  color: #6b7280;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f4f6;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-icon.purple {
  background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
}

.section-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.section-icon.orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.section-icon.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.section-icon svg {
  width: 20px;
  height: 20px;
  color: white;
  stroke-width: 2;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.section-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-right: 4px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-input:disabled,
.form-textarea:disabled,
.form-select:disabled,
.form-input[readonly],
.form-textarea[readonly] {
  background-color: #f9fafb;
  cursor: not-allowed;
  color: #9ca3af;
}

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.input-with-icon .form-input {
  padding-right: 40px;
}

.tech-loading-state {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 14px;
}

.tech-loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.checkbox-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  background: white;
  border: 1px solid #e5e7eb;
}

.checkbox-label:hover {
  background: #f3f4f6;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  transition: all 0.2s;
  flex-shrink: 0;
  position: relative;
}

.checkbox-custom::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  transform: rotate(45deg) scale(1);
}

.checkbox-text {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.checkbox-label input[type="checkbox"]:disabled + .checkbox-custom {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  cursor: not-allowed;
}

.checkbox-label input[type="checkbox"]:disabled + .checkbox-custom::after {
  border-color: #9ca3af;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 0;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-btn svg {
  width: 20px;
  height: 20px;
}

.submit-btn .spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.cancel-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  color: #4b5563;
  background: #f3f4f6;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
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
