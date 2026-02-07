import './FilterWidget.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <svg
        className="search-icon"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M12.5 12.5l4 4" />
      </svg>

      
      <input
        type="text"
        className="search-input"
        placeholder="Search puzzles..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      
    </div>
  );
}
