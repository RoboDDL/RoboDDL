import { categories, ratingFilters, Category, RatingFilter, venueTypes, VenueType } from '../data/conferences';

interface FilterPanelProps {
  selectedVenueType: 'All' | VenueType;
  onVenueTypeChange: (value: 'All' | VenueType) => void;
  selectedCategory: 'All' | Category;
  onCategoryChange: (value: 'All' | Category) => void;
  sortBy: 'deadline' | 'title' | 'rank';
  onSortChange: (value: 'deadline' | 'title' | 'rank') => void;
  selectedRatingFilter: RatingFilter;
  onRatingFilterChange: (value: RatingFilter) => void;
  showFavoritesOnly: boolean;
  onShowFavoritesOnlyChange: (value: boolean) => void;
}

function FilterPanel({
  selectedVenueType,
  onVenueTypeChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedRatingFilter,
  onRatingFilterChange,
  showFavoritesOnly,
  onShowFavoritesOnlyChange,
}: FilterPanelProps) {
  return (
    <aside className="control-card space-y-6">
      <section>
        <p className="filter-title">Type</p>
        <div className="chip-row">
          {venueTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={selectedVenueType === type ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onVenueTypeChange(type)}
            >
              {type === 'All' ? 'All' : type[0].toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="filter-title">Track</p>
        <div className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="filter-title">Sort</p>
        <div className="chip-row">
          {[
            ['deadline', 'Nearest deadline'],
            ['title', 'Alphabetical'],
            ['rank', 'Rank'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={sortBy === value ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onSortChange(value as 'deadline' | 'title' | 'rank')}
            >
              {label}
            </button>
          ))}
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
        <p className="filter-title">Focus</p>
        <label className="favorite-toggle">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => onShowFavoritesOnlyChange(event.target.checked)}
          />
          <span>Followed only</span>
        </label>
      </section>
    </aside>
  );
}

export default FilterPanel;
