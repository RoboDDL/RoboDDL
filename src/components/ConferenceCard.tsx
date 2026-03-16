import { useState } from 'react';
import { BookOpen, CalendarDays, ChevronDown, ExternalLink, Globe2, MapPin, Star } from 'lucide-react';
import { VenueView } from '../data/conferences';
import CountdownTimer from './CountdownTimer';
import { formatDeadline } from '../utils/dateUtils';

interface ConferenceCardProps {
  venue: VenueView;
  isFavorite: boolean;
  onToggleFavorite: (venueId: string) => void;
}

function ConferenceCard({ venue, isFavorite, onToggleFavorite }: ConferenceCardProps) {
  const title = venue.year ? `${venue.title} ${venue.year}` : venue.title;
  const [isExpanded, setIsExpanded] = useState(false);
  const isJournal = venue.submissionModel === 'rolling';
  const venueTypeLabel = venue.venueType[0].toUpperCase() + venue.venueType.slice(1);
  const deadlineLabel = venue.submissionModel === 'deadline' ? venue.countdownLabel : 'Status';
  const hasCcfRank = Boolean(venue.ccfRank && venue.ccfRank !== 'N/A');
  const hasCaaiRank = Boolean(venue.caaiRank && venue.caaiRank !== 'N/A');
  const hasCasPartition = Boolean(venue.casPartition && venue.casPartition !== 'N/A');
  const hasJcrQuartile = Boolean(venue.jcrQuartile && venue.jcrQuartile !== 'N/A');
  const casDisplayValue = hasCasPartition
    ? venue.casPartition!
        .replace(/^CAS\s*/i, '')
        .replace(/^Q?\s*([1-4])$/i, 'Q$1')
        .trim()
    : '';
  const jcrDisplayValue = hasJcrQuartile ? venue.jcrQuartile!.replace(/^JCR\s*/i, '').trim() : '';
  const normalizedTimezoneLabel = venue.timezone === 'PST' ? 'Pacific Time' : 'AoE';
  const journalMetricItems = [
    hasCcfRank ? `CCF-${venue.ccfRank}:` : null,
    hasCaaiRank ? `CAAI-${venue.caaiRank}:` : null,
    hasCasPartition ? `CAS-${casDisplayValue}:` : null,
    hasJcrQuartile ? `JCR-${jcrDisplayValue}:` : null,
  ].filter((item): item is string => Boolean(item));
  const showJournalMetrics = isJournal && journalMetricItems.length > 0;

  return (
    <article className="venue-card">
      <div className="venue-summary-row">
        <div className="venue-summary-main">
          <div>
            <h2>{title}</h2>
            <p className="venue-full-title">{venue.fullTitle}</p>
            <div className="badge-row">
              {venue.venueType !== 'conference' ? <span className="pill pill-strong">{venueTypeLabel}</span> : null}
              {venue.isNew ? <span className="pill pill-new">NEW</span> : null}
              {venue.organizationTags?.map((tag) => (
                <span key={tag} className="pill">
                  {tag}
                </span>
              ))}
              {venue.venueType === 'conference' ? <span className="pill">{venue.category}</span> : null}
              {hasCcfRank ? <span className="pill">CCF-{venue.ccfRank}</span> : null}
              {hasCaaiRank ? <span className="pill">CAAI-{venue.caaiRank}</span> : null}
              {hasCasPartition ? <span className="pill">CAS-{casDisplayValue}</span> : null}
              {hasJcrQuartile ? <span className="pill">JCR-{jcrDisplayValue}</span> : null}
            </div>
          </div>
          {!isExpanded && venue.submissionModel === 'deadline' ? (
            <div className="summary-deadline">
              <div className="summary-deadline-head">
                <span className="summary-deadline-label">{deadlineLabel}</span>
                {venue.isEstimated ? <span className="summary-deadline-badge">EST.</span> : null}
              </div>
              <>
                <strong>{formatDeadline(venue.countdownDeadline!, venue.timezone!)}</strong>
                <CountdownTimer deadline={venue.countdownDeadline!} timezone={venue.timezone!} compact />
              </>
            </div>
          ) : null}
        </div>
        <div className="venue-summary-actions">
          <button
            type="button"
            className={isFavorite ? 'favorite-button active' : 'favorite-button'}
            onClick={() => onToggleFavorite(venue.id)}
            aria-label={isFavorite ? `Unfollow ${title}` : `Follow ${title}`}
          >
            <Star className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="expand-button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
          >
            <ChevronDown className={isExpanded ? 'expand-chevron open' : 'expand-chevron'} />
          </button>
        </div>
      </div>

      {isExpanded ? (
        <div className={isJournal ? 'venue-expanded journal-layout' : 'venue-expanded'}>
          <div className={isJournal ? 'venue-main venue-main-journal' : 'venue-main'}>
            <p className="venue-summary">{venue.summary}</p>

            {venue.submissionModel === 'deadline' ? (
              <div className="venue-meta-grid">
                <>
                  <div className="meta-block">
                    <div className="meta-head">
                      <div className="meta-label">
                        <CalendarDays className="h-4 w-4" />
                        Paper DDL
                      </div>
                      {venue.isEstimated ? <span className="pill pill-warn">Est.</span> : null}
                    </div>
                    <div className="meta-value">{formatDeadline(venue.paperDeadline!, venue.timezone!)}</div>
                    <div className="meta-sub">All displayed times are normalized to {normalizedTimezoneLabel}.</div>
                  </div>
                  <div className="meta-block">
                    <div className="meta-label">
                      <CalendarDays className="h-4 w-4" />
                      Conference
                    </div>
                    <div className="meta-value">{venue.conferenceDates}</div>
                  </div>
                  <div className="meta-block">
                    <div className="meta-label">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <div className="meta-value">{venue.location}</div>
                  </div>
                </>
              </div>
            ) : null}

            {showJournalMetrics ? (
              <div className="venue-meta-grid journal-metrics-grid">
                <div className="meta-block journal-metrics-block">
                  <div className="meta-label">
                    <BookOpen className="h-4 w-4" />
                    Journal metrics
                  </div>
                  <div className="journal-metrics">
                    {journalMetricItems.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="source-strip">
              <span className="source-label">Source</span>
              <a href={venue.sourceUrl} target="_blank" rel="noreferrer">
                {venue.sourceLabel}
              </a>
              {venue.isEstimated && venue.estimatedFromYear ? (
                <span className="source-note">
                  No official deadline is out yet. This date is estimated from the {venue.estimatedFromYear}
                  paper deadline.
                </span>
              ) : null}
              {venue.abstractDeadline ? (
                <span className="source-note">
                  Abstract deadline: {formatDeadline(venue.abstractDeadline, venue.timezone!)}
                </span>
              ) : null}
              {!venue.isEstimated && venue.note ? <span className="source-note">{venue.note}</span> : null}
            </div>

            {isJournal ? (
              <div className="action-row">
                <a href={venue.homepage} target="_blank" rel="noreferrer" className="action-button primary">
                  <Globe2 className="h-4 w-4" />
                  Journal Page
                </a>
                {venue.specialIssueUrl ? (
                  <a href={venue.specialIssueUrl} target="_blank" rel="noreferrer" className="action-button">
                    <ExternalLink className="h-4 w-4" />
                    {venue.specialIssueLabel ?? 'Special Issue'}
                  </a>
                ) : null}
                {venue.dblp ? (
                  <a
                    href={`https://dblp.org/db/${venue.dblp}.html`}
                    target="_blank"
                    rel="noreferrer"
                    className="action-button"
                  >
                    <BookOpen className="h-4 w-4" />
                    DBLP
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {!isJournal ? (
            <aside className="venue-side">
              <>
                <div className="side-title">Countdown to {venue.countdownLabel}</div>
                <CountdownTimer deadline={venue.countdownDeadline!} timezone={venue.timezone!} />
              </>
              <div className="action-row">
                <>
                  <a href={venue.link} target="_blank" rel="noreferrer" className="action-button primary">
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                  {venue.homepage ? (
                    <a href={venue.homepage} target="_blank" rel="noreferrer" className="action-button">
                      <Globe2 className="h-4 w-4" />
                      Series Page
                    </a>
                  ) : null}
                </>
                {venue.dblp ? (
                  <a
                    href={`https://dblp.org/db/${venue.dblp}.html`}
                    target="_blank"
                    rel="noreferrer"
                    className="action-button"
                  >
                    <BookOpen className="h-4 w-4" />
                    DBLP
                  </a>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default ConferenceCard;
