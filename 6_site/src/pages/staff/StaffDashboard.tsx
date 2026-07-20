import { useEffect, useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import { Ticket } from '../../components/shared/Ticket';
import { nextNDays, formatDayLabel } from '../../utils/time';

export function StaffDashboard() {
  const { barberId } = useParams<{ barberId: string }>();
  const { t, lang } = useI18n();
  const staffList = useStore((s) => s.staff);
  const services = useStore((s) => s.services);
  const appointments = useStore((s) => s.appointments);
  const setActiveStaffId = useStore((s) => s.setActiveStaffId);
  const setDemoRole = useStore((s) => s.setDemoRole);
  const setAppointmentStatus = useStore((s) => s.setAppointmentStatus);

  const [range, setRange] = useState<'today' | 'week'>('today');
  const days = useMemo(() => nextNDays(7), []);

  const staffMember = staffList.find((s) => s.id === barberId);

  useEffect(() => {
    setDemoRole('staff');
    if (barberId) setActiveStaffId(barberId);
  }, [barberId, setDemoRole, setActiveStaffId]);

  if (!staffMember) return <Navigate to="/staff" replace />;

  const relevantDays = range === 'today' ? [days[0]] : days;

  const dayGroups = relevantDays.map((d) => ({
    date: d,
    items: appointments
      .filter((a) => a.staffId === staffMember.id && a.date === d && a.status !== 'cancelled')
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  const todayItems = dayGroups[0]?.items ?? [];
  const todayBooked = todayItems.filter((a) => a.status !== 'no-show').length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <span className="eyebrow">{staffMember.name} · {staffMember.role[lang]}</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ margin: 0 }}>{range === 'today' ? t('staff.today') : t('staff.week')}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className={`btn btn-sm ${range === 'today' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRange('today')}>
            {t('staff.today')}
          </button>
          <button type="button" className={`btn btn-sm ${range === 'week' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRange('week')}>
            {t('staff.week')}
          </button>
        </div>
      </div>

      {range === 'today' && (
        <p style={{ color: 'var(--bone-dim)', fontSize: '0.85rem', margin: '4px 0 20px' }}>
          {todayBooked} {t('staff.summary')}
        </p>
      )}

      {dayGroups.every((g) => g.items.length === 0) && <div className="empty-state">{t('staff.empty')}</div>}

      {dayGroups.map((group) =>
        group.items.length === 0 ? null : (
          <div key={group.date} style={{ marginBottom: 24 }}>
            {range === 'week' && (
              <div className="eyebrow" style={{ marginTop: 18 }}>
                {formatDayLabel(group.date, lang).isToday ? t('common.today') : group.date}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.items.map((appt) => {
                const service = services.find((s) => s.id === appt.serviceId);
                return (
                  <Ticket
                    key={appt.id}
                    appointment={appt}
                    service={service}
                    showClient
                    actions={
                      appt.status === 'booked' ? (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setAppointmentStatus(appt.id, 'arrived')}>
                            {t('staff.markArrived')}
                          </button>
                          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setAppointmentStatus(appt.id, 'no-show')}>
                            {t('staff.markNoShow')}
                          </button>
                        </div>
                      ) : appt.status === 'arrived' ? (
                        <button type="button" className="btn btn-sm btn-primary" onClick={() => setAppointmentStatus(appt.id, 'completed')}>
                          {t('staff.markCompleted')}
                        </button>
                      ) : null
                    }
                  />
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
