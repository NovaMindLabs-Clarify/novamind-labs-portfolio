import type { Appointment, Service, Staff } from '../../data/types';
import { formatTime12 } from '../../utils/time';
import { useI18n } from '../../i18n/I18nContext';
import styles from './Ticket.module.css';

interface TicketProps {
  appointment: Appointment;
  service?: Service;
  staff?: Staff;
  showClient?: boolean;
  actions?: React.ReactNode;
}

export function Ticket({ appointment, service, staff, showClient, actions }: TicketProps) {
  const { t, lang } = useI18n();
  return (
    <div className={`${styles.ticket} ${styles[`status-${appointment.status}`]}`}>
      <div className={styles.footer}>
        <span className={styles.code}>{appointment.code}</span>
        <span className={`badge badge-status-${appointment.status}`}>{t(`status.${appointment.status}` as any)}</span>
      </div>
      <span className={styles.time}>{formatTime12(appointment.startTime)}–{formatTime12(appointment.endTime)}</span>
      <span className={styles.meta}>
        {service ? service.name[lang] : appointment.serviceId}
        {staff ? ` · ${staff.name}` : ''}
      </span>
      {showClient && <span className={styles.meta}>{appointment.clientName} · {appointment.clientPhone}</span>}
      {actions && <div className={styles.footer}>{actions}</div>}
    </div>
  );
}
