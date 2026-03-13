import { useEffect, useMemo, useState } from 'react';
import { Bot, Filter } from 'lucide-react';
import ConferenceCard from './components/ConferenceCard';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import SubmissionCalendar from './components/SubmissionCalendar';
import { buildVenueViews, Category, VenueType } from './data/conferences';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState<'All' | VenueType>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'title' | 'rank'>('deadline');
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
      const matchesFavorite = !showFavoritesOnly || favoriteVenueIds.includes(venue.id);

      return matchesSearch && matchesType && matchesCategory && matchesFavorite;
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
  }, [searchQuery, selectedVenueType, selectedCategory, sortBy, showFavoritesOnly, favoriteVenueIds, venues]);

  const stats = useMemo(() => {
    const conferenceCount = venues.filter((venue) => venue.venueType === 'conference').length;
    const journalCount = venues.filter((venue) => venue.venueType === 'journal').length;
    const estimatedCount = venues.filter((venue) => venue.isEstimated).length;

    return {
      conferenceCount,
      journalCount,
      estimatedCount,
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

  return (
    <div className="app-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />

      <main className="page-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-badge">
              <Bot className="h-4 w-4" />
              RoboDDL
            </div>
            <h1>Robotics deadlines.</h1>
            <p>AoE deadlines for robotics conferences and journals.</p>
          </div>

          <div className="hero-panel">
            <div className="live-label">Current AoE Time</div>
            <div className="live-time">
              {currentTime.toLocaleString('en-US', {
                hour12: false,
                timeZone: 'Etc/GMT+12',
              })}
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Conferences</span>
            <strong>{stats.conferenceCount}</strong>
          </div>
          <div className="stat-card">
            <span>Journals</span>
            <strong>{stats.journalCount}</strong>
          </div>
          <div className="stat-card">
            <span>Estimated deadlines</span>
            <strong>{stats.estimatedCount}</strong>
          </div>
          <div className="stat-card">
            <span>Following</span>
            <strong>{stats.favoriteCount}</strong>
          </div>
        </section>

        <SubmissionCalendar venues={filteredVenues} now={currentTime} />

        <section className="toolbar-card">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="toolbar-note">
            <Filter className="h-4 w-4" />
            <span>On mobile, filters stack below the search bar.</span>
          </div>
        </section>

        <section className="content-grid">
          <FilterPanel
            selectedVenueType={selectedVenueType}
            onVenueTypeChange={setSelectedVenueType}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showFavoritesOnly={showFavoritesOnly}
            onShowFavoritesOnlyChange={setShowFavoritesOnly}
          />

          <div className="results-column">
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
        >
          Back to top
        </button>
      ) : null}
    </div>
  );
}

export default App;
