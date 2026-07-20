import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <div className={`${styles.avatar} ${styles[size]}`} aria-hidden="true">
      <span className={styles.initials}>{initialsFrom(name)}</span>
    </div>
  );
}
