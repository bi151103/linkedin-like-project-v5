import { NotificationBase } from './notification';

export type MessageNotification = NotificationBase & {
  type: 'message';
};
