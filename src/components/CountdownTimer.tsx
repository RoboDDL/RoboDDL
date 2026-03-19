import { useEffect, useState } from 'react';
import { Language, uiText } from '../i18n';
import { calculateTimeRemaining, getUrgencyTone } from '../utils/dateUtils';

interface CountdownTimerProps {
  deadline: string;
  timezone: string;
  language: Language;
  compact?: boolean;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function CountdownTimer({ deadline, timezone, language, compact = false }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(deadline, timezone),
  );
  const text = uiText[language];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(deadline, timezone));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [deadline, timezone]);

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
