import { Injectable, ViewContainerRef } from '@angular/core';
import ToastNotificationComponent, {
  ToastClosingType,
  ToastNotificationType,
} from '../components/toast-notification/toast-notification.component';

@Injectable({ providedIn: 'root' })
export default class ToastNotificationService {
  create(
    vcf: ViewContainerRef,
    toastInfo: {
      type?: ToastNotificationType;
      message?: string;
      closeBy?: ToastClosingType;
    } = {
      type: 'success',
      message: '',
      closeBy: 'swiping',
    },
  ) {
    const compRef = vcf.createComponent(ToastNotificationComponent);
    compRef.instance.isVisible.set(true);
    compRef.instance.message.set(toastInfo.message ?? '');
    compRef.instance.type.set(toastInfo.type ?? 'success');
    // compRef.setInput('closeBy', 'clickingCloseBtn');
    compRef.setInput('closeBy', toastInfo.closeBy ?? 'swiping');
    compRef.instance.closeToast.subscribe(() => {
      compRef.instance.isVisible.set(false);
      setTimeout(() => {
        compRef.destroy(); //destroy component after 1s being invisible
      }, 1000);
    });
  }
}
