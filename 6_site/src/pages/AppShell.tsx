import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n/I18nContext';
import { useStore } from '../store/useStore';
import { HeroClock } from '../components/shared/HeroClock';

export function AppShell() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const setDemoRole = useStore((s) => s.setDemoRole);

  useEffect(() => {
    setDemoRole(null);
  }, [setDemoRole]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
          flexWrap: 'wrap',
          marginBottom: 48,
        }}
      >
        <motion.div
          style={{ maxWidth: 480, textAlign: 'left', flex: '1 1 380px' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="badge badge-demo">{t('shell.badge')}</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)', marginTop: 20 }}>{t('shell.title')}</h1>
          <p style={{ color: 'var(--bone-dim)', fontSize: '1.02rem', margin: '0 0 8px' }}>
            {t('shell.subtitle')}
          </p>
          <p style={{ color: 'var(--brass)', fontSize: '0.85rem', margin: 0 }}>
            {t('shell.related')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <HeroClock />
        </motion.div>
      </div>

      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 720, margin: '0 auto' }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
      >
        {[
          { label: t('shell.cta.book'), desc: t('role.client'), path: '/book' },
          { label: t('shell.cta.staff'), desc: t('role.staff'), path: '/staff' },
          { label: t('shell.cta.admin'), desc: t('role.admin'), path: '/admin' },
        ].map((item) => (
          <motion.button
            key={item.path}
            type="button"
            className="card"
            onClick={() => navigate(item.path)}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -3, borderColor: 'var(--brass)' }}
            style={{
              padding: '28px 18px',
              cursor: 'pointer',
              color: 'var(--bone)',
              textAlign: 'center',
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 10 }}>{item.desc}</div>
            <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 600, fontSize: '1rem' }}>
              {item.label}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
