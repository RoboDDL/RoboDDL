import { useEffect, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { categories, ratingFilters, Category, RatingFilter } from '../data/conferences';

interface FilterPanelProps {
  selectedVenueType: 'All' | 'conference' | 'journal';
  showFavoritesOnly: boolean;
  totalVenueCount: number;
  conferenceCount: number;
  journalCount: number;
  favoriteCount: number;
  onShowAllVenues: () => void;
  onShowConferenceView: () => void;
  onShowJournalView: () => void;
  onShowFavoritesOnlyChange: (value: boolean) => void;
  selectedCategory: 'All' | Category;
  onCategoryChange: (value: 'All' | Category) => void;
  sortBy: 'deadline' | 'title';
  onSortChange: (value: 'deadline' | 'title') => void;
  selectedRatingFilter: RatingFilter;
  onRatingFilterChange: (value: RatingFilter) => void;
}

function FilterPanel({
  selectedVenueType,
  showFavoritesOnly,
  totalVenueCount,
  conferenceCount,
  journalCount,
  favoriteCount,
  onShowAllVenues,
  onShowConferenceView,
  onShowJournalView,
  onShowFavoritesOnlyChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedRatingFilter,
  onRatingFilterChange,
}: FilterPanelProps) {
  const [isRasHelpOpen, setIsRasHelpOpen] = useState(false);
  const rasHelpHideTimeoutRef = useRef<number | null>(null);

  const openRasHelp = () => {
    if (rasHelpHideTimeoutRef.current !== null) {
      window.clearTimeout(rasHelpHideTimeoutRef.current);
      rasHelpHideTimeoutRef.current = null;
    }

    setIsRasHelpOpen(true);
  };

  const scheduleRasHelpClose = () => {
    if (rasHelpHideTimeoutRef.current !== null) {
      window.clearTimeout(rasHelpHideTimeoutRef.current);
    }

    rasHelpHideTimeoutRef.current = window.setTimeout(() => {
      setIsRasHelpOpen(false);
      rasHelpHideTimeoutRef.current = null;
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (rasHelpHideTimeoutRef.current !== null) {
        window.clearTimeout(rasHelpHideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <aside className="control-card space-y-6">
      <section>
        <p className="filter-title">Track</p>
        <div className="chip-row">
          {categories.map((category) =>
            category === 'RAS' ? (
              <div
                key={category}
                className="filter-chip-help"
                onMouseEnter={openRasHelp}
                onMouseLeave={scheduleRasHelpClose}
                onFocusCapture={openRasHelp}
                onBlurCapture={(event) => {
                  const nextFocusTarget = event.relatedTarget as Node | null;

                  if (nextFocusTarget && event.currentTarget.contains(nextFocusTarget)) {
                    return;
                  }

                  scheduleRasHelpClose();
                }}
              >
                <button
                  type="button"
                  className={selectedCategory === category ? 'filter-chip filter-chip-with-help active' : 'filter-chip filter-chip-with-help'}
                  onClick={() => onCategoryChange(category)}
                >
                  <span className="filter-chip-label">{category}</span>
                  <span className="filter-chip-help-icon" aria-hidden="true">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </span>
                </button>
                <div className={isRasHelpOpen ? 'filter-chip-help-popover open' : 'filter-chip-help-popover'} role="tooltip">
                  <p>RAS stands for IEEE Robotics and Automation Society.</p>
                  <a href="https://www.ieee-ras.org/" target="_blank" rel="noreferrer">
                    Learn more on IEEE RAS
                  </a>
                </div>
              </div>
            ) : (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ),
          )}
        </div>
      </section>

      <section>
        <p className="filter-title">Ratings</p>
        <div className="chip-row">
          {ratingFilters.map((rating) => (
            <button
              key={rating}
              type="button"
              className={selectedRatingFilter === rating ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onRatingFilterChange(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="filter-title">Sort</p>
        <div className="chip-row">
          {[
            ['deadline', 'Nearest'],
            ['title', 'A-Z'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={sortBy === value ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onSortChange(value as 'deadline' | 'title')}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="filter-title">View</p>
        <div className="chip-row">
          <button
            type="button"
            className={selectedVenueType === 'All' && !showFavoritesOnly ? 'filter-chip filter-chip-with-count active' : 'filter-chip filter-chip-with-count'}
            onClick={onShowAllVenues}
          >
            <span className="filter-chip-label">All</span>
            <span className="filter-chip-count">{totalVenueCount}</span>
          </button>
          <button
            type="button"
            className={selectedVenueType === 'conference' && !showFavoritesOnly ? 'filter-chip filter-chip-with-count active' : 'filter-chip filter-chip-with-count'}
            onClick={onShowConferenceView}
          >
            <span className="filter-chip-label">Conferences</span>
            <span className="filter-chip-count">{conferenceCount}</span>
          </button>
          <button
            type="button"
            className={selectedVenueType === 'journal' && !showFavoritesOnly ? 'filter-chip filter-chip-with-count active' : 'filter-chip filter-chip-with-count'}
            onClick={onShowJournalView}
          >
            <span className="filter-chip-label">Journals</span>
            <span className="filter-chip-count">{journalCount}</span>
          </button>
        </div>
      </section>

      <section>
        <p className="filter-title">Focus</p>
        <label className="filter-toggle">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => onShowFavoritesOnlyChange(event.target.checked)}
          />
          <span className="filter-toggle-label">Followed only</span>
          <span className="filter-toggle-count">{favoriteCount}</span>
        </label>
      </section>
    </aside>
  );
}

export default FilterPanel;
