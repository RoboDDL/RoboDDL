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
type SocialPreviewId = 'wechat' | 'xhs';

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

// Minimal brand glyphs adapted from Simple Icons for monochrome toolbar buttons.
function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
    </svg>
  );
}

function XiaohongshuIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972.794.794 0 0 0-.884-.618.795.795 0 0 0-.692.794c0 .101-.002.666.001.777zm-11.509 4.808c-.203.001-1.353.004-1.685.003a2.528 2.528 0 0 1-.766-.126.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124.66.01 1.32.002 1.981 0 .01 0 .02-.006.023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01a.834.834 0 0 0-.01.08c-.027.397-.038.495-.234 3.06-.012.24-.034.389-.135.607-.026.057-.033.042.003.112.046.092.681 1.523.787 1.74.008.015.011.02.017.02.008 0 .033-.026.047-.044.147-.187.268-.391.371-.606.306-.635.44-1.325.486-1.706.014-.11.021-.22.03-.33l.204-2.616.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.427 1.427 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.443.443 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293c.076.982.153 1.964.233 2.946.05.4.186 1.085.487 1.706.103.215.223.419.37.606.015.018.037.051.048.049.02-.003.742-1.642.804-1.765.036-.07.03-.055.003-.112zm3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56c-.01 0-.02.006-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.534.534 0 0 0-.02.191.46.46 0 0 0 .23.378.981.981 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.53.53 0 0 0-.023.172.465.465 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001c.01 0 .02-.006.023-.015l.575-1.28a.025.025 0 0 0-.024-.035zm-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829 0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047.001.037.465 1.064.555 1.263.01.02.03.033.051.033.157.003.767.009.938-.014.153-.02.3-.06.438-.132.3-.156.49-.419.595-.765.052-.172.075-.353.075-.533.002-2.33 0-4.66-.007-6.991a.032.032 0 0 0-.032-.032zm11.784 6.896c0-.014-.01-.021-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084-.37 0-1.11-.002-1.304 0-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036c.006.01.013.008.058.008 1.748.003 3.495.002 5.243.002.03-.001.034-.006.035-.033v-1.539zm4.177-3.43c0 .013-.007.023-.02.024-.346.006-.692.004-1.037.004-.014-.002-.022-.01-.022-.024-.005-.434-.007-.869-.01-1.303 0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015.093.025.16.107.165.204.006.431.002 1.153.001 1.153zm2.67.244a1.953 1.953 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21c0-.132-.007-.263-.025-.394a1.823 1.823 0 0 0-.153-.53 1.533 1.533 0 0 0-.677-.71 2.167 2.167 0 0 0-1-.258c-.153-.003-.567 0-.72 0-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007c-.006.006-.008.012-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128V11.19s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003c.098 0 .191.02.28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185 0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033.184.437.374.871.57 1.303a.045.045 0 0 0 .04.026c.17.005.34.002.51.003.15-.002.517.004.666-.01a2.03 2.03 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981c0-.128-.01-.254-.034-.38 0 .078-.029-.641-.724-.998z" />
    </svg>
  );
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
  const [activeSocialPreview, setActiveSocialPreview] = useState<SocialPreviewId | null>(null);
  const aoeHelpHideTimeoutRef = useRef<number | null>(null);
  const socialPreviewHideTimeoutRef = useRef<number | null>(null);
  const heroToolsRef = useRef<HTMLDivElement | null>(null);
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

      if (socialPreviewHideTimeoutRef.current !== null) {
        window.clearTimeout(socialPreviewHideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeSocialPreview === null) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const nextTarget = event.target as Node | null;

      if (nextTarget && heroToolsRef.current?.contains(nextTarget)) {
        return;
      }

      if (socialPreviewHideTimeoutRef.current !== null) {
        window.clearTimeout(socialPreviewHideTimeoutRef.current);
        socialPreviewHideTimeoutRef.current = null;
      }

      setActiveSocialPreview(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [activeSocialPreview]);

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
  const wechatLabel = text.wechatLabel;
  const xhsLabel = text.xhsLabel;
  const nextLanguage = language === 'en' ? 'zh-CN' : 'en';
  const languageToggleLabel =
    language === 'en' ? text.languageToggleToChinese : text.languageToggleToEnglish;
  const activeSocialPreviewCard =
    activeSocialPreview === 'wechat'
      ? {
          alt: wechatLabel,
          src: '/wechat.jpg',
        }
      : activeSocialPreview === 'xhs'
        ? {
            alt: xhsLabel,
            src: '/xhs.jpg',
          }
        : null;
  const socialPopoverClassName =
    activeSocialPreview === 'xhs'
      ? 'hero-social-popover hero-social-popover-large'
      : 'hero-social-popover';
  const timeZoneCards = [
    {
      id: 'aoe',
      label: text.timezones.aoe,
      badge: 'AoE',
      timeZone: 'Etc/GMT+12',
    },
    {
      id: 'pt',
      label: text.timezones.pacific,
      badge: 'PST',
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

  const clearSocialPreviewHideTimeout = () => {
    if (socialPreviewHideTimeoutRef.current !== null) {
      window.clearTimeout(socialPreviewHideTimeoutRef.current);
      socialPreviewHideTimeoutRef.current = null;
    }
  };

  const closeSocialPreview = () => {
    clearSocialPreviewHideTimeout();
    setActiveSocialPreview(null);
  };

  const openSocialPreview = (previewId: SocialPreviewId) => {
    clearSocialPreviewHideTimeout();
    setActiveSocialPreview(previewId);
  };

  const scheduleSocialPreviewClose = () => {
    clearSocialPreviewHideTimeout();
    socialPreviewHideTimeoutRef.current = window.setTimeout(() => {
      setActiveSocialPreview(null);
      socialPreviewHideTimeoutRef.current = null;
    }, 180);
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
              <div
                ref={heroToolsRef}
                className="hero-tools"
                onKeyDownCapture={(event) => {
                  if (event.key === 'Escape') {
                    closeSocialPreview();
                  }
                }}
              >
                <div className="hero-tools-pill">
                  <a
                    className="hero-tool-button hero-tool-button-icon"
                    href="https://github.com/RoboDDL/RoboDDL"
                    target="_blank"
                    rel="noreferrer"
                    onFocus={closeSocialPreview}
                    aria-label={githubLabel}
                    title={githubLabel}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className="hero-tool-button hero-tool-button-icon"
                    onClick={() => openSocialPreview('wechat')}
                    onMouseEnter={() => openSocialPreview('wechat')}
                    onMouseLeave={scheduleSocialPreviewClose}
                    onFocus={() => openSocialPreview('wechat')}
                    onBlur={scheduleSocialPreviewClose}
                    aria-expanded={activeSocialPreview === 'wechat'}
                    aria-label={wechatLabel}
                    title={wechatLabel}
                  >
                    <WeChatIcon className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="hero-tool-button hero-tool-button-icon"
                    onClick={() => openSocialPreview('xhs')}
                    onMouseEnter={() => openSocialPreview('xhs')}
                    onMouseLeave={scheduleSocialPreviewClose}
                    onFocus={() => openSocialPreview('xhs')}
                    onBlur={scheduleSocialPreviewClose}
                    aria-expanded={activeSocialPreview === 'xhs'}
                    aria-label={xhsLabel}
                    title={xhsLabel}
                  >
                    <XiaohongshuIcon className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="hero-tool-button hero-tool-button-icon"
                    onClick={() => {
                      closeSocialPreview();
                      setTheme((current) => (current === 'light' ? 'dark' : 'light'));
                    }}
                    onFocus={closeSocialPreview}
                    aria-label={themeToggleLabel}
                    title={themeToggleLabel}
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    className="hero-tool-button hero-tool-button-icon hero-tool-button-language"
                    onClick={() => {
                      closeSocialPreview();
                      setLanguage(nextLanguage);
                    }}
                    onFocus={closeSocialPreview}
                    aria-label={languageToggleLabel}
                    title={languageToggleLabel}
                  >
                    <span className="hero-language-text">{language === 'zh-CN' ? '中' : 'EN'}</span>
                  </button>
                </div>
                <div
                  className={activeSocialPreviewCard ? `${socialPopoverClassName} open` : socialPopoverClassName}
                  onMouseEnter={clearSocialPreviewHideTimeout}
                  onMouseLeave={scheduleSocialPreviewClose}
                  role="tooltip"
                >
                  {activeSocialPreviewCard ? (
                    <div className="hero-social-popover-frame">
                      <img
                        className="hero-social-popover-image"
                        src={activeSocialPreviewCard.src}
                        alt={activeSocialPreviewCard.alt}
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <p>{text.heroTagline}</p>
            <div className="hero-mobile-tip sm:hidden">
              <Monitor className="h-3.5 w-3.5" />
              <span>{text.heroDesktopTip}</span>
            </div>
          </div>
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
