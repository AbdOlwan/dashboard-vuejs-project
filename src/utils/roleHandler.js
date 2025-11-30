// src/utils/roleHandler.js
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

/**
 * معالج إجراءات الزوار - يعرض رسالة ويمنع الإجراء تماماً
 * @param {string} action - نوع الإجراء (add, edit, delete, toggle)
 * @returns {boolean} true إذا كان زائر (يجب منع الإجراء)، false إذا كان أدمن
 */
export const handleGuestAction = (action = 'edit') => {
  const authStore = useAuthStore();

  // ✅ إذا كان Guest، نعرض رسالة ونرجع true لمنع الإجراء
  if (authStore.isGuest) {
    const messages = {
      add: {
        title: '🚫 الإضافة محظورة',
        text: 'لا يمكنك إضافة عناصر جديدة في وضع المشاهدة',
        icon: '➕'
      },
      edit: {
        title: '🚫 التعديل محظور',
        text: 'لا يمكنك تعديل البيانات في وضع المشاهدة',
        icon: '✏️'
      },
      delete: {
        title: '🚫 الحذف محظور',
        text: 'لا يمكنك حذف العناصر في وضع المشاهدة',
        icon: '🗑️'
      },
      toggle: {
        title: '🚫 التعديل محظور',
        text: 'لا يمكنك تغيير الحالة في وضع المشاهدة',
        icon: '🔄'
      }
    };

    const message = messages[action] || messages.edit;

    Swal.fire({
      title: '✨ وضع المشاهدة فقط ✨',
      html: `
        <div style="font-size: 1.1em; line-height: 1.8; color: #4a5568; text-align: center;">
          <div style="font-size: 3em; margin-bottom: 16px;">👀</div>
          <p style="margin-bottom: 12px;">
            <strong style="color: #ef4444; font-size: 1.1em;">${message.title}</strong>
          </p>
          <p style="margin-bottom: 12px; color: #6b7280;">
            ${message.text}
          </p>
          <div style="margin-top: 20px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; font-size: 0.95em;">
            <strong>💡 أنت في وضع الاستكشاف</strong><br/>
            <span style="font-size: 0.9em; opacity: 0.95;">يمكنك المشاهدة والتصفح فقط 🔐</span>
          </div>
        </div>
      `,
      icon: 'warning',
      iconColor: '#ef4444',
      confirmButtonText: 'فهمت 👍',
      confirmButtonColor: '#667eea',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      }
    });

    return true; // منع الإجراء
  }

  return false; // السماح بالإجراء
};

/**
 * رسالة للمشاهدة فقط في صفحات التعديل
 */
export const showViewOnlyMessage = () => {
  const authStore = useAuthStore();

  if (authStore.isGuest) {
    Swal.fire({
      title: '👁️ وضع المشاهدة',
      html: `
        <div style="font-size: 1em; line-height: 1.6; color: #4a5568;">
          <p style="margin-bottom: 12px;">
            أنت الآن تشاهد هذه الصفحة في <strong style="color: #8b5cf6;">وضع القراءة فقط</strong>
          </p>
          <p style="color: #6b7280; font-size: 0.95em;">
            جميع الحقول للعرض فقط ولا يمكن تعديلها 📖
          </p>
        </div>
      `,
      icon: 'info',
      iconColor: '#3b82f6',
      toast: true,
      position: 'top-end',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
};
