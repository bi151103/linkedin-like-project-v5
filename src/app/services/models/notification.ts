import { NotificationType } from './notification-type';

export interface NotificationBase {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  from: string;
  createdAt: string;
  isRead: boolean;
}
