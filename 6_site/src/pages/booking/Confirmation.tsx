import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import { downloadAppointmentIcs } from '../../utils/ics';
import { formatTime12 } from '../../utils/time';

export function Confirmation() {
  const { code } = useParams<{ code: string }>();
  const { t, lang } = useI18n();
  const appointment = useStore((s) => s.appointments.find((a) => a.code === code));
  const service = useStore((s) => s.services.find((sv) => sv.id === appointment?.serviceId));
  const staffMember = useStore((s) => s.staff.find((st) => st.id === appointment?.staffId));

  if (!appointment || !service || !staffMember) {
    return <div className="empty-state"><strong>{t('manage.notFound')}</strong></div>;
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <div className="card" style={{ padding: 28, borderColor: 'var(--brass)' }}>
          <span className="eyebrow">{t('confirm.title')}</span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: 'var(--brass)', letterSpacing: '0.06em', margin: '4px 0 14px' }}>
            {appointment.code}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', margin: '0 0 4px' }}>{service.name[lang]}</p>
          <p style={{ color: 'var(--bone-dim)', margin: 0 }}>{staffMember.name}</p>
          <p style={{ color: 'var(--bone-dim)', margin: '0 0 16px' }}>
            {appointment.date} · {formatTime12(appointment.startTime)}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--bone-dim)' }}>{t('confirm.subtitle')}</p>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
        <button type="button" className="btn btn-primary" onClick={() => downloadAppointmentIcs(appointment, service, staffMember)}>
          {t('confirm.addCalendar')}
        </button>
        <Link to="/book" className="btn btn-ghost">{t('confirm.bookAnother')}</Link>
        <Link to={`/manage/${appointment.code}`} className="btn btn-ghost">{t('confirm.manage')}</Link>
      </div>
      <p style={{ fontSize: '0.76rem', color: 'var(--bone-dim)', marginTop: 20 }}>{t('confirm.demoNote')}</p>
    </div>
  );
}
