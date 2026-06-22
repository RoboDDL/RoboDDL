import { FormEvent, useMemo, useState } from 'react';
import { ChevronDown, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import {
  buildDeadlineDateFromDays,
  createPersonalDeadlineId,
  formatDateTimeInputForTimezone,
  formatDateTimeLocalInput,
  getLocalTimeInputValue,
  parseDateTimeInputInTimezone,
  personalDeadlineKinds,
  personalDeadlineTimezones,
} from '../data/personalDeadlines';
import type { PersonalDeadline, PersonalDeadlineKind, PersonalDeadlineTimezone } from '../data/personalDeadlines';
import { getLocale, Language, uiText } from '../i18n';
import CountdownTimer from './CountdownTimer';

type EntryMode = 'days' | 'date';

export interface PersonalDeadlineVenueOption {
  id: string;
  title: string;
  fullTitle: string;
  venueTypeLabel: string;
  keywords: string[];
}

interface PersonalDeadlinePanelProps {
  deadlines: PersonalDeadline[];
  venueOptions: PersonalDeadlineVenueOption[];
  currentTime: Date;
  language: Language;
  onSaveDeadline: (deadline: PersonalDeadline) => void;
  onDeleteDeadline: (deadlineId: string) => void;
}

function getDefaultDeadlineDate(now: Date) {
  return buildDeadlineDateFromDays(7, '23:59', now) ?? now;
}

function getDaysUntil(deadlineAt: string, now: Date) {
  const totalMs = Date.parse(deadlineAt) - now.getTime();
  return String(Math.max(0, Math.ceil(totalMs / (24 * 60 * 60 * 1000))));
}

function formatPersonalDeadlineDate(deadlineAt: string, locale: string) {
  const deadlineDate = new Date(deadlineAt);

  if (!Number.isFinite(deadlineDate.getTime())) {
    return '';
  }

  return deadlineDate.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getTimezoneLabel(timezone: PersonalDeadlineTimezone, localLabel: string) {
  return timezone === 'Local' ? localLabel : timezone;
}

function PersonalDeadlinePanel({
  deadlines,
  venueOptions,
  currentTime,
  language,
  onSaveDeadline,
  onDeleteDeadline,
}: PersonalDeadlinePanelProps) {
  const text = uiText[language].personalDeadlines;
  const locale = getLocale(language);
  const defaultDeadlineDate = getDefaultDeadlineDate(currentTime);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [kind, setKind] = useState<PersonalDeadlineKind>('review');
  const [venueName, setVenueName] = useState('');
  const [entryMode, setEntryMode] = useState<EntryMode>('days');
  const [daysFromNow, setDaysFromNow] = useState('7');
  const [timeOfDay, setTimeOfDay] = useState('23:59');
  const [deadlineInput, setDeadlineInput] = useState(() => formatDateTimeLocalInput(defaultDeadlineDate));
  const [deadlineTimezone, setDeadlineTimezone] = useState<PersonalDeadlineTimezone>('Local');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [isVenueSuggestOpen, setIsVenueSuggestOpen] = useState(false);

  const sortedDeadlines = useMemo(
    () => [...deadlines].sort((left, right) => Date.parse(left.deadlineAt) - Date.parse(right.deadlineAt)),
    [deadlines],
  );
  const matchedVenueOptions = useMemo(() => {
    const query = venueName.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return venueOptions
      .map((option) => {
        const title = option.title.toLowerCase();
        const fullTitle = option.fullTitle.toLowerCase();
        const keywords = option.keywords.map((keyword) => keyword.toLowerCase());
        let score = Number.POSITIVE_INFINITY;

        if (title === query) {
          score = 0;
        } else if (title.startsWith(query)) {
          score = 1;
        } else if (fullTitle.startsWith(query)) {
          score = 2;
        } else if (title.includes(query)) {
          score = 3;
        } else if (fullTitle.includes(query)) {
          score = 4;
        } else if (keywords.some((keyword) => keyword.includes(query))) {
          score = 5;
        }

        return { option, score };
      })
      .filter((match) => Number.isFinite(match.score))
      .sort((left, right) => left.score - right.score || left.option.title.localeCompare(right.option.title))
      .slice(0, 8)
      .map((match) => match.option);
  }, [venueName, venueOptions]);
  const computedDeadline = useMemo(() => {
    if (!daysFromNow.trim()) {
      return null;
    }

    const parsedDays = Number(daysFromNow);

    if (!Number.isInteger(parsedDays) || parsedDays < 0) {
      return null;
    }

    return buildDeadlineDateFromDays(parsedDays, timeOfDay, currentTime);
  }, [currentTime, daysFromNow, timeOfDay]);
  const computedExactDeadline = useMemo(() => {
    return parseDateTimeInputInTimezone(deadlineInput, deadlineTimezone);
  }, [deadlineInput, deadlineTimezone]);

  const resetForm = () => {
    const nextDefaultDeadline = getDefaultDeadlineDate(new Date());
    setEditingId(null);
    setKind('review');
    setVenueName('');
    setEntryMode('days');
    setDaysFromNow('7');
    setTimeOfDay('23:59');
    setDeadlineInput(formatDateTimeLocalInput(nextDefaultDeadline));
    setDeadlineTimezone('Local');
    setNote('');
    setFormError(null);
    setIsVenueSuggestOpen(false);
  };

  const beginEdit = (deadline: PersonalDeadline) => {
    const deadlineDate = new Date(deadline.deadlineAt);
    const timezone = deadline.timezone ?? 'Local';
    setEditingId(deadline.id);
    setKind(deadline.kind);
    setVenueName(deadline.venueName);
    setEntryMode('date');
    setDaysFromNow(getDaysUntil(deadline.deadlineAt, currentTime));
    setTimeOfDay(getLocalTimeInputValue(deadlineDate));
    setDeadlineTimezone(timezone);
    setDeadlineInput(formatDateTimeInputForTimezone(deadline.deadlineAt, timezone));
    setNote(deadline.note ?? '');
    setFormError(null);
    setIsFormCollapsed(false);
    setIsVenueSuggestOpen(false);
  };

  const handleEntryModeChange = (nextMode: EntryMode) => {
    setEntryMode(nextMode);
    setFormError(null);

    if (nextMode === 'date' && computedDeadline) {
      setDeadlineInput(formatDateTimeLocalInput(computedDeadline));
      setDeadlineTimezone('Local');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedVenueName = venueName.trim();

    if (!trimmedVenueName) {
      setFormError(text.validation.venueRequired);
      return;
    }

    let deadlineDate: Date | null = null;
    let normalizedDaysFromNow: number | undefined;

    if (entryMode === 'days') {
      if (!daysFromNow.trim()) {
        setFormError(text.validation.daysRequired);
        return;
      }

      const parsedDays = Number(daysFromNow);

      if (!Number.isInteger(parsedDays) || parsedDays < 0) {
        setFormError(text.validation.daysRequired);
        return;
      }

      deadlineDate = buildDeadlineDateFromDays(parsedDays, timeOfDay, currentTime);
      normalizedDaysFromNow = parsedDays;
    } else {
      deadlineDate = parseDateTimeInputInTimezone(deadlineInput, deadlineTimezone);
    }

    if (!deadlineDate) {
      setFormError(entryMode === 'date' ? text.validation.dateRequired : text.validation.invalidDate);
      return;
    }

    const existingDeadline = editingId ? deadlines.find((deadline) => deadline.id === editingId) : undefined;
    const nowIso = new Date().toISOString();
    const trimmedNote = note.trim();

    onSaveDeadline({
      id: existingDeadline?.id ?? createPersonalDeadlineId(),
      kind,
      venueName: trimmedVenueName,
      deadlineAt: deadlineDate.toISOString(),
      source: entryMode,
      note: trimmedNote || undefined,
      daysFromNow: normalizedDaysFromNow,
      timezone: entryMode === 'date' ? deadlineTimezone : 'Local',
      createdAt: existingDeadline?.createdAt ?? nowIso,
      updatedAt: nowIso,
    });

    resetForm();
  };

  const selectVenueOption = (option: PersonalDeadlineVenueOption) => {
    setVenueName(option.title);
    setIsVenueSuggestOpen(false);
    setFormError(null);
  };

  return (
    <section className="personal-ddl-panel">
      <form className="personal-ddl-form" onSubmit={handleSubmit}>
        <div className="personal-ddl-form-head">
          <h2>{editingId ? text.editTitle : text.addTitle}</h2>
          <button
            type="button"
            className="personal-ddl-form-toggle"
            onClick={() => setIsFormCollapsed((current) => !current)}
            aria-expanded={!isFormCollapsed}
            aria-label={isFormCollapsed ? text.expandFormButton : text.collapseFormButton}
            title={isFormCollapsed ? text.expandFormButton : text.collapseFormButton}
          >
            <ChevronDown className={isFormCollapsed ? 'h-4 w-4' : 'h-4 w-4 rotate-180'} />
          </button>
        </div>

        <div className={isFormCollapsed ? 'personal-ddl-form-body collapsed' : 'personal-ddl-form-body'}>
          <div className="personal-ddl-field">
            <label>{text.typeLabel}</label>
            <div className="personal-ddl-kind-grid">
              {personalDeadlineKinds.map((deadlineKind) => (
                <button
                  key={deadlineKind}
                  type="button"
                  className={kind === deadlineKind ? 'personal-ddl-kind-tab active' : 'personal-ddl-kind-tab'}
                  onClick={() => setKind(deadlineKind)}
                >
                  {text.kinds[deadlineKind]}
                </button>
              ))}
            </div>
          </div>

          <div className="personal-ddl-field personal-ddl-venue-field">
            <label htmlFor="personal-ddl-venue">{text.venueLabel}</label>
            <input
              id="personal-ddl-venue"
              type="text"
              value={venueName}
              onChange={(event) => {
                setVenueName(event.target.value);
                setIsVenueSuggestOpen(true);
              }}
              onFocus={() => setIsVenueSuggestOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setIsVenueSuggestOpen(false), 120);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsVenueSuggestOpen(false);
                }
              }}
              placeholder={text.venuePlaceholder}
              autoComplete="off"
              role="combobox"
              aria-expanded={isVenueSuggestOpen && matchedVenueOptions.length > 0}
              aria-controls="personal-ddl-venue-suggestions"
            />
            {isVenueSuggestOpen && matchedVenueOptions.length > 0 ? (
              <div id="personal-ddl-venue-suggestions" className="personal-ddl-venue-suggestions" role="listbox">
                {matchedVenueOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="personal-ddl-venue-option"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectVenueOption(option);
                    }}
                    role="option"
                    aria-selected={venueName.trim().toLowerCase() === option.title.toLowerCase()}
                  >
                    <span className="personal-ddl-venue-option-title">
                      <strong>{option.title}</strong>
                      <em>{option.venueTypeLabel}</em>
                    </span>
                    <span className="personal-ddl-venue-option-full">{option.fullTitle}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="personal-ddl-field">
            <label>{text.inputModeLabel}</label>
            <div className="personal-ddl-segmented" role="group" aria-label={text.inputModeLabel}>
              <button
                type="button"
                className={entryMode === 'days' ? 'active' : ''}
                onClick={() => handleEntryModeChange('days')}
              >
                {text.modeDays}
              </button>
              <button
                type="button"
                className={entryMode === 'date' ? 'active' : ''}
                onClick={() => handleEntryModeChange('date')}
              >
                {text.modeDate}
              </button>
            </div>
          </div>

          {entryMode === 'days' ? (
            <div className="personal-ddl-days-row">
              <div className="personal-ddl-field">
                <label htmlFor="personal-ddl-days">{text.daysLabel}</label>
                <div className="personal-ddl-input-affix">
                  <input
                    id="personal-ddl-days"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={daysFromNow}
                    onChange={(event) => setDaysFromNow(event.target.value)}
                  />
                  <span>{text.daysSuffix}</span>
                </div>
              </div>
              <div className="personal-ddl-field">
                <label htmlFor="personal-ddl-time">{text.timeLabel}</label>
                <input
                  id="personal-ddl-time"
                  type="time"
                  value={timeOfDay}
                  onChange={(event) => setTimeOfDay(event.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="personal-ddl-date-row">
              <div className="personal-ddl-field">
                <label htmlFor="personal-ddl-date">{text.dateLabel}</label>
                <input
                  id="personal-ddl-date"
                  type="datetime-local"
                  value={deadlineInput}
                  onChange={(event) => setDeadlineInput(event.target.value)}
                />
              </div>
              <div className="personal-ddl-field">
                <label htmlFor="personal-ddl-timezone">{text.timezoneLabel}</label>
                <select
                  id="personal-ddl-timezone"
                  value={deadlineTimezone}
                  onChange={(event) => setDeadlineTimezone(event.target.value as PersonalDeadlineTimezone)}
                >
                  {personalDeadlineTimezones.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {getTimezoneLabel(timezone, text.timezoneLocal)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="personal-ddl-preview">
            <span>{text.dueLabel}</span>
            <strong>
              {(entryMode === 'days' && computedDeadline
                ? formatPersonalDeadlineDate(computedDeadline.toISOString(), locale)
                : entryMode === 'date' && deadlineInput
                  ? formatPersonalDeadlineDate(computedExactDeadline?.toISOString() ?? '', locale)
                  : '') || text.datePending}
            </strong>
          </div>

          <div className="personal-ddl-field">
            <label htmlFor="personal-ddl-note">{text.noteLabel}</label>
            <textarea
              id="personal-ddl-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={text.notePlaceholder}
              rows={3}
            />
          </div>

          {formError ? <p className="personal-ddl-error">{formError}</p> : null}

          <div className="personal-ddl-form-actions">
            <button type="submit" className="action-button primary">
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? text.saveButton : text.addButton}
            </button>
            {editingId ? (
              <button type="button" className="action-button" onClick={resetForm}>
                <X className="h-4 w-4" />
                {text.cancelButton}
              </button>
            ) : null}
          </div>
        </div>
      </form>

      <div className="personal-ddl-list">
        <div className="personal-ddl-list-head">
          <h2>{text.title}</h2>
        </div>

        {sortedDeadlines.length === 0 ? (
          <div className="personal-ddl-empty">
            <strong>{text.emptyTitle}</strong>
            <span>{text.emptyBody}</span>
          </div>
        ) : (
          <div className="personal-ddl-items">
            {sortedDeadlines.map((deadline) => {
              const deadlineMs = Date.parse(deadline.deadlineAt);
              const isPast = deadlineMs <= currentTime.getTime();

              return (
                <article key={deadline.id} className={isPast ? 'personal-ddl-item past' : 'personal-ddl-item'}>
                  <div className="personal-ddl-item-main">
                    <div className="personal-ddl-item-topline">
                      <span className="pill">{text.kinds[deadline.kind]}</span>
                      {deadline.source === 'date' && deadline.timezone ? (
                        <span className="pill">{getTimezoneLabel(deadline.timezone, text.timezoneLocal)}</span>
                      ) : null}
                      {isPast ? <span className="pill pill-warn">{text.overdueLabel}</span> : null}
                    </div>
                    <h3>{deadline.venueName}</h3>
                    <div className="personal-ddl-item-date">
                      <span>{text.dueLabel}</span>
                      <strong>{formatPersonalDeadlineDate(deadline.deadlineAt, locale)}</strong>
                    </div>
                    {deadline.note ? <p>{deadline.note}</p> : null}
                  </div>
                  <div className="personal-ddl-item-side">
                    <CountdownTimer targetUtcMs={deadlineMs} language={language} compact />
                    <div className="personal-ddl-item-actions">
                      <button
                        type="button"
                        className="personal-ddl-icon-button"
                        onClick={() => beginEdit(deadline)}
                        aria-label={`${text.editButton} ${deadline.venueName}`}
                        title={text.editButton}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="personal-ddl-icon-button danger"
                        onClick={() => onDeleteDeadline(deadline.id)}
                        aria-label={`${text.deleteButton} ${deadline.venueName}`}
                        title={text.deleteButton}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default PersonalDeadlinePanel;
