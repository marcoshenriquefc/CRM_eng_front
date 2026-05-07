import { defineStore } from 'pinia'
import type { Notification } from '~/types/domain'
export const useNotificationStore = defineStore('notifications', { state: () => ({ unreadCount: 0, notifications: [] as Notification[] }) })
