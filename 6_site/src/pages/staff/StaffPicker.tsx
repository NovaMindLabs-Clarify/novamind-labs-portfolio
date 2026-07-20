import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import { Avatar } from '../../components/shared/Avatar';

export function StaffPicker() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const staff = useStore((s) => s.staff);
  const setDemoRole = useStore((s) => s.setDemoRole);

  useEffect(() => {
    setDemoRole('staff');
  }, [setDemoRole]);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
      <span className="eyebrow">{t('role.staff')}</span>
      <h2>{t('staff.pickTitle')}</h2>
      <p style={{ color: 'var(--bone-dim)', marginBottom: 28 }}>{t('staff.pickSubtitle')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {staff.map((st) => (
          <button
            key={st.id}
            type="button"
            className="card"
            onClick={() => navigate(`/staff/${st.id}`)}
            style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', color: 'var(--bone)', cursor: 'pointer' }}
          >
            <Avatar name={st.name} size="md" />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '0.92rem' }}>{st.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--bone-dim)' }}>{st.role[lang]}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
