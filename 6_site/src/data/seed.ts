import type { Service, Staff, Appointment } from './types';

// Services carried over 1:1 from 2_site (Blackwood Barbershop landing page)
export const SEED_SERVICES: Service[] = [
  { id: 'svc-classic', name: { en: 'Classic Haircut', ru: 'Классическая стрижка' }, durationMin: 40, price: 32, category: 'hair' },
  { id: 'svc-beard', name: { en: 'Beard Trim & Shape', ru: 'Стрижка и форма бороды' }, durationMin: 25, price: 20, category: 'beard' },
  { id: 'svc-combo', name: { en: 'Cut + Beard Combo', ru: 'Стрижка + борода' }, durationMin: 55, price: 45, category: 'combo' },
  { id: 'svc-shave', name: { en: 'Hot Towel Shave', ru: 'Бритьё горячим полотенцем' }, durationMin: 35, price: 35, category: 'shave' },
  { id: 'svc-kids', name: { en: 'Kids Cut (Under 12)', ru: 'Детская стрижка (до 12 лет)' }, durationMin: 25, price: 22, category: 'kids' },
  { id: 'svc-buzz', name: { en: 'Buzz Cut', ru: 'Стрижка машинкой' }, durationMin: 20, price: 25, category: 'hair' },
];

// Barbers carried over 1:1 from 2_site
export const SEED_STAFF: Staff[] = [
  {
    id: 'staff-marcus',
    name: 'Marcus Reid',
    role: { en: 'Owner & Master Barber', ru: 'Владелец и мастер-барбер' },
    photoSeed: 'blackwood-barber1',
    workingHours: {
      mon: { start: '09:00', end: '18:00' }, tue: { start: '09:00', end: '18:00' },
      wed: { start: '09:00', end: '18:00' }, thu: { start: '09:00', end: '18:00' },
      fri: { start: '09:00', end: '19:00' }, sat: { start: '10:00', end: '16:00' },
    },
    daysOff: [],
  },
  {
    id: 'staff-diego',
    name: 'Diego Alvarez',
    role: { en: 'Senior Barber', ru: 'Старший барбер' },
    photoSeed: 'blackwood-barber2',
    workingHours: {
      mon: { start: '10:00', end: '19:00' }, tue: { start: '10:00', end: '19:00' },
      wed: { start: '10:00', end: '19:00' }, thu: { start: '10:00', end: '19:00' },
      fri: { start: '10:00', end: '19:00' }, sat: { start: '10:00', end: '16:00' },
    },
    daysOff: [],
  },
  {
    id: 'staff-theo',
    name: 'Theo Brooks',
    role: { en: 'Fades & Beard Specialist', ru: 'Специалист по фейдам и бороде' },
    photoSeed: 'blackwood-barber3',
    workingHours: {
      tue: { start: '09:00', end: '18:00' }, wed: { start: '09:00', end: '18:00' },
      thu: { start: '09:00', end: '18:00' }, fri: { start: '09:00', end: '18:00' },
      sat: { start: '09:00', end: '17:00' },
    },
    daysOff: [],
  },
  {
    id: 'staff-sam',
    name: 'Sam Whitaker',
    role: { en: 'Barber', ru: 'Барбер' },
    photoSeed: 'blackwood-barber4',
    workingHours: {
      mon: { start: '09:00', end: '17:00' }, wed: { start: '09:00', end: '17:00' },
      thu: { start: '09:00', end: '17:00' }, fri: { start: '09:00', end: '17:00' },
      sat: { start: '10:00', end: '16:00' },
    },
    daysOff: [],
  },
];

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function makeCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'BW-';
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const CLIENT_NAMES = [
  'Ryan Coleman', 'Adam Foster', 'Chris Nolan', 'Mike Sanders', 'James Ortiz',
  'Daniel Reyes', 'Tom Baxter', 'Leo Martin', 'Noah Price', 'Ethan Cole',
];

// Deterministic-ish seed appointments across the next 7 days so dashboards
// aren't empty on first load.
export function buildSeedAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  const slotsByDay = [
    { dayOffset: 0, staffId: 'staff-marcus', serviceId: 'svc-classic', start: '10:00', status: 'completed' as const },
    { dayOffset: 0, staffId: 'staff-marcus', serviceId: 'svc-combo', start: '11:00', status: 'arrived' as const },
    { dayOffset: 0, staffId: 'staff-diego', serviceId: 'svc-beard', start: '10:30', status: 'completed' as const },
    { dayOffset: 0, staffId: 'staff-diego', serviceId: 'svc-shave', start: '14:00', status: 'booked' as const },
    { dayOffset: 0, staffId: 'staff-theo', serviceId: 'svc-buzz', start: '09:30', status: 'no-show' as const },
    { dayOffset: 0, staffId: 'staff-sam', serviceId: 'svc-classic', start: '13:00', status: 'booked' as const },
    { dayOffset: 1, staffId: 'staff-marcus', serviceId: 'svc-combo', start: '10:00', status: 'booked' as const },
    { dayOffset: 1, staffId: 'staff-diego', serviceId: 'svc-classic', start: '15:00', status: 'booked' as const },
    { dayOffset: 2, staffId: 'staff-theo', serviceId: 'svc-beard', start: '11:00', status: 'booked' as const },
    { dayOffset: 2, staffId: 'staff-sam', serviceId: 'svc-shave', start: '14:30', status: 'booked' as const },
    { dayOffset: 3, staffId: 'staff-marcus', serviceId: 'svc-classic', start: '09:30', status: 'booked' as const },
    { dayOffset: 4, staffId: 'staff-diego', serviceId: 'svc-combo', start: '12:00', status: 'booked' as const },
    { dayOffset: 5, staffId: 'staff-theo', serviceId: 'svc-buzz', start: '10:00', status: 'booked' as const },
    { dayOffset: 6, staffId: 'staff-sam', serviceId: 'svc-classic', start: '11:30', status: 'booked' as const },
  ];

  slotsByDay.forEach((slot, i) => {
    const service = SEED_SERVICES.find((s) => s.id === slot.serviceId)!;
    appointments.push({
      id: `seed-${i}`,
      code: makeCode(),
      serviceId: slot.serviceId,
      staffId: slot.staffId,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      clientPhone: '+1 (555) 000-01' + String(i).padStart(2, '0'),
      date: isoDateOffset(slot.dayOffset),
      startTime: slot.start,
      endTime: addMinutes(slot.start, service.durationMin),
      status: slot.status,
      createdAt: new Date().toISOString(),
    });
  });

  return appointments;
}
