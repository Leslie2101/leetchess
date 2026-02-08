import React from 'react'
import { Link } from 'react-router-dom'

import './Navbar.css'

export default function Navbar() {
  return (
    <header className="header">
    <div className="header-content">
        <a href="/" className="logo">
            <div className="logo-icon">♔</div>
            ChessCode
        </a>
        <nav className="nav">
            <Link className='nav-link active' to='/puzzles'>Puzzles</Link>
        </nav>
        <div className="header-actions">
            <div className="avatar"></div>
        </div>
    </div>
  </header>
  )
}
