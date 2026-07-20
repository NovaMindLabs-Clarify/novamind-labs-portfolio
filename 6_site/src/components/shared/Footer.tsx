import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <circle cx="13" cy="13" r="12" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
                <line x1="13" y1="13" x2="13" y2="7" stroke="#C9A24B" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="13" y1="13" x2="17.5" y2="15.5" stroke="#C9A24B" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {t('nav.home')}
            </div>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
            <span className={styles.contactLine}>{t('footer.address')}</span>
            <span className={styles.contactLine}>{t('footer.hours')}</span>
            <span className={styles.contactLine}>{t('footer.phone')}</span>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
              <a href="#" aria-label="Facebook"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
              <a href="#" aria-label="TikTok"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg></a>
            </div>
          </div>

          <div className={styles.columns}>
            <div className={styles.col}>
              <h5>{t('footer.colProduct')}</h5>
              <Link to="/book">{t('shell.cta.book')}</Link>
              <Link to="/staff">{t('shell.cta.staff')}</Link>
              <Link to="/admin">{t('shell.cta.admin')}</Link>
            </div>
            <div className={styles.col}>
              <h5>{t('footer.colCompany')}</h5>
              <a href="#">{t('footer.about')}</a>
              <a href="#">{t('footer.caseStudy')}</a>
              <a href="#">{t('footer.contactUs')}</a>
              <a href="#">{t('footer.careers')}</a>
            </div>
            <div className={styles.col}>
              <h5>{t('footer.colLegal')}</h5>
              <a href="#">{t('footer.privacy')}</a>
              <a href="#">{t('footer.terms')}</a>
              <a href="#">{t('footer.cookies')}</a>
              <a href="#">{t('footer.accessibility')}</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{t('footer.rights')}</span>
          <span>{t('footer.credit')}</span>
          <a href="../2_site/index.html">{t('footer.related')}</a>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span className="badge badge-demo">{t('shell.badge')}</span>
        </div>
      </div>
    </footer>
  );
}
