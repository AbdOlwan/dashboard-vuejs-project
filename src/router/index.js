// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Lazy loading for better performance
const Login = () => import('@/views/auth/LoginView.vue');
const Dashboard = () => import('@/views/dashboard/DashboardView.vue');
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue');

// Projects
const ProjectsList = () => import('@/views/projects/ProjectsList.vue');
const ProjectCreate = () => import('@/views/projects/ProjectCreate.vue');
const ProjectEdit = () => import('@/views/projects/ProjectEdit.vue');

// Skills
const SkillsList = () => import('@/views/skills/SkillsList.vue');
const SkillCreate = () => import('@/views/skills/SkillCreate.vue');
const SkillEdit = () => import('@/views/skills/SkillEdit.vue');

// Experiences
const ExperiencesList = () => import('@/views/experiences/ExperiencesList.vue');
const ExperienceCreate = () => import('@/views/experiences/ExperienceCreate.vue');
const ExperienceEdit = () => import('@/views/experiences/ExperienceEdit.vue');

// Education
const EducationList = () => import('@/views/education/EducationList.vue');
const EducationCreate = () => import('@/views/education/EducationCreate.vue');
const EducationEdit = () => import('@/views/education/EducationEdit.vue');

// Certifications
const CertificationsList = () => import('@/views/certifications/CertificationsList.vue');
const CertificationCreate = () => import('@/views/certifications/CertificationCreate.vue');
const CertificationEdit = () => import('@/views/certifications/CertificationEdit.vue');

// Technologies
const TechnologiesList = () => import('@/views/technologies/TechnologiesList.vue');
const TechnologyCreate = () => import('@/views/technologies/TechnologyCreate.vue');
const TechnologyEdit = () => import('@/views/technologies/TechnologyEdit.vue');

// Contact Messages
const ContactMessagesList = () => import('@/views/contact-messages/ContactMessagesList.vue');
const ContactMessageView = () => import('@/views/contact-messages/ContactMessageView.vue');

// Testimonials
const TestimonialsList = () => import('@/views/testimonials/TestimonialsList.vue');
const TestimonialCreate = () => import('@/views/testimonials/TestimonialCreate.vue');
const TestimonialEdit = () => import('@/views/testimonials/TestimonialEdit.vue');

// About Me
const AboutMe = () => import('@/views/about-me/AboutMe.vue');

// Site Settings
const SiteSettings = () => import('@/views/site-settings/SiteSettings.vue');

