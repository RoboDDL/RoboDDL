import { formatUtcMsInTimezone, parseDeadlineToUtcMs } from '../utils/dateUtils';

export const personalDeadlineStorageKey = 'roboddl:personal-deadlines';

export const personalDeadlineKinds = [
  'review',
  'conference-rebuttal',
  'journal-rebuttal',
  'final-version',
  'other',
] as const;

export const personalDeadlineTimezones = ['Local', 'AoE', 'UTC', 'PST', 'PDT', 'EST', 'EDT', 'GMT', 'UTC+8'] as const;

export type PersonalDeadlineKind = (typeof personalDeadlineKinds)[number];
export type PersonalDeadlineSource = 'days' | 'date';
export type PersonalDeadlineTimezone = (typeof personalDeadlineTimezones)[number];

export interface PersonalDeadline {
  id: string;
  kind: PersonalDeadlineKind;
  venueName: string;
  deadlineAt: string;
  source: PersonalDeadlineSource;
  note?: string;
  daysFromNow?: number;
  timezone?: PersonalDeadlineTimezone;
  createdAt: string;
  updatedAt: string;
}

function isKnownKind(value: unknown): value is PersonalDeadlineKind {
  return typeof value === 'string' && personalDeadlineKinds.includes(value as PersonalDeadlineKind);
}

function isKnownSource(value: unknown): value is PersonalDeadlineSource {
  return value === 'days' || value === 'date';
}

function isKnownTimezone(value: unknown): value is PersonalDeadlineTimezone {
  return typeof value === 'string' && personalDeadlineTimezones.includes(value as PersonalDeadlineTimezone);
}

function normalizeDeadline(value: unknown): PersonalDeadline | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  const venueName = typeof raw.venueName === 'string' ? raw.venueName.trim() : '';
  const deadlineAt = typeof raw.deadlineAt === 'string' ? raw.deadlineAt : '';
  const deadlineMs = Date.parse(deadlineAt);

  if (!id || !venueName || !Number.isFinite(deadlineMs) || !isKnownKind(raw.kind)) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const note = typeof raw.note === 'string' && raw.note.trim() ? raw.note.trim() : undefined;
  const daysFromNow =
    typeof raw.daysFromNow === 'number' && Number.isFinite(raw.daysFromNow)
      ? Math.max(0, Math.floor(raw.daysFromNow))
      : undefined;

  return {
    id,
    kind: raw.kind,
    venueName,
    deadlineAt: new Date(deadlineMs).toISOString(),
    source: isKnownSource(raw.source) ? raw.source : 'date',
    note,
    daysFromNow,
    timezone: isKnownTimezone(raw.timezone) ? raw.timezone : 'Local',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : nowIso,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : nowIso,
  };
}

export function loadPersonalDeadlines(): PersonalDeadline[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(personalDeadlineStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortPersonalDeadlines(parsed.map(normalizeDeadline).filter(Boolean) as PersonalDeadline[]);
  } catch {
    return [];
  }
}

export function savePersonalDeadlines(deadlines: PersonalDeadline[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(personalDeadlineStorageKey, JSON.stringify(sortPersonalDeadlines(deadlines)));
}

export function sortPersonalDeadlines(deadlines: PersonalDeadline[]): PersonalDeadline[] {
  return [...deadlines].sort((left, right) => Date.parse(left.deadlineAt) - Date.parse(right.deadlineAt));
}

export function createPersonalDeadlineId(): string {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `personal-${Date.now().toString(36)}-${randomPart}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateTimeLocalInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function formatDateTimeInputForTimezone(deadlineAt: string, timezone: PersonalDeadlineTimezone): string {
  const deadlineMs = Date.parse(deadlineAt);

  if (!Number.isFinite(deadlineMs)) {
    return '';
  }

  if (timezone === 'Local') {
    return formatDateTimeLocalInput(new Date(deadlineMs));
  }

  return formatUtcMsInTimezone(deadlineMs, timezone).slice(0, 16);
}

export function getLocalTimeInputValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildDeadlineDateFromDays(daysFromNow: number, timeOfDay: string, now = new Date()): Date | null {
  const timeMatch = timeOfDay.match(/^(\d{2}):(\d{2})$/);

  if (!Number.isFinite(daysFromNow) || daysFromNow < 0 || !timeMatch) {
    return null;
  }

  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + Math.floor(daysFromNow));
  deadline.setHours(hours, minutes, 0, 0);
  return deadline;
}

export function parseDateTimeLocalInput(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

export function parseDateTimeInputInTimezone(
  value: string,
  timezone: PersonalDeadlineTimezone,
): Date | null {
  if (!value) {
    return null;
  }

  if (timezone === 'Local') {
    return parseDateTimeLocalInput(value);
  }

  try {
    const deadlineMs = parseDeadlineToUtcMs(value, timezone);
    return Number.isFinite(deadlineMs) ? new Date(deadlineMs) : null;
  } catch {
    return null;
  }
}
