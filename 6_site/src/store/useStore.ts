import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment, AppointmentStatus, DemoRole, Service, Staff } from '../data/types';
import { SEED_SERVICES, SEED_STAFF, buildSeedAppointments } from '../data/seed';
import { makeBookingCode, addMinutes } from '../utils/time';

interface StoreState {
  services: Service[];
  staff: Staff[];
  appointments: Appointment[];

  demoRole: DemoRole;
  activeStaffId: string | null;

  setDemoRole: (role: DemoRole) => void;
  setActiveStaffId: (id: string | null) => void;

  addAppointment: (input: {
    serviceId: string;
    staffId: string;
    clientName: string;
    clientPhone: string;
    note?: string;
    date: string;
    startTime: string;
  }) => Appointment;

  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, startTime: string) => void;
  findAppointmentByCode: (code: string) => Appointment | undefined;

  upsertService: (service: Service) => void;
  removeService: (id: string) => void;

  upsertStaff: (staff: Staff) => void;
  removeStaff: (id: string) => void;

  resetDemoData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      services: SEED_SERVICES,
      staff: SEED_STAFF,
      appointments: buildSeedAppointments(),

      demoRole: null,
      activeStaffId: null,

      setDemoRole: (role) => set({ demoRole: role }),
      setActiveStaffId: (id) => set({ activeStaffId: id }),

      addAppointment: (input) => {
        const service = get().services.find((s) => s.id === input.serviceId)!;
        const appt: Appointment = {
          id: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          code: makeBookingCode(),
          serviceId: input.serviceId,
          staffId: input.staffId,
          clientName: input.clientName,
          clientPhone: input.clientPhone,
          note: input.note,
          date: input.date,
          startTime: input.startTime,
          endTime: addMinutes(input.startTime, service.durationMin),
          status: 'booked',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ appointments: [...s.appointments, appt] }));
        return appt;
      },

      setAppointmentStatus: (id, status) =>
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        })),

      cancelAppointment: (id) => get().setAppointmentStatus(id, 'cancelled'),

      rescheduleAppointment: (id, date, startTime) =>
        set((s) => ({
          appointments: s.appointments.map((a) => {
            if (a.id !== id) return a;
            const service = s.services.find((sv) => sv.id === a.serviceId)!;
            return { ...a, date, startTime, endTime: addMinutes(startTime, service.durationMin) };
          }),
        })),

      findAppointmentByCode: (code) => get().appointments.find((a) => a.code.toUpperCase() === code.toUpperCase()),

      upsertService: (service) =>
        set((s) => {
          const exists = s.services.some((sv) => sv.id === service.id);
          return {
            services: exists
              ? s.services.map((sv) => (sv.id === service.id ? service : sv))
              : [...s.services, service],
          };
        }),

      removeService: (id) => set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),

      upsertStaff: (staffMember) =>
        set((s) => {
          const exists = s.staff.some((st) => st.id === staffMember.id);
          return {
            staff: exists
              ? s.staff.map((st) => (st.id === staffMember.id ? staffMember : st))
              : [...s.staff, staffMember],
          };
        }),

      removeStaff: (id) => set((s) => ({ staff: s.staff.filter((st) => st.id !== id) })),

      resetDemoData: () =>
        set({
          services: SEED_SERVICES,
          staff: SEED_STAFF,
          appointments: buildSeedAppointments(),
        }),
    }),
    {
      name: 'chairtime-storage',
      partialize: (s) => ({
        services: s.services,
        staff: s.staff,
        appointments: s.appointments,
        demoRole: s.demoRole,
        activeStaffId: s.activeStaffId,
      }),
    }
  )
);
