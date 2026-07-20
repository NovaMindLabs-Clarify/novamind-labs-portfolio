import type { CSSProperties } from 'react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import type { Service, ServiceCategory } from '../../data/types';

const CATEGORIES: ServiceCategory[] = ['hair', 'beard', 'combo', 'shave', 'kids'];

export function AdminServices() {
  const { t, lang } = useI18n();
  const services = useStore((s) => s.services);
  const upsertService = useStore((s) => s.upsertService);
  const removeService = useStore((s) => s.removeService);

  function update(service: Service, patch: Partial<Service>) {
    upsertService({ ...service, ...patch });
  }

  function addNew() {
    const id = `svc-${Date.now()}`;
    upsertService({
      id,
      name: { en: 'New Service', ru: 'Новая услуга' },
      durationMin: 30,
      price: 30,
      category: 'hair',
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span className="eyebrow">{t('admin.nav.services')}</span>
          <h2 style={{ margin: 0 }}>{t('admin.services.title')}</h2>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={addNew}>{t('admin.services.new')}</button>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-soft)' }}>
              <th style={{ padding: '8px 10px' }}>{t('admin.services.name')}</th>
              <th style={{ padding: '8px 10px' }}>{t('admin.services.category')}</th>
              <th style={{ padding: '8px 10px' }}>{t('admin.services.duration')}</th>
              <th style={{ padding: '8px 10px' }}>{t('admin.services.price')}</th>
              <th style={{ padding: '8px 10px' }}></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <td style={{ padding: '8px 10px' }}>
                  <input
                    value={s.name[lang]}
                    onChange={(e) => update(s, { name: { ...s.name, [lang]: e.target.value } })}
                    style={inputStyle}
                  />
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <select value={s.category} onChange={(e) => update(s, { category: e.target.value as ServiceCategory })} style={inputStyle}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{t(`step1.tab.${c}` as any)}</option>)}
                  </select>
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <input
                    type="number"
                    min={5}
                    value={s.durationMin}
                    onChange={(e) => update(s, { durationMin: Number(e.target.value) })}
                    style={{ ...inputStyle, width: 70 }}
                  />
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <input
                    type="number"
                    min={0}
                    value={s.price}
                    onChange={(e) => update(s, { price: Number(e.target.value) })}
                    style={{ ...inputStyle, width: 70 }}
                  />
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeService(s.id)}>{t('common.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  width: '100%',
};
