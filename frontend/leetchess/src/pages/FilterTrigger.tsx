
interface FilterTriggerProps {
  onClick: () => void;
}

export default function FilterTrigger({ onClick }: FilterTriggerProps) {
  return (
    <div className="filter-widget-container">
      <div className="filter-trigger" onClick={onClick}>
        <div className="filter-trigger-left">
          <div className="filter-icon">🎯</div>
          <div className="filter-summary">
            <div className="filter-title">Filters</div>
            <div className="filter-tags">
              <span className="filter-tag">All Puzzles</span>
            </div>
          </div>
        </div>

        <svg className="expand-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}