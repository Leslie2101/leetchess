

import './PuzzleListPage.css'
import {FilterWidget} from './FilterWidget/FilterWidget';
import type { FilterState } from './FilterWidget/FilterWidget';
import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from './FilterWidget/SearchBar';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;


interface DailyChallengeProps {
    onClick: () => void;
}

function DailyChallenge({onClick}: DailyChallengeProps){
    return (
        <div className="daily-challenge">
            <div className="challenge-pattern"></div>
            <div className="challenge-content">
                <h2>Daily Puzzle Challenge</h2>
                <p>Master the "Greek Gift" sacrifice today!</p>
            </div>
            <button className="solve-now-btn" onClick={onClick}>Solve Now</button>
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
    
    const numberPagesDisplayed = 5;
    let minPageLeft = Math.max(0, pageNumber - 2);
    let maxPageRight = Math.min(totalPage - 1, pageNumber + 2);

    // ensure we always show 5 pages if possible
    if (maxPageRight - minPageLeft + 1 < numberPagesDisplayed) {
        if (minPageLeft === 0) {
            maxPageRight = Math.min(totalPage - 1, minPageLeft + numberPagesDisplayed - 1);
        } else if (maxPageRight === totalPage - 1) {
            minPageLeft = Math.max(0, maxPageRight - numberPagesDisplayed + 1);
        }
    }   

    function renderPageNumbers() {
        const pageButtons = [];
        for (let i = minPageLeft; i <= maxPageRight; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`page-btn ${i === pageNumber ? "active" : ""}`}
                    onClick={() => onChangePageNumber(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return pageButtons;
    }
    
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
                {renderPageNumbers()}
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



interface Puzzle {
  id: string;
  title:string;
  rating: number;
  status: string;
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
    const [dailyId, setDailyId] = useState<number>(0);


    async function loadPuzzles() {
        try {

            const params = new URLSearchParams();
            
            params.append("page", pageNumber.toString());
            params.append("size", pageSize.toString());
            params.append("ratingMin", filters.ratingMin.toString());
            params.append("ratingMax", filters.ratingMax.toString());

            if (searchTerm != ""){
                params.append("search", searchTerm);
            }
            
            filters.themes.forEach(theme => {
                params.append("themes", theme);
            });



            const res = await fetch(`${API_BASE}/puzzles?${params.toString()}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
                
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const json = await res.json();
            const data = json.content;
            setTotalPage(json.page.totalPages);
            setPuzzles(data);
        } catch (err) {
            console.error("Failed to load puzzles", err);
        }
    }

    async function loadDailyChallenge(){
        try {
            const res = await fetch(`${API_BASE}/puzzles/daily-puzzle-id`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
                
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const json = await res.json();
            setDailyId(json.id);
        } catch (err) {
            console.error("Failed to load daily puzzle id", err);
        }
    }


    useEffect(() => {
        loadPuzzles();
        loadDailyChallenge();
    }, [])



    useEffect(() => {
        const timeout = setTimeout(() => {
            loadPuzzles();
        }, 300); // wait 300ms after typing stops

        return () => clearTimeout(timeout);
    }, [pageNumber, pageSize, filters, searchTerm]);

    
    const handleApplyFilters = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setPageNumber(0); 
    }, []);


    const navigate = useNavigate();
    const handleSolveClick = (puzzleId: string) => {
        navigate(`/puzzles/${puzzleId}/solve`);
    } 

    const handleDailyClick = () => {
        navigate(`/puzzles/${dailyId}/solve`);
        
    }



    function PuzzleList() {

        const category = (rating: number) => {
            return rating < 900 ? "easy" : rating <= 1500 ? "medium" : "hard";
        } 

        const listPuzzles = puzzles.map(puzzle =>
            <tr  key={puzzle.id} onClick={()=>handleSolveClick(puzzle.id)}>
                <td className="status-cell">
                    <div className={`status-icon ${puzzle.status.toLowerCase()}`}></div>
                </td>
                <td><div className="puzzle-title">{puzzle.title}</div></td>
                <td><span className={`rating ${category(puzzle.rating)}`}>{puzzle.rating}</span></td>
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
            <div id="puzzleTable" className="puzzle-table">
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

    function onChangePageSize(value: string) {
        setPageSize(value);
        setPageNumber(0); // reset to first page when page size changes
        scrollBack();
        
    }

    function goToPage(pageNumber: number) {
        setPageNumber(pageNumber);
        scrollBack();
    }

    function scrollBack(){
        // scroll the puzzle table into view
        window.scrollTo(0, 0);

    }



    return (
        <div className="container">
            <DailyChallenge onClick={handleDailyClick}/>
            <div className="main-content">
                <FilterWidget
                    filters={filters}
                    onApply={handleApplyFilters}
                />
                <SearchBar
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                 />
                <PuzzleList />
                <PaginationFooter pageSize={pageSize} pageNumber={pageNumber} totalPage={totalPage} onChangePageSize={(value) => onChangePageSize(value)} onChangePageNumber={(value) => goToPage(value)} />
            </div>
            
        </div>
    )
}