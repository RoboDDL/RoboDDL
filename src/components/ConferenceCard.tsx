import { BookOpen, CalendarDays, ExternalLink, Globe2, MapPin, Star } from 'lucide-react';
import { VenueView } from '../data/conferences';
import CountdownTimer from './CountdownTimer';
import { formatDeadline } from '../utils/dateUtils';

interface ConferenceCardProps {
  venue: VenueView;
  isFavorite: boolean;
  onToggleFavorite: (venueId: string) => void;
}

const categoryTone: Record<VenueView['category'], string> = {
  RAS: 'tone-ras',
  'Robot Learning': 'tone-robot-learning',
  'AI x Robotics': 'tone-ai',
  Journal: 'tone-journal',
};

function ConferenceCard({ venue, isFavorite, onToggleFavorite }: ConferenceCardProps) {
  const title = venue.year ? `${venue.title} ${venue.year}` : venue.title;

  return (
    <article className={`venue-card ${categoryTone[venue.category]}`}>
      <div className="venue-main">
        <div className="venue-head">
          <div>
            <div className="badge-row">
              <span className="pill pill-strong">{venue.venueType}</span>
              <span className="pill">{venue.category}</span>
              <span className="pill">{venue.rank}</span>
              {venue.coreRank ? <span className="pill">CORE {venue.coreRank}</span> : null}
              {venue.caaiRank ? <span className="pill">CAAI {venue.caaiRank}</span> : null}
              {venue.isEstimated ? <span className="pill pill-warn">estimated</span> : null}
            </div>
            <h2>{title}</h2>
            <p className="venue-full-title">{venue.fullTitle}</p>
            <p className="venue-summary">{venue.summary}</p>
          </div>
          <button
            type="button"
            className={isFavorite ? 'favorite-button active' : 'favorite-button'}
            onClick={() => onToggleFavorite(venue.id)}
            aria-label={isFavorite ? `Unfollow ${title}` : `Follow ${title}`}
          >
            <Star className="h-4 w-4" />
            {isFavorite ? 'Following' : 'Follow'}
          </button>
        </div>

        <div className="venue-meta-grid">
          {venue.submissionModel === 'deadline' ? (
            <>
              <div className="meta-block">
                <div className="meta-label">
                  <CalendarDays className="h-4 w-4" />
                  Paper DDL
                </div>
                <div className="meta-value">{formatDeadline(venue.paperDeadline!, venue.timezone!)}</div>
                <div className="meta-sub">All displayed times are normalized to AoE.</div>
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
          ) : (
            <>
              <div className="meta-block">
                <div className="meta-label">
                  <BookOpen className="h-4 w-4" />
                  Submission model
                </div>
                <div className="meta-value">Rolling submission</div>
                <div className="meta-sub">{venue.note}</div>
              </div>
              <div className="meta-block">
                <div className="meta-label">
                  <Globe2 className="h-4 w-4" />
                  Journal metrics
                </div>
                <div className="journal-metrics">
                  <span>CCF: {venue.ccfRank ?? 'N/A'}</span>
                  <span>CAAI: {venue.caaiRank ?? 'N/A'}</span>
                  <span>CAS: {venue.casPartition ?? 'N/A'}</span>
                  <span>JCR: {venue.jcrQuartile ?? 'N/A'}</span>
                </div>
              </div>
            </>
          )}
        </div>

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
      </div>

      <aside className="venue-side">
        {venue.submissionModel === 'deadline' ? (
          <>
            <div className="side-title">Countdown to {venue.countdownLabel}</div>
            <CountdownTimer deadline={venue.countdownDeadline!} timezone={venue.timezone!} />
          </>
        ) : (
          <div className="rolling-panel">
            <div className="side-title">Status</div>
            <strong>Rolling</strong>
            <span>This journal has no single annual deadline and accepts submissions continuously.</span>
          </div>
        )}

        <div className="action-row">
          <a href={venue.link} target="_blank" rel="noreferrer" className="action-button primary">
            <ExternalLink className="h-4 w-4" />
            Website
          </a>
          <a href={venue.homepage} target="_blank" rel="noreferrer" className="action-button">
            <Globe2 className="h-4 w-4" />
            Series Page
          </a>
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
    </article>
  );
}

export default ConferenceCard;
