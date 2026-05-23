import { NotificationBase } from './notification';

export type NetworkNotification = NotificationBase & {
  type: 'network';
};
