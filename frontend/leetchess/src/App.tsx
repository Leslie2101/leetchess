import { useState } from 'react'
import './App.css'

import Navbar from './layout/Navbar';
import PuzzleListPage from './pages/PuzzleListPage';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PuzzleSolverPage from './pages/PuzzleSolverPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <Router>
      <Navbar/>  

      <Routes>
        <Route exact path= "/" element={<PuzzleListPage/>} />
        <Route exact path= "/puzzles" element={<PuzzleListPage/>} />
        <Route exact path= "/puzzles/:puzzleId/solve" element={<PuzzleSolverPage/>} />
      </Routes>

    </Router>

    </>
  )
}

export default App
