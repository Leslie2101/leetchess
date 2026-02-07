import { useState } from 'react'
import './App.css'

import Navbar from './layout/Navbar';
import PuzzleListPage from './pages/PuzzleListPage';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Navbar/>
      
      <Routes>
        <Route exact path= "/" element={<PuzzleListPage/>} />
      </Routes>

    </Router>

    </>
  )
}

export default App
