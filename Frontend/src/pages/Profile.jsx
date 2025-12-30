import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../config';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        password: '' // Required for verification
    });

    // Change Password State
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);



    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                withCredentials: true
            });
            setUser(response.data.user);
            setEditForm({
                fullName: response.data.user.fullName,
                email: response.data.user.email,
                password: ''
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setToast({ show: true, message: 'Failed to load profile data', type: 'error' });
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChangeInput = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!editForm.password) {
            setToast({ show: true, message: 'Please enter your current password to save changes', type: 'error' });
            return;
        }

        try {
            await axios.patch(`${API_BASE_URL}/api/user/profile`, editForm, {
                withCredentials: true
            });
            setToast({ show: true, message: 'Profile updated successfully', type: 'success' });
            setIsEditing(false);
            setEditForm(prev => ({ ...prev, password: '' }));
            fetchUserProfile(); // Refresh data
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Failed to update profile', type: 'error' });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword.length < 6) {
            setToast({ show: true, message: 'New password must be at least 6 characters', type: 'error' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setToast({ show: true, message: 'New passwords do not match', type: 'error' });
            return;
        }

        try {
            await axios.patch(`${API_BASE_URL}/api/user/changepassword`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, {
                withCredentials: true
            });
            setToast({ show: true, message: 'Password changed successfully', type: 'success' });
            setShowPasswordChange(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Failed to change password', type: 'error' });
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
            fullName: user?.fullName || '',
            email: user?.email || '',
            password: ''
        });
    };

    const handleCancelPasswordChange = () => {
        setShowPasswordChange(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="profile-container">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}

            <Navbar />
            <div className="profile-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className={`profile-avatar ${user?.role}`}>
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h2>{user?.fullName}</h2>
                        <span className={`role-badge ${user?.role}`}>
                            {user?.role === 'admin' ? 'Administrator' : 'User'}
                        </span>
                    </div>

                    {/* Alert Messages */}
                    {error && (
                        <div className="alert error">
                            <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert success">
                            <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* Profile View Mode */}
                    {!isEditing && !showPasswordChange && (
                        <div className="profile-details">
                            <div className="detail-group">
                                <label>Full Name</label>
                                <p>{user?.fullName}</p>
                            </div>
                            <div className="detail-group">
                                <label>Email Address</label>
                                <p>{user?.email}</p>
                            </div>
                            <div className="detail-group">
                                <label>Role</label>
                                <p className="role-text">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                            </div>
                            <div className="detail-group">
                                <label>Account Status</label>
                                <span className={`status-badge ${user?.isActive !== false ? 'active' : 'inactive'}`}>
                                    {user?.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="profile-actions">
                                <button onClick={() => setIsEditing(true)} className="btn-primary">
                                    <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                                <button onClick={() => setShowPasswordChange(true)} className="btn-secondary">
                                    <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit Profile Form */}
                    {isEditing && (
                        <form onSubmit={handleUpdateProfile} className="edit-form">
                            <h3>Edit Profile</h3>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editForm.fullName}
                                    onChange={handleEditChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Current Password <span className="required-note">(Required to save changes)</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editForm.password}
                                    onChange={handleEditChange}
                                    placeholder="Enter your current password"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Change Password Form */}
                    {showPasswordChange && (
                        <form onSubmit={handleChangePassword} className="edit-form">
                            <h3>Change Password</h3>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChangeInput}
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChangeInput}
                                    placeholder="Enter new password (min 6 characters)"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passwordForm.confirmNewPassword}
                                    onChange={handlePasswordChangeInput}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={handleCancelPasswordChange} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
