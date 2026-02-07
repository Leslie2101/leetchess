

import './PuzzleListPage.css'

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

function PaginationFooter(){
    return (
        <div className="pagination">
            <div className="pagination-info">
                Rows per page:
                <select className="pagination-select">
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                </select>
            </div>
            <div className="page-numbers">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">...</button>
                <button className="page-btn">›</button>
            </div>
        </div>
    )
}

function PuzzleList(){
    return (
        <div className="puzzle-table">
            <table>
                <thead>
                <tr>
                    <th>STATUS</th>
                    <th>TITLE</th>
                    <th>RATING</th>
                    <th>ACCEPTANCE</th>
                    <th>DIFFICULTY</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="status-cell">
                        <div className="status-icon solved">✓</div>
                    </td>
                    <td><div className="puzzle-title">1. Smothered Mate in Corner</div></td>
                    <td><span className="rating hard">1850</span></td>
                    <td className="acceptance">45.2%</td>
                    <td><span className="difficulty-badge hard">Hard</span></td>
                </tr>
                <tr>
                    <td className="status-cell">
                        <div className="status-icon"></div>
                    </td>
                    <td><div className="puzzle-title">2. Queen Sacrifice on h7</div></td>
                    <td><span className="rating hard">2100</span></td>
                    <td className="acceptance">32.1%</td>
                    <td><span className="difficulty-badge hard">Hard</span></td>
                </tr>
                </tbody>
            </table>

        </div>
    )
}
export default function PuzzleListPage(){
    return (
        <div>
            <DailyChallenge />
            <PuzzleList />
            <PaginationFooter />
        </div>
    )
}