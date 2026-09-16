export interface Announcement {
  enabled: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  date?: string;
}

export const ANNOUNCEMENT_CONFIG: Announcement = {
  enabled: true,
  title: '📢 Важное объявление',
  message: 'Внимание студентам и преподавателям: расписание на текущую неделю обновлено! Следите за изменениями в аудиториях.',
  type: 'warning',
  date: 'Обновлено сегодня',
};
