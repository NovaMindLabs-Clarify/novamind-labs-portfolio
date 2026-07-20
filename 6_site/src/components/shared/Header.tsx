import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useStore } from '../../store/useStore';
import styles from './Header.module.css';

export function Header() {
  const { t, lang, setLang } = useI18n();
  const demoRole = useStore((s) => s.demoRole);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="ChairTime home">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <circle cx="13" cy="13" r="12" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
            <line x1="13" y1="13" x2="13" y2="7" stroke="#C9A24B" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="13" y1="13" x2="17.5" y2="15.5" stroke="#C9A24B" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {t('nav.home')}
        </Link>

        <div className={styles.right}>
          {demoRole && (
            <span className={styles.roleInfo}>
              {t('nav.viewingAs')}: <strong>{t(`role.${demoRole}` as any)}</strong>
            </span>
          )}
          <div className={styles.langSwitch} aria-label="Language switch">
            <button type="button" className={lang === 'en' ? styles.active : ''} onClick={() => setLang('en')}>EN</button>
            <button type="button" className={lang === 'ru' ? styles.active : ''} onClick={() => setLang('ru')}>RU</button>
          </div>
        </div>
      </div>
    </header>
  );
}
