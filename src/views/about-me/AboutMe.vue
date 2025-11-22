<template>
  <div class="about-container">
    <div v-if="loading" class="loading-state">
      جاري تحميل البيانات...
    </div>

    <div v-else>
      <div class="page-header">
        <div>
          <h2 class="page-title">معلومات عني</h2>
          <p class="page-subtitle">إدارة المعلومات الشخصية والسيرة الذاتية</p>
        </div>
        <button @click="toggleEditMode" class="edit-btn" :disabled="isSaving">
          <span v-if="!isEditMode">تعديل</span>
          <span v-else>إلغاء</span>
        </button>
      </div>

      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
              v-if="form.profileImageUrl"
              :src="form.profileImageUrl"
              alt="Profile"
              class="avatar-img"
              @error="handleImageError"
            />
            <div v-else class="avatar-placeholder">
              <span class="placeholder-text">لا توجد صورة</span>
            </div>
          </div>

          <div v-if="isEditMode" class="mt-3">
            <label class="info-label">رابط الصورة الشخصية</label>
            <input
              v-model="form.profileImageUrl"
              type="text"
              class="info-input w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div class="info-section">
          <form @submit.prevent="saveProfile">
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">الاسم الكامل <span class="required">*</span></label>
                <input
                  v-if="isEditMode"
                  v-model="form.fullName"
                  required
                  type="text"
                  class="info-input"
                />
                <p v-else class="info-value">{{ form.fullName || '---' }}</p>
              </div>

              <div class="info-item">
                <label class="info-label">المسمى الوظيفي <span class="required">*</span></label>
                <input
                  v-if="isEditMode"
                  v-model="form.title"
                  required
                  type="text"
                  class="info-input"
                />
                <p v-else class="info-value">{{ form.title || '---' }}</p>
              </div>

              <div class="info-item">
                <label class="info-label">البريد الإلكتروني <span class="required">*</span></label>
                <input
                  v-if="isEditMode"
                  v-model="form.email"
                  required
                  type="email"
                  class="info-input"
                />
                <p v-else class="info-value">{{ form.email || '---' }}</p>
              </div>

              <div class="info-item">
                <label class="info-label">رقم الهاتف <span class="required">*</span></label>
                <input
                  v-if="isEditMode"
                  v-model="form.phone"
                  required
                  type="tel"
                  class="info-input"
                />
                <p v-else class="info-value">{{ form.phone || '---' }}</p>
              </div>

              <div class="info-item">
                <label class="info-label">الموقع <span class="required">*</span></label>
                <input
                  v-if="isEditMode"
                  v-model="form.location"
                  required
                  type="text"
                  class="info-input"
                />
                <p v-else class="info-value">{{ form.location || '---' }}</p>
              </div>

              <div class="info-item">
                <label class="info-label">رابط السيرة الذاتية (CV)</label>
                <input
                  v-if="isEditMode"
                  v-model="form.cvFileUrl"
                  type="url"
                  class="info-input"
                  placeholder="https://..."
                />
                <p v-else class="info-value">
                  <a v-if="form.cvFileUrl" :href="form.cvFileUrl" target="_blank" class="info-link">عرض الـ CV</a>
                  <span v-else>---</span>
                </p>
              </div>

              <div class="info-item span-2">
                <label class="info-label">رابط فيديو تعريفي</label>
                <input
                  v-if="isEditMode"
                  v-model="form.introVideoUrl"
                  type="url"
                  class="info-input"
                  placeholder="https://youtube.com/..."
                />
                <p v-else class="info-value">
                  <a v-if="form.introVideoUrl" :href="form.introVideoUrl" target="_blank" class="info-link">مشاهدة الفيديو</a>
                  <span v-else>---</span>
                </p>
              </div>
            </div>

            <div class="bio-section">
              <label class="info-label">نبذة عني <span class="required">*</span></label>
              <textarea
                v-if="isEditMode"
                v-model="form.bio"
                required
                rows="5"
                class="info-textarea"
              ></textarea>
              <p v-else class="info-bio">{{ form.bio || 'لم يتم إضافة نبذة تعريفية بعد' }}</p>
            </div>

            <div v-if="errorMessage" class="error-msg">
              {{ errorMessage }}
            </div>
             <div v-if="successMessage" class="success-msg">
              {{ successMessage }}
            </div>

            <div v-if="isEditMode" class="save-section">
              <button type="submit" class="save-btn" :disabled="isSaving">
                {{ isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="mt-4 info-note">
        <p>ملاحظة: لإدارة روابط التواصل الاجتماعي، يرجى الانتقال إلى قسم "وسائل التواصل" من القائمة الجانبية.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import aboutMeService from '@/services/aboutMeService';

const loading = ref(true);
const isEditMode = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// مطابق تماماً لـ AboutMeCreateUpdateDto
const form = reactive({
  fullName: '',
  title: '',
  bio: '',
  profileImageUrl: '',
  introVideoUrl: '',
  cvFileUrl: '',
  phone: '',
  email: '',
  location: ''
});

// جلب البيانات عند فتح الصفحة
const fetchData = async () => {
  loading.value = true;
  try {
    const data = await aboutMeService.get();
    if (data) {
      // تعبئة الفورم بالبيانات القادمة من السيرفر
      Object.assign(form, {
        fullName: data.fullName,
        title: data.title,
        bio: data.bio,
        profileImageUrl: data.profileImageUrl,
        introVideoUrl: data.introVideoUrl,
        cvFileUrl: data.cvFileUrl,
        phone: data.phone,
        email: data.email,
        location: data.location
      });
    } else {
        // في حالة عدم وجود بيانات، يمكن تفعيل وضع التعديل تلقائياً
        isEditMode.value = true;
    }
  } catch (error) {
    console.error('Error fetching about info:', error);
    errorMessage.value = 'حدث خطأ أثناء تحميل البيانات';
  } finally {
    loading.value = false;
  }
};

const toggleEditMode = () => {
  if (isEditMode.value) {
    // عند الإلغاء، نعيد تحميل البيانات الأصلية لإلغاء التغييرات غير المحفوظة
    fetchData();
  }
  isEditMode.value = !isEditMode.value;
  errorMessage.value = '';
  successMessage.value = '';
};

const saveProfile = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // إرسال البيانات للـ Backend
    await aboutMeService.createOrUpdate(form);
    successMessage.value = 'تم حفظ البيانات بنجاح';
    isEditMode.value = false;
  } catch (error) {
    console.error('Error saving profile:', error);
    errorMessage.value = 'حدث خطأ أثناء حفظ البيانات. تأكد من ملء جميع الحقول المطلوبة.';
  } finally {
    isSaving.value = false;
  }
};

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #6b7280;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.edit-btn {
  background-color: #4f46e5;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.edit-btn:disabled {
  background-color: #a5a6f6;
  cursor: not-allowed;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 32px;
  flex-direction: row;
}

.avatar-section {
  flex-shrink: 0;
  width: 200px;
  text-align: center;
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  background-color: #f3f4f6;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  color: #6b7280;
}

.info-section {
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.span-2 {
  grid-column: span 2;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.info-value {
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
  min-height: 24px;
}

.info-input,
.info-textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}

.info-link {
  color: #4f46e5;
  text-decoration: none;
}

.save-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  background-color: #10b981;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.save-btn:disabled {
  background-color: #6ee7b7;
}

.error-msg {
  color: #dc2626;
  margin-top: 10px;
  font-size: 14px;
}
.success-msg {
  color: #10b981;
  margin-top: 10px;
  font-size: 14px;
}

.w-full {
  width: 100%;
}

.mt-3 {
  margin-top: 12px;
}
.mt-4 {
  margin-top: 16px;
}

.info-note {
    font-size: 0.9rem;
    color: #6b7280;
    font-style: italic;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .avatar-section {
    width: 100%;
  }
}
</style>