// Social Media
const SocialMediaList = () => import('@/views/social-media/SocialMediaList.vue');
const SocialMediaCreate = () => import('@/views/social-media/SocialMediaCreate.vue');
const SocialMediaEdit = () => import('@/views/social-media/SocialMediaEdit.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth Routes
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guestOnly: true,
        title: 'تسجيل الدخول'
      }
    },

    // Dashboard Routes
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard,
          meta: {
            title: 'لوحة التحكم',
            icon: 'LayoutDashboard'
          }
        },

        // Projects Routes
        {
          path: 'projects',
          name: 'Projects',
          component: ProjectsList,
          meta: {
            title: 'المشاريع',
            icon: 'FolderKanban'
          }
        },
        {
          path: 'projects/create',
          name: 'ProjectCreate',
          component: ProjectCreate,
          meta: {
            title: 'إضافة مشروع جديد',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'projects/:id/edit',
          name: 'ProjectEdit',
          component: ProjectEdit,
          meta: {
            title: 'تعديل المشروع',
            breadcrumb: 'تعديل'
          }
        },

        // Skills Routes
        {
          path: 'skills',
          name: 'Skills',
          component: SkillsList,
          meta: {
            title: 'المهارات',
            icon: 'Code'
          }
        },
        {
          path: 'skills/create',
          name: 'SkillCreate',
          component: SkillCreate,
          meta: {
            title: 'إضافة مهارة جديدة',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'skills/:id/edit',
          name: 'SkillEdit',
          component: SkillEdit,
          meta: {
            title: 'تعديل المهارة',
            breadcrumb: 'تعديل'
          }
        },

        // Experiences Routes
        {
          path: 'experiences',
          name: 'Experiences',
          component: ExperiencesList,
          meta: {
            title: 'الخبرات العملية',
            icon: 'Briefcase'
          }
        },
        {
          path: 'experiences/create',
          name: 'ExperienceCreate',
          component: ExperienceCreate,
          meta: {
            title: 'إضافة خبرة جديدة',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'experiences/:id/edit',
          name: 'ExperienceEdit',
          component: ExperienceEdit,
          meta: {
            title: 'تعديل الخبرة',
            breadcrumb: 'تعديل'
          }
        },

        // Education Routes
        {
          path: 'education',
          name: 'Education',
          component: EducationList,
          meta: {
            title: 'التعليم',
            icon: 'GraduationCap'
          }
        },
        {
          path: 'education/create',
          name: 'EducationCreate',
          component: EducationCreate,
          meta: {
            title: 'إضافة تعليم جديد',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'education/:id/edit',
          name: 'EducationEdit',
          component: EducationEdit,
          meta: {
            title: 'تعديل التعليم',
            breadcrumb: 'تعديل'
          }
        },

        // Certifications Routes
        {
          path: 'certifications',
          name: 'Certifications',
          component: CertificationsList,
          meta: {
            title: 'الشهادات',
            icon: 'Award'
          }
        },
        {
          path: 'certifications/create',
          name: 'CertificationCreate',
          component: CertificationCreate,
          meta: {
            title: 'إضافة شهادة جديدة',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'certifications/:id/edit',
          name: 'CertificationEdit',
          component: CertificationEdit,
          meta: {
            title: 'تعديل الشهادة',
            breadcrumb: 'تعديل'
          }
        },

        // Technologies Routes
        {
          path: 'technologies',
          name: 'Technologies',
          component: TechnologiesList,
          meta: {
            title: 'التقنيات',
            icon: 'Cpu'
          }
        },
        {
          path: 'technologies/create',
          name: 'TechnologyCreate',
          component: TechnologyCreate,
          meta: {
            title: 'إضافة تقنية جديدة',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'technologies/:id/edit',
          name: 'TechnologyEdit',
          component: TechnologyEdit,
          meta: {
            title: 'تعديل التقنية',
            breadcrumb: 'تعديل'
          }
        },

        // Contact Messages Routes
        {
          path: 'contact-messages',
          name: 'ContactMessages',
          component: ContactMessagesList,
          meta: {
            title: 'رسائل التواصل',
            icon: 'Mail'
          }
        },
        {
          path: 'contact-messages/:id',
          name: 'ContactMessageView',
          component: ContactMessageView,
          meta: {
            title: 'عرض الرسالة',
            breadcrumb: 'عرض'
          }
        },

        // Testimonials Routes
        {
          path: 'testimonials',
          name: 'Testimonials',
          component: TestimonialsList,
          meta: {
            title: 'آراء العملاء',
            icon: 'MessageSquare'
          }
        },
        {
          path: 'testimonials/create',
          name: 'TestimonialCreate',
          component: TestimonialCreate,
          meta: {
            title: 'إضافة رأي جديد',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'testimonials/:id/edit',
          name: 'TestimonialEdit',
          component: TestimonialEdit,
          meta: {
            title: 'تعديل الرأي',
            breadcrumb: 'تعديل'
          }
        },

        // About Me
        {
          path: 'about-me',
          name: 'AboutMe',
          component: AboutMe,
          meta: {
            title: 'عني',
            icon: 'User'
          }
        },

        // Social Media Routes
        {
          path: 'social-media',
          name: 'SocialMedia',
          component: SocialMediaList,
          meta: {
            title: 'وسائل التواصل',
            icon: 'Share2'
          }
        },
        {
          path: 'social-media/create',
          name: 'SocialMediaCreate',
          component: SocialMediaCreate,
          meta: {
            title: 'إضافة وسيلة تواصل',
            breadcrumb: 'إضافة'
          }
        },
        {
          path: 'social-media/:id/edit',
          name: 'SocialMediaEdit',
          component: SocialMediaEdit,
          meta: {
            title: 'تعديل وسيلة التواصل',
            breadcrumb: 'تعديل'
          }
        },

        // Site Settings
        {
          path: 'settings',
          name: 'SiteSettings',
          component: SiteSettings,
          meta: {
            title: 'إعدادات الموقع',
            icon: 'Settings'
          }
        }
      ]
    },

    // 404 Page
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: 'الصفحة غير موجودة'
      }
    }
  ]
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Update page title
  document.title = to.meta.title
    ? `${to.meta.title} | لوحة التحكم`
    : 'لوحة التحكم';

  // Auth check
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
