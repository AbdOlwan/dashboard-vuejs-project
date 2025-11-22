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
            <select v-model="formData.ProjectType" required class="form-select">
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
            <input v-model="formData.StartDate" type="date" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">تاريخ الانتهاء</label>
            <input v-model="formData.EndDate" type="date" class="form-input" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <div class="section-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">الإعدادات</h2>
            <p class="section-subtitle">حدد خيارات العرض والنشر</p>
          </div>
        </div>

        <div class="settings-grid">
          <label class="toggle-card">
            <input v-model="formData.IsFeatured" type="checkbox" class="toggle-input" />
            <div class="toggle-content">
              <div class="toggle-icon featured">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h3 class="toggle-title">مشروع مميز</h3>
                <p class="toggle-description">سيظهر في قسم المشاريع المميزة</p>
              </div>
            </div>
            <div class="toggle-switch">
              <span class="toggle-slider"></span>
            </div>
          </label>

          <label class="toggle-card">
            <input v-model="formData.IsActive" type="checkbox" class="toggle-input" />
            <div class="toggle-content">
              <div class="toggle-icon active">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 class="toggle-title">نشط</h3>
                <p class="toggle-description">سيكون المشروع مرئياً للزوار</p>
              </div>
            </div>
            <div class="toggle-switch">
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'جاري حفظ التعديلات...' : 'حفظ التعديلات' }}
        </button>
        <router-link to="/projects" class="cancel-btn">
          إلغاء
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores/projects';
import { useTechnologiesStore } from '@/stores/technologies';
import { useNotification } from '@/composables/useNotification';

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();
const technologiesStore = useTechnologiesStore();
const { success, error } = useNotification();

const { technologies, loading: technologiesLoading } = storeToRefs(technologiesStore);

