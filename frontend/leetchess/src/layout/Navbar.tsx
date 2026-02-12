import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import ProfileModal from './ProfileModal'

export default function Navbar() {
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function toggleProfileModal() {
        setProfileModalOpen(prev => !prev);
    }

    function handleLogin(provider: string){
        console.log(`Login with ${provider}`);
        window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
        setIsLoggedIn(true);

    }


    function handleLogout(){
        console.log("Logout");
        // fetch('/auth/logout', { method: 'POST' })
        //     .then(() => window.location.reload());
        setIsLoggedIn(false);
    }
    
    return (
        <>
            <header className="header">
                <div className="header-content">
                    <a href="/" className="logo">
                        <div className="logo-icon">♔</div>
                        Leetchess
                    </a>
                    <nav className="nav">
                        <Link className='nav-link active' to='/puzzles'>Puzzles</Link>
                    </nav>
                    <div className="header-actions">
                        <div className="avatar" onClick={()=>toggleProfileModal()}></div>
                    </div>

                    

                    
                </div>
            </header>
            <ProfileModal 
                open={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                isLoggedIn={isLoggedIn}
                handleLogin={(provider)=>handleLogin(provider)}
                handleLogout={() => handleLogout()}
            />
        </>
    )
}
