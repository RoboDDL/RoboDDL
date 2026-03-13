import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, Github } from 'lucide-react';
import ConferenceCard from './components/ConferenceCard';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import SubmissionCalendar from './components/SubmissionCalendar';
import { buildVenueViews, Category, RatingFilter, VenueType } from './data/conferences';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState<'All' | VenueType>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'title' | 'rank'>('deadline');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<RatingFilter>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBackToTop, setShowBackToTop] = useState(false);
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

  const venues = useMemo(() => buildVenueViews(currentTime), [currentTime]);

  const filteredVenues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = venues.filter((venue) => {
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
      const matchesType = selectedVenueType === 'All' || venue.venueType === selectedVenueType;
      const matchesCategory =
        selectedVenueType === 'journal'
          ? true
          : selectedCategory === 'All' || venue.category === selectedCategory;
      const matchesRating =
        selectedRatingFilter === 'All' ||
        (selectedRatingFilter === 'CCF' && Boolean(venue.ccfRank && venue.ccfRank !== 'N/A')) ||
        (selectedRatingFilter === 'CAAI' && Boolean(venue.caaiRank && venue.caaiRank !== 'N/A')) ||
        (selectedRatingFilter === 'SCI' &&
          Boolean(
            (venue.casPartition && venue.casPartition !== 'N/A') ||
              (venue.jcrQuartile && venue.jcrQuartile !== 'N/A'),
          )) ||
        (selectedRatingFilter === 'JCR' && Boolean(venue.jcrQuartile && venue.jcrQuartile !== 'N/A'));
      const matchesFavorite = !showFavoritesOnly || favoriteVenueIds.includes(venue.id);

      return matchesSearch && matchesType && matchesCategory && matchesRating && matchesFavorite;
    });

    const rankOrder: Record<string, number> = {
      'A*': 0,
      'RAS A': 1,
      A: 2,
      'Top Journal': 3,
    };

    filtered.sort((left, right) => {
      const leftFavorite = favoriteVenueIds.includes(left.id);
      const rightFavorite = favoriteVenueIds.includes(right.id);

      if (leftFavorite !== rightFavorite) {
        return leftFavorite ? -1 : 1;
      }

      if (sortBy === 'title') {
        return left.title.localeCompare(right.title);
      }

      if (sortBy === 'rank') {
        return (rankOrder[left.rank] ?? 999) - (rankOrder[right.rank] ?? 999);
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
    venues,
  ]);

  const stats = useMemo(() => {
    const conferenceCount = venues.filter((venue) => venue.venueType === 'conference').length;
    const journalCount = venues.filter((venue) => venue.venueType === 'journal').length;

    return {
      conferenceCount,
      journalCount,
      favoriteCount: favoriteVenueIds.length,
    };
  }, [favoriteVenueIds.length, venues]);

  const toggleFavorite = (venueId: string) => {
    setFavoriteVenueIds((current) => {
      return current.includes(venueId)
        ? current.filter((id) => id !== venueId)
        : [...current, venueId];
    });
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

  const toggleFollowingView = () => {
    if (showFavoritesOnly && selectedVenueType === 'All') {
      showAllVenues();
      return;
    }

    setSelectedVenueType('All');
    setSelectedCategory('All');
    setShowFavoritesOnly(true);
  };

  return (
    <div className="app-shell">
      <main className="page-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <h1>RoboDDL</h1>
            <div className="hero-note">[WIP] Deadlines and ratings may still contain errors!</div>
            <p>Deadlines for robotics conferences and journals.</p>
            <a
              href="https://github.com/RoboDDL/RoboDDL"
              target="_blank"
              rel="noreferrer"
              className="hero-link"
              aria-label="RoboDDL on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          <div className="hero-panel">
            <div className="live-label">Current AoE Time</div>
            <div className="live-time">
              {currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                timeZone: 'Etc/GMT+12',
              })}
            </div>
            <div className="live-date">
              {currentTime.toLocaleDateString('en-US', {
                timeZone: 'Etc/GMT+12',
              })}
            </div>
          </div>
        </section>

        <SubmissionCalendar venues={filteredVenues} now={currentTime} />

        <section className="stats-grid">
          <button
            type="button"
            className={selectedVenueType === 'conference' && !showFavoritesOnly ? 'stat-card stat-card-button active' : 'stat-card stat-card-button'}
            onClick={toggleConferenceView}
          >
            <span>Conferences</span>
            <strong>{stats.conferenceCount}</strong>
          </button>
          <button
            type="button"
            className={selectedVenueType === 'journal' && !showFavoritesOnly ? 'stat-card stat-card-button active' : 'stat-card stat-card-button'}
            onClick={toggleJournalView}
          >
            <span>Journals</span>
            <strong>{stats.journalCount}</strong>
          </button>
          <button
            type="button"
            className={showFavoritesOnly ? 'stat-card stat-card-button active' : 'stat-card stat-card-button'}
            onClick={toggleFollowingView}
          >
            <span>Following</span>
            <strong>{stats.favoriteCount}</strong>
          </button>
        </section>

        <section className="content-grid">
          <FilterPanel
            selectedVenueType={selectedVenueType}
            onVenueTypeChange={setSelectedVenueType}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedRatingFilter={selectedRatingFilter}
            onRatingFilterChange={setSelectedRatingFilter}
            showFavoritesOnly={showFavoritesOnly}
            onShowFavoritesOnlyChange={setShowFavoritesOnly}
          />

          <div className="results-column">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="results-list">
              {filteredVenues.map((venue) => (
                <ConferenceCard
                  key={venue.id}
                  venue={venue}
                  isFavorite={favoriteVenueIds.includes(venue.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {showBackToTop ? (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}

export default App;
