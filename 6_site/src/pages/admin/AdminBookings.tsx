import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import type { AppointmentStatus } from '../../data/types';
import { formatTime12 } from '../../utils/time';

const STATUSES: AppointmentStatus[] = ['booked', 'arrived', 'completed', 'no-show', 'cancelled'];

export function AdminBookings() {
  const { t, lang } = useI18n();
  const appointments = useStore((s) => s.appointments);
  const services = useStore((s) => s.services);
  const staff = useStore((s) => s.staff);
  const cancelAppointment = useStore((s) => s.cancelAppointment);
  const rescheduleAppointment = useStore((s) => s.rescheduleAppointment);

  const [query, setQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => (staffFilter === 'all' ? true : a.staffId === staffFilter))
      .filter((a) => (statusFilter === 'all' ? true : a.status === statusFilter))
      .filter((a) => (dateFilter ? a.date === dateFilter : true))
      .filter((a) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return a.clientName.toLowerCase().includes(q) || a.clientPhone.includes(q) || a.code.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [appointments, staffFilter, statusFilter, dateFilter, query]);

  return (
    <div>
      <span className="eyebrow">{t('admin.nav.bookings')}</span>
      <h2>{t('admin.bookings.title')}</h2>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input placeholder={t('admin.bookings.searchPh')} value={query} onChange={(e) => setQuery(e.target.value)} style={{ ...inputStyle, flex: '1 1 220px' }} />
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={inputStyle} />
        <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} style={inputStyle}>
          <option value="all">{t('admin.bookings.filterStaff')}</option>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="all">{t('admin.bookings.filterStatus')}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s}` as any)}</option>)}
        </select>
      </div>

      {filtered.length === 0 && <div className="empty-state">{t('admin.bookings.empty')}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((appt) => {
          const service = services.find((s) => s.id === appt.serviceId);
          const staffMember = staff.find((s) => s.id === appt.staffId);
          const isRescheduling = reschedulingId === appt.id;
          return (
            <div key={appt.id} className="card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass)', fontSize: '0.8rem' }}>{appt.code}</div>
                <div>{appt.clientName} · {appt.clientPhone}</div>
                <div style={{ color: 'var(--bone-dim)', fontSize: '0.84rem' }}>
                  {service?.name[lang]} · {staffMember?.name} · {appt.date} {formatTime12(appt.startTime)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`badge badge-status-${appt.status}`}>{t(`status.${appt.status}` as any)}</span>
                {appt.status === 'booked' && !isRescheduling && (
                  <>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setReschedulingId(appt.id); setRescheduleDate(appt.date); setRescheduleTime(appt.startTime); }}>
                      {t('common.reschedule')}
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => cancelAppointment(appt.id)}>
                      {t('common.cancel')}
                    </button>
                  </>
                )}
                {isRescheduling && (
                  <>
                    <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} style={inputStyle} />
                    <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} style={inputStyle} />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => { rescheduleAppointment(appt.id, rescheduleDate, rescheduleTime); setReschedulingId(null); }}
                    >
                      {t('common.save')}
                    </button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setReschedulingId(null)}>{t('common.close')}</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '9px 12px',
  borderRadius: 6,
  border: '1px solid var(--border-soft)',
  background: 'var(--charcoal-surface-2)',
  color: 'var(--bone)',
  fontSize: '0.84rem',
} as const;
