import { useEffect, useState } from 'react';
import { calculateTimeRemaining, formatTimeRemaining, getUrgencyTone } from '../utils/dateUtils';

interface CountdownTimerProps {
  deadline: string;
  timezone: string;
  compact?: boolean;
}

function CountdownTimer({ deadline, timezone, compact = false }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(deadline, timezone),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(deadline, timezone));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [deadline, timezone]);

  const toneClass = getUrgencyTone(timeRemaining.totalSeconds);

  if (compact) {
    return <div className={`countdown-compact ${toneClass}`}>{formatTimeRemaining(timeRemaining)}</div>;
  }

  return (
    <div className="countdown-panel">
      {!timeRemaining.isPast ? (
        <div className={`countdown-grid ${toneClass}`}>
          <div>
            <strong className={toneClass}>{timeRemaining.days}</strong>
            <span>D</span>
          </div>
          <div>
            <strong className={toneClass}>{timeRemaining.hours}</strong>
            <span>H</span>
          </div>
          <div>
            <strong className={toneClass}>{timeRemaining.minutes}</strong>
            <span>M</span>
          </div>
          <div>
            <strong className={toneClass}>{timeRemaining.seconds}</strong>
            <span>S</span>
          </div>
        </div>
      ) : (
        <div className="countdown-passed">Deadline passed</div>
      )}
    </div>
  );
}

export default CountdownTimer;
