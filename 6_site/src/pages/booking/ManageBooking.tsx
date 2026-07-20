import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import { Ticket } from '../../components/shared/Ticket';

export function ManageBooking() {
  const params = useParams<{ code?: string }>();
  const { t } = useI18n();
  const [codeInput, setCodeInput] = useState(params.code || '');
  const [searched, setSearched] = useState(!!params.code);

  const findByCode = useStore((s) => s.findAppointmentByCode);
  const services = useStore((s) => s.services);
  const staff = useStore((s) => s.staff);
  const cancelAppointment = useStore((s) => s.cancelAppointment);

  const appointment = searched ? findByCode(codeInput) : undefined;
  const service = services.find((s) => s.id === appointment?.serviceId);
  const staffMember = staff.find((s) => s.id === appointment?.staffId);

  const canCancel = appointment && ['booked'].includes(appointment.status);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <span className="eyebrow">{t('manage.title')}</span>
      <h2>{t('manage.details')}</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder={t('manage.codePh')}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-soft)', background: 'var(--charcoal-surface-2)', color: 'var(--bone)',
          }}
        />
        <button type="button" className="btn btn-primary" onClick={() => setSearched(true)}>{t('manage.find')}</button>
      </div>

      {searched && !appointment && <div className="empty-state">{t('manage.notFound')}</div>}

      {appointment && service && staffMember && (
        <div>
          <Ticket appointment={appointment} service={service} staff={staffMember} showClient />
          {canCancel && (
            <button type="button" className="btn btn-danger" style={{ marginTop: 16 }} onClick={() => cancelAppointment(appointment.id)}>
              {t('common.cancel')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
