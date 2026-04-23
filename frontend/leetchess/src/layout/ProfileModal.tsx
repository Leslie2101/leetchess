import './ProfileModal.css';
import { useAuth } from '../AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;



interface ProfileModalProp {
    open: boolean;
    handleLogin: (provider: string) => void;
    handleLogout: () => void;
    onClose: () => void;
}



export default function ProfileModal({open, handleLogin, handleLogout,  onClose}: ProfileModalProp) {
    if (!open) return null;
    const [rating, setRating] = useState<number>(0);
    const [solvedCount, setSolvedCount] = useState<number>(0);
    const [unsolvedCount, setUnsolvedCount] = useState<number>(0);

    const auth = useAuth();

    useEffect(() => {
        axios.get(`${API_BASE}/stats/me`, {withCredentials: true})
        .then(response => {
            setRating(response.data.rating);
            setSolvedCount(response.data.solved);
            setUnsolvedCount(response.data.unsolved);
        })
        .catch(() => {
            setRating(0);
            setSolvedCount(0);
            setUnsolvedCount(0);
            console.error("Failed to fetch user stats");
        });
    }, []);


    return (
        <div className="profile-modal-overlay" id="profileModal" onClick={() => onClose()}>
        <div className="profile-modal" onClick={(e) => {e.stopPropagation();}}>
            
            {/* <!-- Logged Out State --> */}
            {auth?.user ? 
                <div className="profile-logged-in" id="profileLoggedIn">
                    <div className="profile-header">
                        <div className="profile-avatar-large">👤</div>
                        <div className="profile-info">
                            <div className="profile-name">{auth.user?.name}</div>
                            <div className="profile-email">{auth.user?.email}</div>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="profile-stat">
                            <span className="profile-stat-value">{rating}</span>
                            <span className="profile-stat-label">Rating</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat-value">{solvedCount}</span>
                            <span className="profile-stat-label">Solved</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat-value">{unsolvedCount}</span>
                            <span className="profile-stat-label">Unsolved</span>
                        </div>
                    </div>

                    <div className="profile-menu">
                        {/* <a href="#" className="profile-menu-item">
                            <span className="profile-menu-icon">👤</span>
                            <span>My Profile</span>
                        </a>
                        <a href="#" className="profile-menu-item">
                            <span className="profile-menu-icon">📊</span>
                            <span>Statistics</span>
                        </a> */}

                        <a href="#" className="profile-menu-item danger" onClick={() => handleLogout()}>
                            <span className="profile-menu-icon">🚪</span>
                            <span>Sign Out</span>
                        </a>
                        {/* <div className="profile-menu-divider"></div>
                        <a href="#" className="profile-menu-item danger" onClick={() => handleLogout()}>
                            <span className="profile-menu-icon">🚪</span>
                            <span>Sign Out</span>
                        </a> */}
                    </div>
                </div> 
                
            : 
                <div className="profile-logged-out" id="profileLoggedOut">
                    <div className="avatar-large">👤</div>
                    <h3>Welcome to Leetchess!</h3>
                    <p>Sign in to track your progress</p>
                    
                    <div className="login-options">
                        <button className="login-btn login-btn-secondary" onClick={() => handleLogin('google')}>
                            Continue with Google
                        </button>
                    </div>
                    
                    <div className="login-divider">or</div>
                    
                    <button className="login-btn login-btn-secondary" onClick={()=>onClose()}>
                        Continue as Guest
                    </button>
                </div>
                
            }              

        </div>
        </div>
    )

}