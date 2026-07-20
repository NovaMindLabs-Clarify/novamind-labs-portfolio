import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useI18n } from '../../i18n/I18nContext';
import { TimeDial } from '../../components/booking/TimeDial';
import { Avatar } from '../../components/shared/Avatar';
import { buildDaySlots, nextNDays, formatDayLabel, formatTime12 } from '../../utils/time';
import type { ServiceCategory } from '../../data/types';
import styles from './BookingWizard.module.css';

const CATEGORIES: ServiceCategory[] = ['hair', 'beard', 'combo', 'shave', 'kids'];
const NO_PREFERENCE = 'any';

export function BookingWizard() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const services = useStore((s) => s.services);
  const staff = useStore((s) => s.staff);
  const appointments = useStore((s) => s.appointments);
  const addAppointment = useStore((s) => s.addAppointment);

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ServiceCategory>('hair');
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const days = useMemo(() => nextNDays(7), []);
  const [date, setDate] = useState(days[0]);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [note, setNote] = useState('');

  const service = services.find((s) => s.id === serviceId) || null;

  const candidateStaff = staffId && staffId !== NO_PREFERENCE ? staff.filter((s) => s.id === staffId) : staff;

  const slots = useMemo(() => {
    if (!service) return [];
    const perStaff = candidateStaff.map((st) => buildDaySlots(st, date, service.durationMin, appointments));
    if (!perStaff.length) return [];
    const timesUnion = new Set<string>();
    perStaff.forEach((list) => list.forEach((sl) => timesUnion.add(sl.time)));
    return Array.from(timesUnion)
      .sort()
      .map((tm) => ({
        time: tm,
        available: perStaff.some((list) => list.find((sl) => sl.time === tm)?.available),
      }));
  }, [service, candidateStaff, date, appointments]);

  function resolveStaffForTime(tm: string): string {
    if (staffId && staffId !== NO_PREFERENCE) return staffId;
    for (const st of staff) {
      const daySlots = buildDaySlots(st, date, service!.durationMin, appointments);
      if (daySlots.find((sl) => sl.time === tm)?.available) return st.id;
    }
    return staff[0].id;
  }

  function nextAvailableLabel(staffMemberId: string): string {
    if (!service) return '';
    for (const d of days) {
      const st = staff.find((s) => s.id === staffMemberId)!;
      const daySlots = buildDaySlots(st, d, service.durationMin, appointments);
      const found = daySlots.find((sl) => sl.available);
      if (found) return `${formatDayLabel(d, lang).isToday ? t('common.today') : formatDayLabel(d, lang).weekday} · ${formatTime12(found.time)}`;
    }
    return t('step2.noSlotsToday');
  }

  function handleConfirm() {
    if (!service || !time || !clientName || !clientPhone) return;
    const resolvedStaffId = resolveStaffForTime(time);
    const appt = addAppointment({
      serviceId: service.id,
      staffId: resolvedStaffId,
      clientName,
      clientPhone,
      note: note || undefined,
      date,
      startTime: time,
    });
    navigate(`/book/confirmation/${appt.code}`);
  }

  const steps = [
    { n: 1, label: t('stepper.service') },
    { n: 2, label: t('stepper.barber') },
    { n: 3, label: t('stepper.time') },
    { n: 4, label: t('stepper.details') },
  ];

  const canNext =
    (step === 1 && !!serviceId) ||
    (step === 2 && !!staffId) ||
    (step === 3 && !!time) ||
    step === 4;

  return (
    <div className={styles.wizard}>
      <nav className={styles.stepper} aria-label="Booking progress">
        {steps.map((s) => (
          <div key={s.n} className={`${styles.stepDot} ${step === s.n ? styles.active : ''} ${step > s.n ? styles.done : ''}`}>
            <span className={styles.stepNum}>{step > s.n ? '✓' : s.n}</span>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className={styles.panel}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 && (
            <div>
              <span className="eyebrow">{t('step1.eyebrow')}</span>
              <h2>{t('step1.title')}</h2>
              <div className={styles.tabs}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} type="button" className={category === cat ? styles.active : ''} onClick={() => setCategory(cat)}>
                    {t(`step1.tab.${cat}` as any)}
                  </button>
                ))}
              </div>
              <div className={styles.grid3}>
                {services.filter((s) => s.category === category).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`card ${styles.choiceCard} ${serviceId === s.id ? styles.selected : ''}`}
                    onClick={() => setServiceId(s.id)}
                  >
                    <div className={styles.serviceTop}>
                      <span className={styles.serviceName}>{s.name[lang]}</span>
                      <span className={styles.servicePrice}>${s.price}</span>
                    </div>
                    <span className={styles.serviceMeta}>{s.durationMin} {t('step1.duration')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <span className="eyebrow">{t('step2.eyebrow')}</span>
              <h2>{t('step2.title')}</h2>
              <div className={styles.grid2}>
                <button
                  type="button"
                  className={`card ${styles.choiceCard} ${styles.barberCard} ${staffId === NO_PREFERENCE ? styles.selected : ''}`}
                  onClick={() => setStaffId(NO_PREFERENCE)}
                >
                  <div>
                    <div className={styles.barberName}>{t('step2.noPreference')}</div>
                    <div className={styles.barberRole}>{t('step2.noPreferenceDesc')}</div>
                  </div>
                </button>
                {staff.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`card ${styles.choiceCard} ${styles.barberCard} ${staffId === st.id ? styles.selected : ''}`}
                    onClick={() => setStaffId(st.id)}
                  >
                    <Avatar name={st.name} size="md" />
                    <div>
                      <div className={styles.barberName}>{st.name}</div>
                      <div className={styles.barberRole}>{st.role[lang]}</div>
                      <div className={styles.barberNext}>{t('step2.nextAvailable')}: {nextAvailableLabel(st.id)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="eyebrow">{t('step3.eyebrow')}</span>
              <h2>{t('step3.title')}</h2>
              <div className={styles.dayStrip} role="listbox" aria-label={t('step3.selectDay')}>
                {days.map((d) => {
                  const info = formatDayLabel(d, lang);
                  return (
                    <button
                      key={d}
                      type="button"
                      role="option"
                      aria-selected={date === d}
                      className={`${styles.dayBtn} ${date === d ? styles.active : ''}`}
                      onClick={() => { setDate(d); setTime(null); }}
                    >
                      <span className={styles.dayWeekday}>{info.isToday ? t('common.today') : info.weekday}</span>
                      <span className={styles.dayNum}>{info.day}</span>
                    </button>
                  );
                })}
              </div>

              {slots.length === 0 || slots.every((s) => !s.available) ? (
                <div className="empty-state">{t('step3.noSlots')}</div>
              ) : (
                <TimeDial slots={slots} selected={time} onSelect={setTime} />
              )}
            </div>
          )}

          {step === 4 && service && (
            <div>
              <span className="eyebrow">{t('step4.eyebrow')}</span>
              <h2>{t('step4.title')}</h2>
              <div className={styles.grid2}>
                <div>
                  <div className={styles.formRow}>
                    <label htmlFor="clientName">{t('step4.name')}</label>
                    <input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('step4.namePh')} required />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="clientPhone">{t('step4.phone')}</label>
                    <input id="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder={t('step4.phonePh')} required />
                  </div>
                  <div className={styles.formRow}>
                    <label htmlFor="note">{t('step4.note')}</label>
                    <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('step4.notePh')} />
                  </div>
                </div>
                <div className={`card ${styles.summaryBox}`} style={{ padding: 18 }}>
                  <div className="eyebrow">{t('step4.summary')}</div>
                  <p style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: 4 }}>{service.name[lang]}</p>
                  <p style={{ color: 'var(--bone-dim)', fontSize: '0.86rem', margin: 0 }}>
                    {staffId && staffId !== NO_PREFERENCE ? staff.find((s) => s.id === staffId)?.name : t('step2.noPreference')}
                  </p>
                  <p style={{ color: 'var(--bone-dim)', fontSize: '0.86rem', margin: 0 }}>
                    {formatDayLabel(date, lang).isToday ? t('common.today') : date} · {time ? formatTime12(time) : ''}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--brass)', fontSize: '1.1rem', marginTop: 10 }}>${service.price}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={styles.footerNav}>
        <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          {t('common.back')}
        </button>
        {step < 4 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            {t('common.next')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={!clientName || !clientPhone}>
            {t('step4.confirm')}
          </button>
        )}
      </div>
    </div>
  );
}
