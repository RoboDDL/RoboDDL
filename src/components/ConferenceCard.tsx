import { useState } from 'react';
import { BookOpen, CalendarDays, ChevronDown, ExternalLink, Globe2, MapPin, Star } from 'lucide-react';
import { VenueView } from '../data/conferences';
import {
  getAbstractDeadlineNote,
  getCategoryLabel,
  getCountdownLabel,
  getEstimatedSourceNote,
  getExpandButtonLabel,
  getFavoriteButtonLabel,
  getLocalizedVenue,
  getVenueTypeLabel,
  Language,
  uiText,
} from '../i18n';
import CountdownTimer from './CountdownTimer';
import { formatDeadline } from '../utils/dateUtils';

interface ConferenceCardProps {
  venue: VenueView;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: (venueId: string) => void;
}

function ConferenceCard({ venue, language, isFavorite, onToggleFavorite }: ConferenceCardProps) {
  const title = venue.year ? `${venue.title} ${venue.year}` : venue.title;
  const [isExpanded, setIsExpanded] = useState(false);
  const text = uiText[language];
  const venueInfoLanguage = venue.venueType === 'conference' ? 'en' : language;
  const venueInfoText = uiText[venueInfoLanguage];
  const localizedVenue = getLocalizedVenue(venue, language);
  const isJournal = venue.submissionModel === 'rolling';
  const venueTypeLabel = getVenueTypeLabel(venue.venueType, language);
  const deadlineLabel =
    venue.submissionModel === 'deadline' ? getCountdownLabel(venue.countdownLabel, language) : text.venue.status;
  const categoryLabel = getCategoryLabel(venue.category, language);
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
  const journalMetricItems = [
    hasCcfRank ? `CCF-${venue.ccfRank}` : null,
    hasCaaiRank ? `CAAI-${venue.caaiRank}` : null,
    hasCasPartition ? `CAS-${casDisplayValue}` : null,
    hasJcrQuartile ? `JCR-${jcrDisplayValue}` : null,
  ].filter((item): item is string => Boolean(item));
  const showJournalMetrics = isJournal && journalMetricItems.length > 0;

  return (
    <article className="venue-card">
      <div className="venue-summary-row">
        <div className="venue-summary-main">
          <div>
            <h2>{title}</h2>
            <p className="venue-full-title">{localizedVenue.fullTitle}</p>
            <div className="badge-row">
              {venue.venueType !== 'conference' ? <span className="pill pill-strong">{venueTypeLabel}</span> : null}
              {venue.isNew ? <span className="pill pill-new">{venueInfoText.venue.new}</span> : null}
              {venue.organizationTags?.map((tag) => (
                <span key={tag} className="pill">
                  {tag}
                </span>
              ))}
              {venue.venueType === 'conference' ? <span className="pill">{categoryLabel}</span> : null}
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
                {venue.isEstimated ? <span className="summary-deadline-badge">{text.venue.estimatedShort}</span> : null}
              </div>
              <>
                <strong>{formatDeadline(venue.countdownDeadline!, venue.timezone!)}</strong>
                <CountdownTimer
                  deadline={venue.countdownDeadline!}
                  timezone={venue.timezone!}
                  language={language}
                  compact
                />
              </>
            </div>
          ) : null}
        </div>
        <div className="venue-summary-actions">
          <button
            type="button"
            className={isFavorite ? 'favorite-button active' : 'favorite-button'}
            onClick={() => onToggleFavorite(venue.id)}
            aria-label={getFavoriteButtonLabel(isFavorite, title, language)}
          >
            <Star className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="expand-button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            aria-label={getExpandButtonLabel(isExpanded, title, language)}
          >
            <ChevronDown className={isExpanded ? 'expand-chevron open' : 'expand-chevron'} />
          </button>
        </div>
      </div>

      {isExpanded ? (
        <div className={isJournal ? 'venue-expanded journal-layout' : 'venue-expanded'}>
          <div className={isJournal ? 'venue-main venue-main-journal' : 'venue-main'}>
            <p className="venue-summary">{localizedVenue.summary}</p>

            {venue.submissionModel === 'deadline' ? (
              <div className="venue-meta-grid">
                <>
                  <div className="meta-block">
                    <div className="meta-head">
                      <div className="meta-label">
                        <CalendarDays className="h-4 w-4" />
                        {text.venue.paperDdl}
                      </div>
                      {venue.isEstimated ? <span className="pill pill-warn">{text.venue.estimatedLong}</span> : null}
                    </div>
                    <div className="meta-value">{formatDeadline(venue.paperDeadline!, venue.timezone!)}</div>
                    <div className="meta-sub">
                      {text.venue.normalizedToPrefix} {localizedVenue.normalizedTimezoneLabel}
                    </div>
                  </div>
                  <div className="meta-block">
                    <div className="meta-label">
                      <CalendarDays className="h-4 w-4" />
                      {text.venue.conferenceDates}
                    </div>
                    <div className="meta-value">{localizedVenue.conferenceDates}</div>
                  </div>
                  <div className="meta-block">
                    <div className="meta-label">
                      <MapPin className="h-4 w-4" />
                      {text.venue.location}
                    </div>
                    <div className="meta-value">{localizedVenue.location}</div>
                  </div>
                </>
              </div>
            ) : null}

            {showJournalMetrics ? (
              <div className="venue-meta-grid journal-metrics-grid">
                <div className="meta-block journal-metrics-block">
                  <div className="meta-label">
                    <BookOpen className="h-4 w-4" />
                    {text.venue.journalMetrics}
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
              <span className="source-label">{text.venue.source}</span>
              <a href={venue.sourceUrl} target="_blank" rel="noreferrer">
                {localizedVenue.sourceLabel}
              </a>
              {venue.isEstimated && venue.estimatedFromYear ? (
                <span className="source-note">{getEstimatedSourceNote(venue.estimatedFromYear, venueInfoLanguage)}</span>
              ) : null}
              {venue.abstractDeadline ? (
                <span className="source-note">
                  {getAbstractDeadlineNote(
                    formatDeadline(venue.abstractDeadline, venue.timezone!),
                    venueInfoLanguage,
                  )}
                </span>
              ) : null}
              {!venue.isEstimated && localizedVenue.note ? <span className="source-note">{localizedVenue.note}</span> : null}
            </div>

            {isJournal ? (
              <div className="action-row">
                <a href={venue.homepage} target="_blank" rel="noreferrer" className="action-button primary">
                  <Globe2 className="h-4 w-4" />
                  {text.venue.journalPage}
                </a>
                {venue.specialIssueUrl ? (
                  <a href={venue.specialIssueUrl} target="_blank" rel="noreferrer" className="action-button">
                    <ExternalLink className="h-4 w-4" />
                    {language === 'zh-CN' ? text.venue.specialIssue : venue.specialIssueLabel ?? text.venue.specialIssue}
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
                <div className="side-title">
                  {text.countdown.to} {getCountdownLabel(venue.countdownLabel, language)}
                </div>
                <CountdownTimer deadline={venue.countdownDeadline!} timezone={venue.timezone!} language={language} />
              </>
              <div className="action-row">
                <>
                  <a href={venue.link} target="_blank" rel="noreferrer" className="action-button primary">
                    <ExternalLink className="h-4 w-4" />
                    {text.venue.website}
                  </a>
                  {venue.homepage ? (
                    <a href={venue.homepage} target="_blank" rel="noreferrer" className="action-button">
                      <Globe2 className="h-4 w-4" />
                      {text.venue.seriesPage}
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
