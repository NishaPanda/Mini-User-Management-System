import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                    withCredentials: true
                });
                setUser(response.data.user);
            } catch (error) {
                console.log("Navbar: User not logged in");
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
            // Clear state
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                    User Management
                </Link>
            </div>
            <div className="navbar-menu">
                {user && (
                    <>
                        <div className="navbar-user">
                            <span className="user-name">{user.fullName}</span>
                            <span className={`user-role ${user.role}`}>{user.role}</span>
                        </div>
                        <Link to="/profile" className="btn-profile">
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
