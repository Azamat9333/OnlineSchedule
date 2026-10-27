import { DayOfWeek, ScheduleItem } from '../types';

// You can specify your published Google Sheet CSV link directly here:
// Example: export const DEFAULT_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/.../pub?output=csv';
export const DEFAULT_GOOGLE_SHEET_URL = '';

const STORAGE_KEY_CONFIG = 'atfitk_google_config';

export interface GoogleConfig {
  sheetUrl: string;
}

export function loadGoogleConfig(): GoogleConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        sheetUrl: parsed.sheetUrl || DEFAULT_GOOGLE_SHEET_URL,
      };
    }
  } catch (e) {
    console.error('Failed to parse Google Config from storage:', e);
  }
  return {
    sheetUrl: DEFAULT_GOOGLE_SHEET_URL,
  };
}

export function saveGoogleConfig(sheetUrl: string) {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({ sheetUrl }));
  } catch (e) {
    console.error('Failed to save Google Config to storage:', e);
  }
}

/**
 * Standardize Google Sheet link to CSV export URL if user pasted the standard edit URL
 */
export function normalizeSheetCsvUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url) return '';

  if (url.includes('output=csv')) {
    return url;
  }

  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    const gidMatch = url.match(/gid=([0-9]+)/);
    const gid = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid}`;
  }

  return url;
}

/**
 * Simple CSV parser handling quotes and commas/semicolons
 */
function parseCsv(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  const firstLine = csvText.split('\n')[0] || '';
  const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // ignore CR
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.length > 0 && currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

const VALID_DAYS: Record<string, DayOfWeek> = {
  'ПОНЕДЕЛЬНИК': 'ПОНЕДЕЛЬНИК',
  'ПОНЕДЕЛНИК': 'ПОНЕДЕЛЬНИК',
  'ДҮЙСЕНБІ': 'ПОНЕДЕЛЬНИК',
  'ВТОРНИК': 'ВТОРНИК',
  'СЕЙСЕНБІ': 'ВТОРНИК',
  'СРЕДА': 'СРЕДА',
  'СӘРСЕНБІ': 'СРЕДА',
  'ЧЕТВЕРГ': 'ЧЕТВЕРГ',
  'БЕЙСЕНБІ': 'ЧЕТВЕРГ',
  'ПЯТНИЦА': 'ПЯТНИЦА',
  'ЖҰМА': 'ПЯТНИЦА',
};

function normalizeDay(rawDay: string): DayOfWeek {
  const upper = rawDay.trim().toUpperCase();
  for (const [key, val] of Object.entries(VALID_DAYS)) {
    if (upper.includes(key)) {
      return val;
    }
  }
  return 'ПОНЕДЕЛЬНИК';
}

/**
 * Fetch and parse Google Sheet CSV
 */
export async function loadScheduleFromCsv(sheetUrl: string): Promise<ScheduleItem[]> {
  const exportUrl = normalizeSheetCsvUrl(sheetUrl);
  const response = await fetch(exportUrl);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные таблицы (HTTP ${response.status})`);
  }
  const csvText = await response.text();
  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error('Таблица пуста или содержит только строку заголовков');
  }

  const header = rows[0].map((h) => h.toLowerCase().trim());

  const dayIdx = header.findIndex((h) => h.includes('день') || h.includes('дни') || h.includes('күн'));
  const timeIdx = header.findIndex((h) => h.includes('время') || h.includes('сағат') || h.includes('уақыт'));
  const groupIdx = header.findIndex((h) => h.includes('групп') || h.includes('топ'));
  const courseIdx = header.findIndex((h) => h.includes('курс'));
  const teacherIdx = header.findIndex((h) => h.includes('препод') || h.includes('мұғалім') || h.includes('оқытушы'));
  const discIdx = header.findIndex((h) => h.includes('дисцип') || h.includes('предмет') || h.includes('пән') || h.includes('сабақ'));

  const items: ScheduleItem[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawDay = dayIdx !== -1 ? row[dayIdx] : row[0];
    const rawTime = timeIdx !== -1 ? row[timeIdx] : row[1];
    const rawGroup = groupIdx !== -1 ? row[groupIdx] : row[2];
    const rawCourse = courseIdx !== -1 ? row[courseIdx] : '';
    const rawTeacher = teacherIdx !== -1 ? row[teacherIdx] : '';
    const rawDiscipline = discIdx !== -1 ? row[discIdx] : row[row.length - 1];

    if (!rawGroup && !rawDiscipline) continue;

    let disciplineFormatted = rawDiscipline || '';
    if (rawTeacher && !disciplineFormatted.toLowerCase().includes(rawTeacher.toLowerCase())) {
      disciplineFormatted = `${disciplineFormatted} ${rawTeacher}`.trim();
    }

    items.push({
      day: normalizeDay(rawDay || 'ПОНЕДЕЛЬНИК'),
      time: (rawTime || '08.00-09.20').trim(),
      groupName: (rawGroup || '09-000').trim(),
      course: (rawCourse || '').trim(),
      discipline: disciplineFormatted.trim(),
      teacher: (rawTeacher || '').trim(),
    });
  }

  return items;
}
