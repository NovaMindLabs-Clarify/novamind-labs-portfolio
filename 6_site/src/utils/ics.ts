import type { Appointment, Service, Staff } from '../data/types';

export function downloadAppointmentIcs(appt: Appointment, service: Service, staff: Staff): void {
  const dtStart = `${appt.date.replace(/-/g, '')}T${appt.startTime.replace(':', '')}00`;
  const dtEnd = `${appt.date.replace(/-/g, '')}T${appt.endTime.replace(':', '')}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChairTime//Blackwood Barbershop//EN',
    'BEGIN:VEVENT',
    `UID:${appt.code}@chairtime.demo`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${service.name.en} at Blackwood Barbershop`,
    `DESCRIPTION:Barber: ${staff.name}\\nBooking code: ${appt.code}\\nThis is a portfolio demo booking — not a real appointment.`,
    'LOCATION:118 Iron Row\\, Downtown',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chairtime-${appt.code}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
