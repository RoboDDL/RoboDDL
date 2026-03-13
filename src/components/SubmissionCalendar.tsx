import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { VenueView } from '../data/conferences';

interface SubmissionCalendarProps {
  venues: VenueView[];
  now: Date;
}

interface MonthBucket {
  key: string;
  label: string;
  venues: VenueView[];
}

function getAoeMonthStart(now: Date) {
  const aoeNow = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  return {
    year: aoeNow.getUTCFullYear(),
    month: aoeNow.getUTCMonth(),
  };
}

function getMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function getMonthLabel(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1)).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getDeadlineMonthKey(venue: VenueView) {
  const [datePart] = venue.countdownDeadline!.split('T');
  const [year, month] = datePart.split('-').map(Number);
  return getMonthKey(year, month - 1);
}

function getDeadlineDay(venue: VenueView) {
  const [datePart] = venue.countdownDeadline!.split('T');
  const [, , day] = datePart.split('-').map(Number);
  return day;
}

function SubmissionCalendar({ venues, now }: SubmissionCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const conferenceVenues = venues.filter((venue) => {
    return (
      venue.venueType === 'conference' &&
      venue.submissionModel === 'deadline' &&
      venue.countdownDeadline
    );
  });

  const start = getAoeMonthStart(now);
  const months: MonthBucket[] = Array.from({ length: 12 }, (_, index) => {
    const monthOffset = start.month + index;
    const year = start.year + Math.floor(monthOffset / 12);
    const month = monthOffset % 12;
    const key = getMonthKey(year, month);

    return {
      key,
      label: getMonthLabel(year, month),
      venues: conferenceVenues
        .filter((venue) => getDeadlineMonthKey(venue) === key)
        .sort((left, right) => (left.countdownDeadline! < right.countdownDeadline! ? -1 : 1)),
    };
  });

  return (
    <section className="calendar-card">
      <button type="button" className="calendar-toggle" onClick={() => setIsOpen((open) => !open)}>
        <div>
          <h2>Monthly overview</h2>
          <p className="calendar-note">What can you submit each month?</p>
        </div>
        <ChevronDown className={isOpen ? 'calendar-chevron open' : 'calendar-chevron'} />
      </button>

      {isOpen ? (
        <div className="calendar-grid">
          {months.map((month) => (
            <article key={month.key} className="calendar-month">
              <div className="calendar-month-head">
                <strong>{month.label}</strong>
                <span>{month.venues.length} venues</span>
              </div>
              {month.venues.length > 0 ? (
                <div className="calendar-list">
                  {month.venues.map((venue) => (
                    <div key={venue.id} className="calendar-item">
                      <span>{venue.title}</span>
                      <span>
                        {venue.countdownLabel === 'Abstract deadline' ? 'Abs.' : 'Paper'} {getDeadlineDay(venue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="calendar-empty">No tracked conference deadlines.</div>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default SubmissionCalendar;
