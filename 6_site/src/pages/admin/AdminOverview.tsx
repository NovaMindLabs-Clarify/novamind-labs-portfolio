import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import { Ticket } from '../../components/shared/Ticket';
import { Avatar } from '../../components/shared/Avatar';
import { nextNDays } from '../../utils/time';
import styles from './AdminOverview.module.css';

export function AdminOverview() {
  const { t } = useI18n();
  const staff = useStore((s) => s.staff);
  const services = useStore((s) => s.services);
  const appointments = useStore((s) => s.appointments);

  const today = nextNDays(1)[0];
  const weekDays = useMemo(() => nextNDays(7), []);

  const stats = useMemo(() => {
    const todays = appointments.filter((a) => a.date === today && a.status !== 'cancelled');
    const weekly = appointments.filter((a) => weekDays.includes(a.date) && a.status !== 'cancelled');

    const countByStaff = new Map<string, number>();
    weekly.forEach((a) => countByStaff.set(a.staffId, (countByStaff.get(a.staffId) ?? 0) + 1));
    let busiestId: string | null = null;
    let max = -1;
    countByStaff.forEach((count, id) => { if (count > max) { max = count; busiestId = id; } });
    const busiestName = staff.find((s) => s.id === busiestId)?.name ?? '—';

    const resolved = weekly.filter((a) => ['completed', 'no-show'].includes(a.status));
    const noShows = weekly.filter((a) => a.status === 'no-show');
    const noShowRate = resolved.length ? Math.round((noShows.length / resolved.length) * 100) : 0;

    return {
      todayCount: todays.length,
      weekCount: weekly.length,
      busiestName,
      noShowRate,
    };
  }, [appointments, today, weekDays, staff]);

  return (
    <div>
      <span className="eyebrow">{t('admin.nav.overview')}</span>
      <h2>{t('admin.overview.title')}</h2>

      <div className={styles.stats}>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{stats.todayCount}</div>
          <div className={styles.statLabel}>{t('admin.overview.statBookingsToday')}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{stats.weekCount}</div>
          <div className={styles.statLabel}>{t('admin.overview.statBookingsWeek')}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum} style={{ fontSize: '1.05rem' }}>{stats.busiestName}</div>
          <div className={styles.statLabel}>{t('admin.overview.statBusiest')}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statNum}>{stats.noShowRate}%</div>
          <div className={styles.statLabel}>{t('admin.overview.statNoShow')}</div>
        </div>
      </div>

      <div className={styles.board}>
        {staff.map((st) => {
          const items = appointments
            .filter((a) => a.staffId === st.id && a.date === today && a.status !== 'cancelled')
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          return (
            <div key={st.id} className={styles.column}>
              <div className={styles.columnHead}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <Avatar name={st.name} size="sm" />
                </div>
                <div className={styles.columnName}>{st.name}</div>
              </div>
              {items.length === 0 && <div className="empty-state" style={{ padding: 20, fontSize: '0.8rem' }}>{t('staff.empty')}</div>}
              {items.map((appt) => (
                <Ticket key={appt.id} appointment={appt} service={services.find((s) => s.id === appt.serviceId)} showClient />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