const loading = ref(false);
const pageLoading = ref(true);
const projectId = route.params.id;

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
  TechnologyIds: [], // تخزين الـ IDs هنا
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    // 1. تحميل التقنيات أولاً
    await technologiesStore.fetchTechnologies();

    // 2. تحميل المشروع
    const project = await projectsStore.fetchProjectById(projectId);

    if (project) {
      // تعيين القيم البسيطة (مع مراعاة حساسية الأحرف في الـ API)
      // عادة ما يعيد الـ C# API الحقول بـ camelCase (مثل title, shortDescription)
      // لذلك نحتاج لتعيينها يدوياً إذا كانت الـ API تعيد camelCase
      formData.Title = project.title || project.Title;
      formData.ShortDescription = project.shortDescription || project.ShortDescription;
      formData.FullDescription = project.fullDescription || project.FullDescription;
      formData.ProjectType = project.projectType || project.ProjectType;
      formData.ThumbnailUrl = project.thumbnailUrl || project.ThumbnailUrl;
      formData.GithubUrl = project.githubUrl || project.GithubUrl;
      formData.LiveDemoUrl = project.liveDemoUrl || project.LiveDemoUrl;
      formData.YouTubeVideoUrl = project.youTubeVideoUrl || project.YouTubeVideoUrl;

      // معالجة التواريخ لتظهر في الـ Input
      formData.StartDate = project.startDate ? project.startDate.split('T')[0] : '';
      formData.EndDate = project.endDate ? project.endDate.split('T')[0] : null;

      formData.DisplayOrder = project.displayOrder || 0;
      formData.IsFeatured = project.isFeatured;
      formData.IsActive = project.isActive;

      // 3. تعيين التقنيات (مهم جداً)
      // المشروع القادم من الـ API يحتوي على مصفوفة technologies (كائنات كاملة)
      // نحن نحتاج فقط الـ IDs لربطها مع الـ Checkboxes
// 3. تعيين التقنيات (مهم جداً)
if (project.technologies && Array.isArray(project.technologies)) {


  // ✅ الكود الجديد (الحل):
  formData.TechnologyIds = project.technologies
    .filter(t => t !== null && t !== undefined) // نتأكد أن العنصر ليس فارغاً
    .map(t => t.id);
}
    } else {
      error('لم يتم العثور على المشروع');
      router.push('/projects');
    }
  } catch (err) {
    error('حدث خطأ أثناء تحميل بيانات المشروع');
    console.error(err);
    router.push('/projects');
  } finally {
    pageLoading.value = false;
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    // التأكد من التاريخ الفارغ
    if (formData.EndDate === '') formData.EndDate = null;

    // تجهيز البيانات للإرسال
    // نرسل فقط الحقول التي يتوقعها الـ Update DTO
    const payload = {
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
      TechnologyIds: formData.TechnologyIds
    };

    await projectsStore.updateProject(projectId, payload);
    success('تم تحديث المشروع بنجاح');
    router.push('/projects');
  } catch (err) {
    error('حدث خطأ أثناء تحديث المشروع');
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* نفس الستايلات الموجودة في ProjectCreate.vue تماماً */
.create-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.header-section { background: white; border-radius: 16px; padding: 24px 28px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 20px; transition: all 0.2s; }
.back-btn:hover { color: #1f2937; gap: 8px; }
.back-btn svg { width: 18px; height: 18px; }
.header-content { display: flex; align-items: center; gap: 16px; }
.icon-wrapper { width: 56px; height: 56px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-wrapper.edit-icon { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); }
.icon-wrapper svg { width: 28px; height: 28px; color: white; stroke-width: 2; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.page-subtitle { font-size: 14px; color: #6b7280; }
.form-loading-state { background: white; border-radius: 16px; padding: 80px 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; color: #6b7280; font-size: 16px; }
.form-loading-state .spinner { width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
.form-container { display: flex; flex-direction: column; gap: 24px; }
.form-section { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
.section-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #f3f4f6; }
.section-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.section-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.section-icon.purple { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.section-icon.green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.section-icon.orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.section-icon svg { width: 24px; height: 24px; color: white; stroke-width: 2; }
.section-title { font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.section-subtitle { font-size: 13px; color: #6b7280; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.form-group { display: flex; flex-direction: column; }
.form-group.full-width { grid-column: 1 / -1; }
.form-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }
.form-label.required::after { content: '*'; color: #ef4444; font-size: 16px; }
.form-input, .form-select, .form-textarea { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: all 0.2s; background: white; }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
.form-textarea { resize: vertical; min-height: 100px; font-family: inherit; }
.form-hint { font-size: 12px; color: #9ca3af; margin-top: 6px; }
.input-with-icon { position: relative; }
.input-with-icon svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #9ca3af; }
.form-input.with-icon { padding-left: 48px; }
.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.toggle-card { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.toggle-card:hover { background: #f3f4f6; border-color: #d1d5db; }
.toggle-input { display: none; }
.toggle-input:checked + .toggle-content + .toggle-switch .toggle-slider { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.toggle-input:checked + .toggle-content + .toggle-switch .toggle-slider::before { transform: translateX(24px); }
.toggle-content { display: flex; align-items: center; gap: 12px; flex: 1; }
.toggle-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.toggle-icon.featured { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
.toggle-icon.active { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.toggle-icon svg { width: 20px; height: 20px; color: white; }
.toggle-title { font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 2px; }
.toggle-description { font-size: 12px; color: #6b7280; }
.toggle-switch { width: 52px; height: 28px; background: #d1d5db; border-radius: 14px; position: relative; transition: all 0.3s; }
.toggle-slider { position: absolute; top: 2px; left: 2px; width: 24px; height: 24px; background: white; border-radius: 50%; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
.toggle-slider::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: white; transition: transform 0.3s; }
.form-actions { display: flex; gap: 12px; padding-top: 8px; }
.submit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 24px; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn svg { width: 20px; height: 20px; }
.submit-btn .spinner { width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.cancel-btn { padding: 14px 32px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.cancel-btn:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

/* أنماط الـ Checkbox والتحميل */
.tech-loading-state { display: flex; align-items: center; gap: 10px; padding: 20px; background: #f9fafb; border-radius: 10px; color: #6b7280; }
.tech-loading-spinner { width: 20px; height: 20px; border: 3px solid #e5e7eb; border-top-color: #667eea; border-radius: 50%; animation: spin 0.8s linear infinite; }
.checkbox-group-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; background: #f9fafb; border: 2px solid #e5e7eb; padding: 16px; border-radius: 10px; max-height: 250px; overflow-y: auto; }
.checkbox-label { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s; user-select: none; }
.checkbox-label:hover { background: #f3f4f6; }
.checkbox-label input[type="checkbox"] { display: none; }
.checkbox-custom { width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 6px; background: white; transition: all 0.2s; flex-shrink: 0; position: relative; }
.checkbox-custom::after { content: ''; position: absolute; top: 2px; left: 6px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg) scale(0); transition: all 0.2s; }
.checkbox-label input[type="checkbox"]:checked + .checkbox-custom { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: #667eea; }
.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after { transform: rotate(45deg) scale(1); }
.checkbox-text { font-size: 14px; font-weight: 500; color: #374151; }
@media (max-width: 768px) { .create-container { padding: 16px; } .header-content { flex-direction: column; text-align: center; } .form-section { padding: 20px; } .section-header { flex-direction: column; text-align: center; } .form-grid { grid-template-columns: 1fr; } .settings-grid { grid-template-columns: 1fr; } .form-actions { flex-direction: column; } }
</style>
