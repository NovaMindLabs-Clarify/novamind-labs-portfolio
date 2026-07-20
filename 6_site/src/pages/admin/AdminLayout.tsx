import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  const { t } = useI18n();
  const setDemoRole = useStore((s) => s.setDemoRole);

  useEffect(() => {
    setDemoRole('admin');
  }, [setDemoRole]);

  const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : '');

  return (
    <div className={styles.wrap}>
      <nav className={styles.sidebar} aria-label="Admin navigation">
        <NavLink to="/admin" end className={linkClass}>{t('admin.nav.overview')}</NavLink>
        <NavLink to="/admin/services" className={linkClass}>{t('admin.nav.services')}</NavLink>
        <NavLink to="/admin/staff" className={linkClass}>{t('admin.nav.staff')}</NavLink>
        <NavLink to="/admin/bookings" className={linkClass}>{t('admin.nav.bookings')}</NavLink>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
