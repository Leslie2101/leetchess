import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import './FilterWidget.css';

interface RatingRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
}

export function RatingRangeSlider({
  min,
  max,
  onChange,
  minLimit = 0,
  maxLimit = 3000,
}: RatingRangeSliderProps) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert value to %
  const getPercent = useCallback(
    (value: number) =>
      Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100),
    [minLimit, maxLimit]
  );

  // Update left thumb + track
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Update right thumb + track
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Sync to parent
  // useEffect(() => {
  //   onChange(minVal, maxVal);
  // }, [minVal, maxVal, onChange]);

  return (
    <div className="rating-range">
      <div className="slider-container">
        
        {/* <div ref={range} className="slider-track" /> */}

        {/* Min thumb */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minVal}
          onChange={e => {
            const value = Math.min(Number(e.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
            onChange(value, maxVal);
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > maxLimit - 100 ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxVal}
          onChange={e => {
            const value = Math.max(Number(e.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
            onChange(minVal, value);
          }}
          className="thumb thumb--right"
        />
        <div className="slider">
          <div className="slider__track"></div>
          <div ref={range} className="slider__range"></div>
      </div>
      </div>

      

      {/* Numeric inputs */}
      <div className="range-inputs">
        <div>
          <div className="range-label">Min</div>
          <input
            type="number"
            value={minVal}
            min={minLimit}
            max={maxVal - 1}
            onChange={e => {
              const value = Math.min(Number(e.target.value), maxVal - 1);
              setMinVal(value);
              minValRef.current = value;
            }}
            className="range-input"
          />
        </div>

        <span>—</span>

        <div>
          <div className="range-label">Max</div>
          <input
            type="number"
            value={maxVal}
            min={minVal + 1}
            max={maxLimit}
            onChange={e => {
              const value = Math.max(Number(e.target.value), minVal + 1);
              setMaxVal(value);
              maxValRef.current = value;
            }}
            className="range-input"
          />
        </div>
      </div>
    </div>
  );
}