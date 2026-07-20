import type { CSSProperties } from 'react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import type { Staff, WeekdayKey } from '../../data/types';

const DAYS: WeekdayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABEL: Record<WeekdayKey, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

export function AdminStaff() {
  const { t } = useI18n();
  const staff = useStore((s) => s.staff);
  const upsertStaff = useStore((s) => s.upsertStaff);
  const removeStaff = useStore((s) => s.removeStaff);

  function toggleDay(member: Staff, day: WeekdayKey) {
    const hours = { ...member.workingHours };
    if (hours[day]) {
      delete hours[day];
    } else {
      hours[day] = { start: '09:00', end: '18:00' };
    }
    upsertStaff({ ...member, workingHours: hours });
  }

  function updateHour(member: Staff, day: WeekdayKey, field: 'start' | 'end', value: string) {
    const current = member.workingHours[day];
    if (!current) return;
    upsertStaff({ ...member, workingHours: { ...member.workingHours, [day]: { ...current, [field]: value } } });
  }

  function addNew() {
    const id = `staff-${Date.now()}`;
    upsertStaff({
      id,
      name: 'New Barber',
      role: { en: 'Barber', ru: 'Барбер' },
      photoSeed: `blackwood-new-${Date.now()}`,
      workingHours: { mon: { start: '09:00', end: '18:00' }, tue: { start: '09:00', end: '18:00' } },
      daysOff: [],
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span className="eyebrow">{t('admin.nav.staff')}</span>
          <h2 style={{ margin: 0 }}>{t('admin.staff.title')}</h2>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={addNew}>{t('admin.staff.new')}</button>
      </div>
      <p style={{ color: 'var(--brass)', fontSize: '0.8rem', marginTop: 8 }}>{t('admin.staff.hoursNote')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
        {staff.map((member) => (
          <div key={member.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <input
                value={member.name}
                onChange={(e) => upsertStaff({ ...member, name: e.target.value })}
                style={{ ...inputStyle, fontFamily: 'var(--font-display)', textTransform: 'uppercase', width: 220 }}
              />
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeStaff(member.id)}>{t('common.delete')}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              {DAYS.map((day) => {
                const hours = member.workingHours[day];
                return (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => toggleDay(member, day)}
                      style={{
                        ...inputStyle,
                        textAlign: 'left',
                        background: hours ? 'rgba(76,122,94,0.14)' : 'rgba(176,80,58,0.12)',
                        color: hours ? 'var(--moss)' : 'var(--rust)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                      }}
                    >
                      {DAY_LABEL[day]} {hours ? '' : `· ${t('admin.staff.dayOff')}`}
                    </button>
                    {hours && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input type="time" value={hours.start} onChange={(e) => updateHour(member, day, 'start', e.target.value)} style={{ ...inputStyle, fontSize: '0.76rem' }} />
                        <input type="time" value={hours.end} onChange={(e) => updateHour(member, day, 'end', e.target.value)} style={{ ...inputStyle, fontSize: '0.76rem' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  padding: '7px 10px',
  borderRadius: 6,
  border: '1px solid var(--border-soft)',
  background: 'var(--charcoal-surface-2)',
  color: 'var(--bone)',
  fontSize: '0.86rem',
};
