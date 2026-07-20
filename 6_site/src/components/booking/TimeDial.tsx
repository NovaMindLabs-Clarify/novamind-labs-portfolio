import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatTime12 } from '../../utils/time';
import { useI18n } from '../../i18n/I18nContext';
import styles from './TimeDial.module.css';

interface Slot {
  time: string;
  available: boolean;
}

interface TimeDialProps {
  slots: Slot[];
  selected: string | null;
  onSelect: (time: string) => void;
}

export function TimeDial({ slots, selected, onSelect }: TimeDialProps) {
  const { t } = useI18n();
  const [view, setView] = useState<'dial' | 'list'>('dial');
  const reduceMotion = useReducedMotion();
  const groupId = useId();

  const total = slots.length;
  const selectedIndex = slots.findIndex((s) => s.time === selected);
  const selectedAngle = selectedIndex >= 0 ? (selectedIndex / total) * 360 : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.toggle} role="tablist" aria-label="Time picker view">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'dial'}
          className={view === 'dial' ? styles.active : ''}
          onClick={() => setView('dial')}
        >
          {t('step3.dialView')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'list'}
          className={view === 'list' ? styles.active : ''}
          onClick={() => setView('list')}
        >
          {t('step3.listView')}
        </button>
      </div>

      {view === 'dial' && (
        <motion.div
          className={styles.dialOuter}
          role="radiogroup"
          aria-label={t('step3.title')}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.dialFace} />
          <div className={styles.dialCenter} aria-hidden="true" />
          {selectedAngle !== null && (
            <div
              className={styles.hand}
              aria-hidden="true"
              style={{ height: '34%', transform: `rotate(${selectedAngle}deg)` }}
            />
          )}
          {slots.map((slot, i) => {
            const angle = (i / total) * 360;
            const rad = (angle - 90) * (Math.PI / 180);
            const radius = 38;
            const left = 50 + radius * Math.cos(rad);
            const top = 50 + radius * Math.sin(rad);
            const isSelected = slot.time === selected;
            return (
              <button
                key={slot.time}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={formatTime12(slot.time)}
                id={`${groupId}-${slot.time}`}
                className={`${styles.mark} ${isSelected ? styles.selected : ''}`}
                style={{ left: `${left}%`, top: `${top}%` }}
                disabled={!slot.available}
                onClick={() => slot.available && onSelect(slot.time)}
              >
                {formatTime12(slot.time).replace(' ', '\n')}
              </button>
            );
          })}
        </motion.div>
      )}

      <div className={`${styles.list} ${view === 'dial' ? styles.hiddenOnDial : ''}`} role="radiogroup" aria-label={t('step3.title')}>
        {slots.map((slot) => {
          const isSelected = slot.time === selected;
          return (
            <button
              key={slot.time}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.listItem} ${isSelected ? styles.selected : ''}`}
              disabled={!slot.available}
              onClick={() => slot.available && onSelect(slot.time)}
            >
              {formatTime12(slot.time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
