import { useState, useEffect, useCallback, use } from "react";
import {RatingRangeSlider} from "./RatingRangeSlider";
import { ThemeFilter } from "./ThemeFilter";
import './FilterWidget.css';

interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  ratingMin: number;
  ratingMax: number;
  themes: Theme[];
}

interface FilterModalHeaderProps {
  onClose: () => void;
}

function FilterModalHeader({ onClose }: FilterModalHeaderProps) {
  return (
    <div className="filter-modal-header">
      <div className="filter-modal-title">Filter Puzzles</div>
      <button className="close-modal-btn" onClick={onClose}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

type Theme = {
  id: string;
  name: string;
};

interface FilterModalBodyProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  themes: Theme[];
  loadingThemes: boolean;
}

function FilterModalBody({ filters, onChange, themes, loadingThemes}: FilterModalBodyProps) {
  return (
    <div className="filter-modal-body">
      <div className="filter-grid">
        <div className="filter-section">
          <div className="filter-section-title">
            Rating Range
            <button
              className="clear-btn"
              onClick={() =>
                onChange({ ...filters, ratingMin: 400, ratingMax: 3000 })
              }
            >
              Reset
            </button>
          </div>

          <RatingRangeSlider
            min={filters.ratingMin}
            max={filters.ratingMax}
            onChange={(min, max) =>
              onChange({ ...filters, ratingMin: min, ratingMax: max })
            }
          />
        </div>
      </div>

      {loadingThemes 
        ? (<div className="loading">Loading themes…</div>) 
        : (
            <ThemeFilter
            themes={themes}
            selected={filters.themes}
            onChange={themes =>
                onChange({ ...filters, themes })
            }
            />
        )}
    </div>
  );
}


interface FilterModalFooterProps {
  onReset: () => void;
  onApply: () => void;
}

function FilterModalFooter({ onReset, onApply }: FilterModalFooterProps) {
    return (
        <div className="filter-modal-footer">
        <button className="reset-all-btn" onClick={onReset}>
            Reset All
        </button>
        <button className="apply-filters-btn" onClick={onApply}>
            Apply Filters
        </button>
        </div>
    );
}

interface FilterWidgetProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

function getFilterTags(filterState: FilterState) {
  const tags: string[] = [];

  // Rating range
  tags.push(`${filterState.ratingMin}-${filterState.ratingMax}`);
  

  // Themes
  if (filterState.themes.length > 0) {
    filterState.themes.map((theme) => {
      tags.push(theme.name);
    });
  }

  return tags;
}



export function FilterWidget({filters, onApply}: FilterWidgetProps){
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="filter-widget-container">
                <div className="filter-trigger" onClick={(e) => {e.preventDefault();setIsOpen(true);}}>
                    <div className="filter-trigger-left">
                        <div className="filter-icon">🎯</div>

                        <div className="filter-summary">
                            <div className="filter-title">Filters</div>
                            <div className="filter-tags" id="filterSummary">
                                {(() => {
                                const tags = getFilterTags(filters);
                                if (tags.length === 0) {
                                    return <span className="filter-tag">All Puzzles</span>;
                                }
                                return tags.map(tag => (
                                    <span key={tag} className="filter-tag active">{tag}</span>
                                ));
                            })()}
                            </div>
                        </div>
                    </div>
                    <svg className="expand-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </div>
            </div>

            {isOpen && (
                <FilterModal 
                    onClose={() => setIsOpen(false)}
                    onApply={onApply}
                />
            )}
        </>
    )
}


export function FilterModal({ onClose, onApply }: FilterModalProps) {
    const [filters, setFilters] = useState<FilterState>({
        ratingMin: 400,
        ratingMax: 3000,
        themes: [],
    });

    const [themes, setThemes] = useState<Theme[]>([]);
    const [loadingThemes, setLoadingThemes] = useState(true);

    

    useEffect(() => {
      console.log("MODAL MOUNTED");
      async function loadThemes() {
        try {
            const res = await fetch("http://localhost:8082/themes");
            const data: Theme[] = await res.json();
            setThemes(data);
        } catch (err) {
            console.error("Failed to load themes", err);
        } finally {
            setLoadingThemes(false);
        }
      }
      loadThemes();
    }, []);


    function resetAll() {
        setFilters({
        ratingMin: 400,
        ratingMax: 3000,
        themes: [],
        });
    }

    function applyFilters() {
        onApply(filters);
        onClose();
    }

    const handleFilterChange = (newFilters: FilterState) => {
      setFilters(newFilters);
    };

    return (
        <div className="filter-modal" onClick={onClose}>
        <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
            <FilterModalHeader onClose={onClose} />

            <FilterModalBody
                filters={filters}
                onChange={handleFilterChange}
                themes={themes}
                loadingThemes={loadingThemes}
            />

            <FilterModalFooter
            onReset={resetAll}
            onApply={applyFilters}
            />
        </div>
        </div>
    );
}
