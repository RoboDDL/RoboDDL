export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

const zoneOffsets: Record<string, number> = {
  AoE: -12 * 60,
  PST: -8 * 60,
  PDT: -7 * 60,
  EST: -5 * 60,
  EDT: -4 * 60,
  UTC: 0,
  GMT: 0,
};

function getZoneOffsetMinutes(timezone: string): number {
  if (timezone in zoneOffsets) {
    return zoneOffsets[timezone];
  }

  const match = timezone.match(/^UTC([+-])(\d{1,2})(?::?(\d{2}))?$/);

  if (match) {
    const sign = match[1] === '+' ? 1 : -1;
    const hours = Number(match[2]);
    const minutes = Number(match[3] ?? '0');
    return sign * (hours * 60 + minutes);
  }

  throw new Error(`Unsupported timezone: ${timezone}`);
}

function parseLocalDateTime(dateTime: string) {
  const match = dateTime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (!match) {
    throw new Error(`Unsupported date format: ${dateTime}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] ?? '0'),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatUtcMsInTimezone(utcMs: number, timezone: string): string {
  const offsetMinutes = getZoneOffsetMinutes(timezone);
  const zonedDate = new Date(utcMs + offsetMinutes * 60 * 1000);

  return `${zonedDate.getUTCFullYear()}-${pad(zonedDate.getUTCMonth() + 1)}-${pad(
    zonedDate.getUTCDate(),
  )}T${pad(zonedDate.getUTCHours())}:${pad(zonedDate.getUTCMinutes())}:${pad(
    zonedDate.getUTCSeconds(),
  )}`;
}

export function parseDeadlineToUtcMs(dateTime: string, timezone: string): number {
  const { year, month, day, hour, minute, second } = parseLocalDateTime(dateTime);
  const offsetMinutes = getZoneOffsetMinutes(timezone);

  return (
    Date.UTC(year, month - 1, day, hour, minute, second) - offsetMinutes * 60 * 1000
  );
}

export function shiftLocalDateTimeByYears(dateTime: string, years: number): string {
  const { year, month, day, hour, minute, second } = parseLocalDateTime(dateTime);

  return `${year + years}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

export function convertLocalDateTimeToTimezone(
  dateTime: string,
  fromTimezone: string,
  toTimezone: string,
): string {
  return formatUtcMsInTimezone(parseDeadlineToUtcMs(dateTime, fromTimezone), toTimezone);
}

export function calculateTimeRemaining(deadline: string, timezone: string): TimeRemaining {
  const totalSeconds = Math.floor((parseDeadlineToUtcMs(deadline, timezone) - Date.now()) / 1000);

  if (totalSeconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isPast: true,
    };
  }

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    isPast: false,
  };
}

export function formatTimeRemaining(time: TimeRemaining): string {
  if (time.isPast) {
    return 'Deadline passed';
  }

  return `${time.days}d ${pad(time.hours)}h ${pad(time.minutes)}m ${pad(time.seconds)}s`;
}

export function getUrgencyTone(daysRemaining: number): string {
  if (daysRemaining < 7) {
    return 'text-rose-600';
  }

  if (daysRemaining < 30) {
    return 'text-amber-600';
  }

  return 'text-emerald-600';
}

export function formatDeadline(dateTime: string, timezone: string): string {
  const { year, month, day, hour, minute, second } = parseLocalDateTime(dateTime);
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)} ${timezone}`;
}
