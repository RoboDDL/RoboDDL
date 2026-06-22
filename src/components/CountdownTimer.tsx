import { useEffect, useState } from 'react';
import { Language, uiText } from '../i18n';
import { calculateTimeRemaining, calculateTimeRemainingFromUtcMs, getUrgencyTone } from '../utils/dateUtils';

type CountdownTimerProps = {
  language: Language;
  compact?: boolean;
} & (
  | {
      deadline: string;
      timezone: string;
      targetUtcMs?: never;
    }
  | {
      targetUtcMs: number;
      deadline?: never;
      timezone?: never;
    }
);

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function getTimeRemaining(props: CountdownTimerProps) {
  if ('targetUtcMs' in props && typeof props.targetUtcMs === 'number') {
    return calculateTimeRemainingFromUtcMs(props.targetUtcMs);
  }

  return calculateTimeRemaining(props.deadline, props.timezone);
}

function CountdownTimer(props: CountdownTimerProps) {
  const { language, compact = false } = props;
  const deadline = 'deadline' in props ? props.deadline : undefined;
  const timezone = 'timezone' in props ? props.timezone : undefined;
  const targetUtcMs = 'targetUtcMs' in props ? props.targetUtcMs : undefined;
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(props));
  const text = uiText[language];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining(getTimeRemaining(props));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [deadline, targetUtcMs, timezone]);

  const toneClass = getUrgencyTone(timeRemaining.totalSeconds);

  if (compact) {
    if (timeRemaining.isPast) {
      return <div className={`countdown-compact ${toneClass}`}>{text.countdown.passed}</div>;
    }

    return (
      <div className={`countdown-compact ${toneClass}`}>
        {timeRemaining.days}
        {text.countdown.compactDays} {pad(timeRemaining.hours)}
        {text.countdown.compactHours} {pad(timeRemaining.minutes)}
        {text.countdown.compactMinutes} {pad(timeRemaining.seconds)}
        {text.countdown.compactSeconds}
      </div>
    );
  }

  return (
    <div className="countdown-panel">
      {!timeRemaining.isPast ? (
        <div className={`countdown-grid ${toneClass}`}>
          <div>
            <strong className={toneClass}>{timeRemaining.days}</strong>
            <span>{text.countdown.days}</span>
          </div>
          <div>
            <strong className={toneClass}>{timeRemaining.hours}</strong>
            <span>{text.countdown.hours}</span>
          </div>
          <div>
            <strong className={toneClass}>{timeRemaining.minutes}</strong>
            <span>{text.countdown.minutes}</span>
          </div>
          <div>
            <strong className={toneClass}>{timeRemaining.seconds}</strong>
            <span>{text.countdown.seconds}</span>
          </div>
        </div>
      ) : (
        <div className="countdown-passed">{text.countdown.passed}</div>
      )}
    </div>
  );
}

export default CountdownTimer;
