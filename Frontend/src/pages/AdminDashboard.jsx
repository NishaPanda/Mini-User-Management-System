import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(''); // 'activate' or 'deactivate'
    const [actionLoading, setActionLoading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (currentPage) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/getallusers?page=${currentPage}&limit=10`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(data.users);
                setTotalPages(data.totalPages);
                setTotalUsers(data.totalUsers);
            } else {
                setError(data.message || 'Failed to fetch users');
                if (response.status === 401 || response.status === 403) {
                    navigate('/login');
                }
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setActionType('');
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const confirmAction = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            const endpoint = actionType === 'activate' ? 'activate' : 'deactivate';
            const response = await fetch(`/api/admin/users/${selectedUser._id}/${endpoint}`, {
                method: 'PATCH',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(`User ${actionType}d successfully`, 'success');
                fetchUsers(page); // Refresh list
                closeModal();
            } else {
                showNotification(data.message || `Failed to ${actionType} user`, 'error');
            }
        } catch (err) {
            console.error(`Error ${actionType}ing user:`, err);
            showNotification(`Error: ${err.message}`, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            {/* Notification Toast */}
            {notification.show && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <svg className="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>Admin Dashboard</h1>
                        <p>Manage users and permissions</p>
                    </div>
                </header>

                <div className="table-card">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading users...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={() => fetchUsers(page)} className="retry-button">Try Again</button>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Full Name</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="empty-state">No users found</td>
                                            </tr>
                                        ) : (
                                            users.map(user => (
                                                <tr key={user._id}>
                                                    <td>
                                                        <span className="user-email">{user.email}</span>
                                                    </td>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-avatar">
                                                                {user.fullName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="user-name">{user.fullName}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`role-badge ${user.role}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {user.isActive ? (
                                                            <button
                                                                onClick={() => handleActionClick(user, 'deactivate')}
                                                                className="action-button deactivate"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActionClick(user, 'activate')}
                                                                className="action-button activate"
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="pagination-controls">
                                <span className="pagination-info">
                                    Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalUsers)} of {totalUsers} users
                                </span>
                                <div className="pagination-buttons">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="page-button"
                                    >
                                        Previous
                                    </button>
                                    <span className="page-number">Page {page} of {totalPages}</span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="page-button"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Action</h3>
                            <button onClick={closeModal} className="close-modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Are you sure you want to <strong>{actionType}</strong> the user
                                <strong> {selectedUser?.fullName}</strong>?
                            </p>
                            {actionType === 'deactivate' && (
                                <p className="warning-text">User will lose access to the system.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeModal} className="cancel-button">Cancel</button>
                            <button
                                onClick={confirmAction}
                                className={`confirm-button ${actionType}`}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : `Yes, ${actionType}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
