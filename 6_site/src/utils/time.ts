import type { Appointment, Staff, WeekdayKey } from '../data/types';

const WEEKDAY_KEYS: WeekdayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function weekdayKeyFromISODate(iso: string): WeekdayKey {
  const d = new Date(`${iso}T00:00:00`);
  return WEEKDAY_KEYS[d.getDay()];
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function addMinutes(hhmm: string, minutes: number): string {
  return fromMinutes(toMinutes(hhmm) + minutes);
}

export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function nextNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function formatDayLabel(iso: string, locale: 'en' | 'ru'): { weekday: string; day: string; isToday: boolean } {
  const d = new Date(`${iso}T00:00:00`);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const weekday = d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short' });
  return { weekday, day: String(d.getDate()), isToday };
}

/** Generates candidate slot start times for a staff member on a given date,
 *  in `slotStepMin` increments, marking which are already taken. */
export function buildDaySlots(
  staff: Staff,
  date: string,
  serviceDurationMin: number,
  appointments: Appointment[],
  slotStepMin = 30
): { time: string; available: boolean }[] {
  const dayKey = weekdayKeyFromISODate(date);
  const hours = staff.workingHours[dayKey];
  if (!hours || staff.daysOff.includes(date)) return [];

  const startMin = toMinutes(hours.start);
  const endMin = toMinutes(hours.end);

  const busy = appointments
    .filter((a) => a.staffId === staff.id && a.date === date && a.status !== 'cancelled' && a.status !== 'no-show')
    .map((a) => ({ start: toMinutes(a.startTime), end: toMinutes(a.endTime) }));

  const now = new Date();
  const isToday = date === now.toISOString().slice(0, 10);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots: { time: string; available: boolean }[] = [];
  for (let t = startMin; t + serviceDurationMin <= endMin; t += slotStepMin) {
    const overlaps = busy.some((b) => t < b.end && t + serviceDurationMin > b.start);
    const isPast = isToday && t <= nowMin;
    slots.push({ time: fromMinutes(t), available: !overlaps && !isPast });
  }
  return slots;
}

export function makeBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'BW-';
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
