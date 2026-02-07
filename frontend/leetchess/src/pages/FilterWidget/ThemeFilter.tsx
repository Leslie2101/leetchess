import './FilterWidget.css';



interface Theme {
  id: string;
  name: string;
}

interface ThemeFilterProps {
  themes: Theme[];
  selected: Theme[];
  onChange: (themes: Theme[]) => void;
}

export function ThemeFilter({ themes, selected, onChange }: ThemeFilterProps) {
  function toggleTheme(theme: Theme) {
    if (selected.includes(theme)) {
      onChange(selected.filter(t => t !== theme));
    } else {
      onChange([...selected, theme]);
    }
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="filter-section" style={{ marginTop: "1.5rem" }}>
      <div className="filter-section-title">
        <span>
          Themes{" "}
          {selected.length > 0 && (
            <span className="selected-count">{selected.length}</span>
          )}
        </span>

        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

 

      <div className="theme-pills">
        {themes.map(theme => (
          <div
            key={theme.id}
            className={`theme-pill ${
              selected.includes(theme) ? "selected" : ""
            }`}
            onClick={() => toggleTheme(theme)}
          >
            {theme.name}
          </div>
        ))}
      </div>
    </div>
  );
}
