

import './PuzzleListPage.css'
import {FilterWidget} from './FilterWidget/FilterWidget';
import type { FilterState } from './FilterWidget/FilterWidget';
import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from './FilterWidget/SearchBar';

function DailyChallenge(){
    return (
        <div className="daily-challenge">
            <div className="challenge-pattern"></div>
            <div className="challenge-content">
                <h2>Daily Puzzle Challenge</h2>
                <p>Master the "Greek Gift" sacrifice today!</p>
            </div>
            <button className="solve-now-btn">Solve Now</button>
        </div>
    );
}

interface PaginationFooterProps {
  pageSize: string;
  pageNumber: number;
  onChangePageSize: (value: string) => void;
  onChangePageNumber: (value: number) => void;
}

function PaginationFooter({pageSize, pageNumber, onChangePageSize, onChangePageNumber}: PaginationFooterProps){
    return (
        <div className="pagination">
            <div className="pagination-info">
                Rows per page:
                <select className="pagination-select" value={pageSize} onChange={(e) => onChangePageSize(e.target.value)}>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div className="page-numbers">
                {pageNumber > 0 && (
                    <button className="page-btn" onClick={() => onChangePageNumber(pageNumber - 1)}>‹</button>
                )}
                <button className="page-btn" onClick={() => onChangePageNumber(pageNumber + 1)}>›</button>
            </div>
        </div>
    )
}


const puzzles = [
  { title: 'Smothered Mate in Cornere', rating: 1850, acceptance: 43.2, category: "Hard" },
  { title: 'Queen Sacrifice on h7', rating: 2100, acceptance: 30, category: "Hard" },
];


interface Puzzle {
  id: string;
  rating: number;
  acceptance: number;
  themes: string[];
}




export default function PuzzleListPage(){
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        ratingMin: 400,
        ratingMax: 3000,
        themes: [],
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState<string>("20");
    const [pageNumber, setPageNumber] = useState<number>(0);

    async function loadPuzzles() {
        try {
            const res = await fetch(`http://localhost:8082/puzzles?page=${pageNumber}&size=${pageSize}&ratingMin=${filters.ratingMin}&ratingMax=${filters.ratingMax}&ascending=true&sortBy=id`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = (await res.json()).content;
            setPuzzles(data);
        } catch (err) {
            console.error("Failed to load puzzles", err);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadPuzzles();
        }, 300); // wait 300ms after typing stops

        return () => clearTimeout(timeout);
    }, [pageNumber, pageSize, filters, searchTerm]);

    

    console.log("Puzzles", puzzles);

    const handleApplyFilters = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setPageNumber(0); 
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({
            ratingMin: 400,
            ratingMax: 3000,
            themes: [],
        });
        setPageNumber(0);
    }, []);



    function PuzzleList() {
        const listPuzzles = puzzles.map(puzzle =>
        <tr  key={puzzle.id}>
            <td className="status-cell">
                <div className='status-icon'></div>
            </td>
            <td><div className="puzzle-title">Puzzle {puzzle.id}</div></td>
            <td><span className="rating easy">{puzzle.rating}</span></td>
            <td><span className='acceptance'>{puzzle.acceptance}%</span></td>
            <td>
                <div className="theme-tags">
                    {puzzle.themes.map(theme => (
                            <span className="theme-tag-small">{theme}</span>
                    ))}
                </div>
            </td>
        </tr>);


        return (
            <div className="puzzle-table">
                <table>
                    <thead>
                    <tr>
                        <th>STATUS</th>
                        <th>TITLE</th>
                        <th>RATING</th>
                        <th>ACCEPTANCE</th>
                        <th>THEMES</th>
                    </tr>
                    </thead>
                    <tbody>
                        {listPuzzles}
                    </tbody>
                </table>

            </div>
        )
    }



    return (
        <div className="container">
            <DailyChallenge />
            <div className="main-content">
                <FilterWidget
                    filters={filters}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                />
                <SearchBar
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                 />
                <PuzzleList />
                <PaginationFooter pageSize={pageSize} pageNumber={pageNumber} onChangePageSize={(value) => setPageSize(value)} onChangePageNumber={(value) => setPageNumber(value)} />
            </div>
            
        </div>
    )
}