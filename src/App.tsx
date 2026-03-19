import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, CalendarDays, Clock3, Github, HelpCircle, Monitor, Moon, Sun } from 'lucide-react';
import ConferenceCard from './components/ConferenceCard';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import SubmissionCalendar from './components/SubmissionCalendar';
import { buildVenueViews, Category, RatingFilter, VenueType } from './data/conferences';
import {
  getCategoryLabel,
  getInitialLanguage,
  getLocale,
  getLocalizedVenue,
  getThemeToggleLabel,
  getVenueTypeLabel,
  Language,
  uiText,
} from './i18n';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem('roboddl:theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopPanel, setActiveTopPanel] = useState<'calendar' | 'timezones' | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<'All' | VenueType>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'title'>('deadline');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<RatingFilter>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAoEHelpOpen, setIsAoEHelpOpen] = useState(false);
  const aoeHelpHideTimeoutRef = useRef<number | null>(null);
  const [favoriteVenueIds, setFavoriteVenueIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const saved = window.localStorage.getItem('roboddl:favorites');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('roboddl:theme', theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', theme === 'dark' ? '#08111f' : '#f8fafc');
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = uiText[language].pageTitle;
    window.localStorage.setItem('roboddl:language', language);
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 360);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('roboddl:favorites', JSON.stringify(favoriteVenueIds));
  }, [favoriteVenueIds]);

  useEffect(() => {
    return () => {
      if (aoeHelpHideTimeoutRef.current !== null) {
        window.clearTimeout(aoeHelpHideTimeoutRef.current);
      }
    };
  }, []);

  const venues = useMemo(() => buildVenueViews(currentTime), [currentTime]);
  const text = uiText[language];
  const locale = getLocale(language);

  const filteredVenues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = venues.filter((venue) => {
      const localizedVenue = getLocalizedVenue(venue, language);
      const searchText = [
        venue.title,
        venue.fullTitle,
        venue.summary,
        localizedVenue.fullTitle,
        localizedVenue.summary,
        venue.category,
        getCategoryLabel(venue.category, language),
        venue.venueType,
        getVenueTypeLabel(venue.venueType, language),
        venue.location,
        localizedVenue.location,
        ...venue.keywords,
        ...localizedVenue.searchKeywords,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = query.length === 0 || searchText.includes(query);
      const matchesType = selectedVenueType === 'All' || venue.venueType === selectedVenueType;
      const matchesCategory =
        selectedCategory === 'All' ||
        venue.category === selectedCategory ||
        Boolean(venue.organizationTags?.includes(selectedCategory));
      const matchesRating =
        selectedRatingFilter === 'All' ||
        (selectedRatingFilter === 'CCF' && Boolean(venue.ccfRank && venue.ccfRank !== 'N/A')) ||
        (selectedRatingFilter === 'CAAI' && Boolean(venue.caaiRank && venue.caaiRank !== 'N/A'));
      const matchesFavorite = !showFavoritesOnly || favoriteVenueIds.includes(venue.id);

      return matchesSearch && matchesType && matchesCategory && matchesRating && matchesFavorite;
    });

    filtered.sort((left, right) => {
      const leftFavorite = favoriteVenueIds.includes(left.id);
      const rightFavorite = favoriteVenueIds.includes(right.id);

      if (leftFavorite !== rightFavorite) {
        return leftFavorite ? -1 : 1;
      }

      if (sortBy === 'title') {
        return left.title.localeCompare(right.title);
      }

      return left.deadlineSortMs - right.deadlineSortMs;
    });

    return filtered;
  }, [
    searchQuery,
    selectedVenueType,
    selectedCategory,
    sortBy,
    selectedRatingFilter,
    showFavoritesOnly,
    favoriteVenueIds,
    language,
    venues,
  ]);

  const stats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 基础筛选：只按搜索和收藏，不受 Track/Ratings 影响
    const baseFiltered = venues.filter((venue) => {
      const searchText = [
        venue.title,
        venue.fullTitle,
        venue.summary,
        venue.category,
        venue.venueType,
        venue.location,
        ...venue.keywords,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = query.length === 0 || searchText.includes(query);
      const matchesFavorite = !showFavoritesOnly || favoriteVenueIds.includes(venue.id);

      return matchesSearch && matchesFavorite;
    });

    // 应用 Track 和 Ratings 筛选
    const withRatingsAndCategory = baseFiltered.filter((venue) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        venue.category === selectedCategory ||
        Boolean(venue.organizationTags?.includes(selectedCategory));
      const matchesRating =
        selectedRatingFilter === 'All' ||
        (selectedRatingFilter === 'CCF' && Boolean(venue.ccfRank && venue.ccfRank !== 'N/A')) ||
        (selectedRatingFilter === 'CAAI' && Boolean(venue.caaiRank && venue.caaiRank !== 'N/A'));

      return matchesCategory && matchesRating;
    });

    const conferenceCount = withRatingsAndCategory.filter((venue) => venue.venueType === 'conference').length;
    const journalCount = withRatingsAndCategory.filter((venue) => venue.venueType === 'journal').length;

    return {
      conferenceCount,
      journalCount,
      favoriteCount: favoriteVenueIds.length,
    };
  }, [searchQuery, selectedCategory, selectedRatingFilter, showFavoritesOnly, favoriteVenueIds, venues]);

  const themeToggleLabel = getThemeToggleLabel(theme, language);
  const githubLabel = text.githubLabel;
  const timeZoneCards = [
    {
      id: 'aoe',
      label: text.timezones.aoe,
      badge: 'UTC-12',
      timeZone: 'Etc/GMT+12',
    },
    {
      id: 'pt',
      label: text.timezones.pacific,
      badge: 'PT',
      timeZone: 'America/Los_Angeles',
    },
  ] as const;

  const toggleFavorite = (venueId: string) => {
    setFavoriteVenueIds((current) => {
      return current.includes(venueId)
        ? current.filter((id) => id !== venueId)
        : [...current, venueId];
    });
  };

  const clearAoEHelpHideTimeout = () => {
    if (aoeHelpHideTimeoutRef.current !== null) {
      window.clearTimeout(aoeHelpHideTimeoutRef.current);
      aoeHelpHideTimeoutRef.current = null;
    }
  };

  const openAoEHelp = () => {
    clearAoEHelpHideTimeout();
    setIsAoEHelpOpen(true);
  };

  const scheduleAoEHelpClose = () => {
    clearAoEHelpHideTimeout();
    aoeHelpHideTimeoutRef.current = window.setTimeout(() => {
      setIsAoEHelpOpen(false);
      aoeHelpHideTimeoutRef.current = null;
    }, 250);
  };

  const showAllVenues = () => {
    setSelectedVenueType('All');
    setShowFavoritesOnly(false);
  };

  const toggleConferenceView = () => {
    if (selectedVenueType === 'conference' && !showFavoritesOnly) {
      showAllVenues();
      return;
    }

    setSelectedVenueType('conference');
    setShowFavoritesOnly(false);
  };

  const toggleJournalView = () => {
    if (selectedVenueType === 'journal' && !showFavoritesOnly) {
      showAllVenues();
      return;
    }

    setSelectedVenueType('journal');
    setShowFavoritesOnly(false);
  };

  const toggleTopPanel = (panel: 'calendar' | 'timezones') => {
    setActiveTopPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="app-shell">
      <main className="page-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-topbar">
              <h1>Robo<span className="hero-title-ddl">DDL</span></h1>
              <div className="hero-tools">
                <div className="language-toggle" role="group" aria-label={text.languageGroupLabel}>
                  {[
                    { value: 'en', label: 'EN' },
                    { value: 'zh-CN', label: '中文' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={language === option.value ? 'language-toggle-button active' : 'language-toggle-button'}
                      onClick={() => setLanguage(option.value as Language)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="hero-actions">
                  <a
                    href="https://github.com/RoboDDL/RoboDDL"
                    target="_blank"
                    rel="noreferrer"
                    className="hero-icon-button"
                    aria-label={githubLabel}
                    title={githubLabel}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className="hero-icon-button"
                    onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
                    aria-label={themeToggleLabel}
                    title={themeToggleLabel}
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <p>{text.heroTagline}</p>
            <div className="hero-mobile-tip sm:hidden">
              <Monitor className="h-3.5 w-3.5" />
              <span>{text.heroDesktopTip}</span>
            </div>
            <div className="hero-note">🚧 {text.heroWipNote}</div>
          </div>
        </section>

        <section className="seo-copy-card" aria-labelledby="search-intent-title">
          <h2 id="search-intent-title">{text.seoIntro.title}</h2>
          <p>{text.seoIntro.body}</p>
        </section>

        <section className="calendar-card top-panel-card">
          <div className="top-panel-switches">
            <button
              type="button"
              className={activeTopPanel === 'calendar' ? 'top-panel-switch active' : 'top-panel-switch'}
              onClick={() => toggleTopPanel('calendar')}
            >
              <span className="top-panel-switch-icon" aria-hidden="true">
                <CalendarDays className="h-4 w-4" />
              </span>
              <strong className="top-panel-switch-title">{text.topPanels.calendar}</strong>
            </button>
            <button
              type="button"
              className={activeTopPanel === 'timezones' ? 'top-panel-switch active' : 'top-panel-switch'}
              onClick={() => toggleTopPanel('timezones')}
            >
              <span className="top-panel-switch-icon" aria-hidden="true">
                <Clock3 className="h-4 w-4" />
              </span>
              <strong className="top-panel-switch-title">{text.topPanels.timezones}</strong>
            </button>
          </div>

          {activeTopPanel ? (
            <div className="top-panel-body">
              {activeTopPanel === 'calendar' ? (
                <SubmissionCalendar
                  venues={filteredVenues}
                  now={currentTime}
                  favoriteVenueIds={favoriteVenueIds}
                  language={language}
                />
              ) : (
                <div className="time-zone-grid">
                  {timeZoneCards.map((zone) => (
                    <section key={zone.id} className="time-zone-card">
                      <div className="time-zone-meta">
                        <div className="time-zone-label-row">
                          <div className="time-zone-label">{zone.label}</div>
                          {zone.id === 'aoe' ? (
                            <div
                              className="live-help"
                              onMouseEnter={openAoEHelp}
                              onMouseLeave={scheduleAoEHelpClose}
                              onFocusCapture={openAoEHelp}
                              onBlurCapture={(event) => {
                                const nextFocusTarget = event.relatedTarget as Node | null;

                                if (nextFocusTarget && event.currentTarget.contains(nextFocusTarget)) {
                                  return;
                                }

                                scheduleAoEHelpClose();
                              }}
                            >
                              <button
                                type="button"
                                className="live-help-trigger"
                                aria-label={text.timezones.aoeHelpLabel}
                              >
                                <HelpCircle className="h-3.5 w-3.5" />
                              </button>
                              <div className={isAoEHelpOpen ? 'live-help-popover open' : 'live-help-popover'} role="tooltip">
                                <p>{text.timezones.aoeHelpText}</p>
                                <a
                                  href="https://en.wikipedia.org/wiki/Anywhere_on_Earth"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {text.timezones.aoeHelpLink}
                                </a>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <span className="time-zone-badge">{zone.badge}</span>
                      </div>
                      <div className="time-zone-time">
                        {currentTime.toLocaleTimeString(locale, {
                          hour12: false,
                          timeZone: zone.timeZone,
                        })}
                      </div>
                      <div className="time-zone-date">
                        {currentTime.toLocaleDateString(locale, {
                          timeZone: zone.timeZone,
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="content-grid">
          <FilterPanel
            language={language}
            selectedVenueType={selectedVenueType}
            showFavoritesOnly={showFavoritesOnly}
            totalVenueCount={stats.conferenceCount + stats.journalCount}
            conferenceCount={stats.conferenceCount}
            journalCount={stats.journalCount}
            favoriteCount={stats.favoriteCount}
            onShowAllVenues={showAllVenues}
            onShowConferenceView={toggleConferenceView}
            onShowJournalView={toggleJournalView}
            onShowFavoritesOnlyChange={setShowFavoritesOnly}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedRatingFilter={selectedRatingFilter}
            onRatingFilterChange={setSelectedRatingFilter}
          />

          <div className="results-column">
            <SearchBar value={searchQuery} onChange={setSearchQuery} language={language} />
            <div className="results-list">
              {filteredVenues.map((venue) => (
                <ConferenceCard
                  key={venue.id}
                  venue={venue}
                  language={language}
                  isFavorite={favoriteVenueIds.includes(venue.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <div className="page-footer-divider" aria-hidden="true" />
        <p>
          {text.footer.maintainedBy}{' '}
          <a href="https://github.com/RoboDDL/RoboDDL" target="_blank" rel="noreferrer">
            RoboDDL
          </a>
          {text.footer.contributionsWelcome}
        </p>
      </footer>

      {showBackToTop ? (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={text.backToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}

export default App;
