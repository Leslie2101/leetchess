

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
  totalPage: number;
  onChangePageSize: (value: string) => void;
  onChangePageNumber: (value: number) => void;
}

function PaginationFooter({pageSize, pageNumber, totalPage, onChangePageSize, onChangePageNumber}: PaginationFooterProps){
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
                <button
                    className="page-btn"
                    onClick={() => onChangePageNumber(pageNumber - 1)}
                    disabled={pageNumber === 0} // disable on first page
                >
                    ‹
                </button>

                <button
                    className="page-btn"
                    onClick={() => onChangePageNumber(pageNumber + 1)}
                    disabled={pageNumber + 1 >= totalPage} // disable on last page
                >
                    ›
                </button>
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
    const [totalPage, setTotalPage] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);

    async function loadPuzzles() {
        try {

            const params = new URLSearchParams();
            
            params.append("page", pageNumber.toString());
            params.append("size", pageSize.toString());
            params.append("ratingMin", filters.ratingMin.toString());
            params.append("ratingMax", filters.ratingMax.toString());
            filters.themes.forEach(theme => {
                params.append("themes", theme);
            });

            const res = await fetch(`http://localhost:8082/puzzles?${params.toString()}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const json = await res.json();
            const data = json.content;
            console.log("Fetched puzzles", data);
            setTotalPage(json.page.totalPages);
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
                <PaginationFooter pageSize={pageSize} pageNumber={pageNumber} totalPage={totalPage} onChangePageSize={(value) => setPageSize(value)} onChangePageNumber={(value) => setPageNumber(value)} />
            </div>
            
        </div>
    )
}