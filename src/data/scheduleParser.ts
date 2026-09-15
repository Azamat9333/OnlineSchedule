import { DayOfWeek, RawScheduleEntry, ScheduleItem } from '../types';
import rawData from './scheduleRaw.json';

export const DAYS: DayOfWeek[] = [
  'ПОНЕДЕЛЬНИК',
  'ВТОРНИК',
  'СРЕДА',
  'ЧЕТВЕРГ',
  'ПЯТНИЦА',
];

function cleanDiscipline(disciplineText: string): {
  fullDisciplineText: string;
  period?: string;
} {
  let period: string | undefined;
  let text = disciplineText.trim();

  // Match period like "До 12.03.24г."
  const periodMatch = text.match(/(\s*До\s+\d{2}\.\d{2}\.\d{2}г\.\s*)$/i);
  if (periodMatch) {
    period = periodMatch[0].trim();
    text = text.substring(0, periodMatch.index).trim();
  }

  // Remove PM or OOM prefix if present
  const codePrefixMatch = text.match(/^(ПМ|ООМ)-\d+\s/);
  if (codePrefixMatch) {
    text = text.replace(codePrefixMatch[0], '').trim();
  }

  return { fullDisciplineText: text, period };
}

export function parseRawSchedule(entries: RawScheduleEntry[]): ScheduleItem[] {
  const result: ScheduleItem[] = [];

  entries.forEach((row) => {
    const time = row.ВРЕМЯ;
    const day = row.ДНИ;

    Object.keys(row).forEach((key) => {
      if (['ДНИ', 'ВРЕМЯ', 'День', ''].includes(key)) return;
      const rawVal = row[key];
      if (!rawVal || rawVal.trim() === '') return;

      const courseMatch = key.match(/((\d)\s*курс)/i);
      const course = courseMatch ? courseMatch[1] : 'Курс не указан';

      const groupMatch = key.match(/\d{2}-\d{3}/);
      const groupName = groupMatch ? groupMatch[0] : key.substring(0, 15).trim();

      const parts = rawVal.split('/').map((s) => s.trim()).filter((s) => s.length > 0);
      let weekParity: string[] = [];
      if (parts.length === 2) {
        weekParity = [' (нечетное)', ' (четное)'];
      }

      parts.forEach((part, idx) => {
        const { fullDisciplineText, period } = cleanDiscipline(part);
        const fullDiscipline =
          fullDisciplineText + (weekParity[idx] || '') + (period ? ` (${period})` : '');

        if (fullDisciplineText.length > 0) {
          result.push({
            day,
            time,
            groupName,
            course,
            discipline: fullDiscipline,
            teacher: '',
            period: undefined,
          });
        }
      });
    });
  });

  return result;
}

export const scheduleItems: ScheduleItem[] = parseRawSchedule(rawData as unknown as RawScheduleEntry[]);
