export type DayOfWeek =
  | 'ПОНЕДЕЛЬНИК'
  | 'ВТОРНИК'
  | 'СРЕДА'
  | 'ЧЕТВЕРГ'
  | 'ПЯТНИЦА';

export interface RawScheduleEntry {
  ДНИ: DayOfWeek;
  ВРЕМЯ: string;
  День?: string;
  [groupKey: string]: string | undefined;
}

export interface ScheduleItem {
  day: DayOfWeek;
  time: string;
  groupName: string;
  course: string;
  discipline: string;
  teacher?: string;
  period?: string;
}
