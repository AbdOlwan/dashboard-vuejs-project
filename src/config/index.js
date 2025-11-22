// src/config/index.js
export default {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7224/api',
    timeout: 10000,
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Portfolio Dashboard',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  },

  // Pagination
  pagination: {
    itemsPerPage: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // File Upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocTypes: ['application/pdf'],
  },

  // Date Format
  dateFormat: {
    display: 'DD/MM/YYYY',
    api: 'YYYY-MM-DD',
    displayWithTime: 'DD/MM/YYYY HH:mm',
  },

  // Sidebar Menu Items
  sidebarMenu: [
    {
      name: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      order: 1
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: 'FolderKanban',
      order: 2
    },
    {
      name: 'Skills',
      path: '/skills',
      icon: 'Code',
      order: 3
    },
    {
      name: 'Experiences',
      path: '/experiences',
      icon: 'Briefcase',
      order: 4
    },
    {
      name: 'Education',
      path: '/education',
      icon: 'GraduationCap',
      order: 5
    },
    {
      name: 'Certifications',
      path: '/certifications',
      icon: 'Award',
      order: 6
    },
    {
      name: 'Technologies',
      path: '/technologies',
      icon: 'Cpu',
      order: 7
    },
    {
      name: 'ContactMessages',
      path: '/contact-messages',
      icon: 'Mail',
      order: 8,
      badge: 'unreadCount' // Will show unread count
    },
    {
      name: 'Testimonials',
      path: '/testimonials',
      icon: 'MessageSquare',
      order: 9
    },
    {
      name: 'AboutMe',
      path: '/about-me',
      icon: 'User',
      order: 10
    },
    {
      name: 'SocialMedia',
      path: '/social-media',
      icon: 'Share2',
      order: 11
    },
    {
      name: 'SiteSettings',
      path: '/settings',
      icon: 'Settings',
      order: 12
    }
  ],

  // Project Types
  projectTypes: [
    { value: 'Web', label: 'موقع ويب' },
    { value: 'Mobile', label: 'تطبيق موبايل' },
    { value: 'Desktop', label: 'تطبيق سطح مكتب' },
    { value: 'API', label: 'API' },
    { value: 'Other', label: 'أخرى' }
  ],

  // Employment Types
  employmentTypes: [
    { value: 'FullTime', label: 'دوام كامل' },
    { value: 'PartTime', label: 'دوام جزئي' },
    { value: 'Contract', label: 'عقد' },
    { value: 'Freelance', label: 'عمل حر' },
    { value: 'Internship', label: 'تدريب' }
  ],

  // Skill Categories
  skillCategories: [
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Database', label: 'Database' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Tools', label: 'Tools' },
    { value: 'SoftSkills', label: 'Soft Skills' }
  ],

  // Technology Categories
  technologyCategories: [
    { value: 'Language', label: 'لغة برمجة' },
    { value: 'Framework', label: 'إطار عمل' },
    { value: 'Library', label: 'مكتبة' },
    { value: 'Tool', label: 'أداة' },
    { value: 'Database', label: 'قاعدة بيانات' },
    { value: 'Platform', label: 'منصة' }
  ],

  // Social Media Platforms
  socialMediaPlatforms: [
    { value: 'LinkedIn', label: 'LinkedIn', icon: 'linkedin' },
    { value: 'GitHub', label: 'GitHub', icon: 'github' },
    { value: 'Twitter', label: 'Twitter', icon: 'twitter' },
    { value: 'Facebook', label: 'Facebook', icon: 'facebook' },
    { value: 'Instagram', label: 'Instagram', icon: 'instagram' },
    { value: 'YouTube', label: 'YouTube', icon: 'youtube' },
    { value: 'Medium', label: 'Medium', icon: 'medium' },
    { value: 'Dev.to', label: 'Dev.to', icon: 'dev' }
  ]
};
