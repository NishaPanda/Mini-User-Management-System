import React from 'react'
import Navbar from '../components/Navbar'
import './Dashboard.css'

function Dashboard() {
    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="dashboard-content">
                <h1>Welcome to User Management System</h1>
                <p>Use the navigation bar to access different sections.</p>
            </div>
        </div>
    )
}

export default Dashboard
