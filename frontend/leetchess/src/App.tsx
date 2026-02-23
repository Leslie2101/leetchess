import './App.css'

import Navbar from './layout/Navbar';
import PuzzleListPage from './pages/PuzzleListPage';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PuzzleSolverPage from './pages/PuzzleSolverPage';

function App() {

  return (
    <>
    
    <Router>
      <Navbar/>  

      <Routes>
        <Route path= "/" element={<PuzzleListPage/>} />
        <Route path= "/puzzles" element={<PuzzleListPage/>} />
        <Route path= "/puzzles/:puzzleId/solve" element={<PuzzleSolverPage/>} />
      </Routes>

    </Router>

    </>
  )
}

export default App
