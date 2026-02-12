import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import ProfileModal from './ProfileModal'
import { useAuth } from '../AuthContext';
import axios from 'axios';

export default function Navbar() {
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const auth = useAuth();


    function toggleProfileModal() {
        setProfileModalOpen(prev => !prev);
    }

    function handleLogin(provider: string){
        console.log(`Login with ${provider}`);
        window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
    }


    function handleLogout(){
        console.log("Logout");
        // fetch('/auth/logout', { method: 'POST' })
        //     .then(() => window.location.reload());
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
                handleLogin={(provider)=>handleLogin(provider)}
                handleLogout={() => handleLogout()}
            />
        </>
    )
}
