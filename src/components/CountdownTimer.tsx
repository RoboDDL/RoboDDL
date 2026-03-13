import { useEffect, useState } from 'react';
import { calculateTimeRemaining, getUrgencyTone } from '../utils/dateUtils';

interface CountdownTimerProps {
  deadline: string;
  timezone: string;
}

function CountdownTimer({ deadline, timezone }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(deadline, timezone),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(deadline, timezone));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [deadline, timezone]);

  const toneClass = getUrgencyTone(timeRemaining.days);

  return (
    <div className="countdown-panel">
      {!timeRemaining.isPast ? (
        <div className={`countdown-grid ${toneClass}`}>
          <div>
            <strong>{timeRemaining.days}</strong>
            <span>D</span>
          </div>
          <div>
            <strong>{timeRemaining.hours}</strong>
            <span>H</span>
          </div>
          <div>
            <strong>{timeRemaining.minutes}</strong>
            <span>M</span>
          </div>
          <div>
            <strong>{timeRemaining.seconds}</strong>
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
