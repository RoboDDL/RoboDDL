import { Search } from 'lucide-react';
import { Language, uiText } from '../i18n';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

function SearchBar({ value, onChange, language }: SearchBarProps) {
  const text = uiText[language];

  return (
    <label className="search-shell">
      <Search className="h-5 w-5 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={text.search.placeholder}
        aria-label={text.search.ariaLabel}
      />
    </label>
  );
}

export default SearchBar;
