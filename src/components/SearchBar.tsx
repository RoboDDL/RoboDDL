import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-shell">
      <Search className="h-5 w-5 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search venue names, keywords, or locations"
      />
    </label>
  );
}

export default SearchBar;
