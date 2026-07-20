export type LocalizedText = { en: string; ru: string };

export type ServiceCategory = 'hair' | 'beard' | 'combo' | 'shave' | 'kids';

export interface Service {
  id: string;
  name: LocalizedText;
  durationMin: number;
  price: number;
  category: ServiceCategory;
}

export type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface WorkingHours {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

export interface Staff {
  id: string;
  name: string;
  role: LocalizedText;
  photoSeed: string;
  workingHours: Partial<Record<WeekdayKey, WorkingHours>>;
  daysOff: string[]; // ISO dates
}

export type AppointmentStatus =
  | 'booked'
  | 'arrived'
  | 'completed'
  | 'no-show'
  | 'cancelled';

export interface Appointment {
  id: string;
  code: string;
  serviceId: string;
  staffId: string;
  clientName: string;
  clientPhone: string;
  note?: string;
  date: string;       // ISO YYYY-MM-DD
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"
  status: AppointmentStatus;
  createdAt: string;
}

export type DemoRole = 'client' | 'staff' | 'admin' | null;
