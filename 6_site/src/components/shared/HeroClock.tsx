import styles from './HeroClock.module.css';

const HOUR_ANGLE = 305; // ~10:10, the classic balanced watch-face position
const MINUTE_ANGLE = 60;

export function HeroClock() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.face}>
        <div className={styles.ring} />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 360;
          const rad = (angle - 90) * (Math.PI / 180);
          const radius = 42;
          const left = 50 + radius * Math.cos(rad);
          const top = 50 + radius * Math.sin(rad);
          return (
            <div
              key={i}
              className={styles.tick}
              style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${angle}deg)` }}
            />
          );
        })}
        <span className={styles.wordmark}>Chair&nbsp;Time</span>
        <div className={styles.hourHand} style={{ transform: `rotate(${HOUR_ANGLE}deg)` }} />
        <div className={styles.minuteHand} style={{ transform: `rotate(${MINUTE_ANGLE}deg)` }} />
        <div className={styles.secondHand} />
        <div className={styles.center} />
      </div>
    </div>
  );
}
