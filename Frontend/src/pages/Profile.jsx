import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../config';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setError('Failed to load profile data');
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
        setError('');
        setSuccess('');

        if (!editForm.password) {
            setError('Please enter your current password to save changes');
            return;
        }

        try {
            await axios.patch(`${API_BASE_URL}/api/user/profile`, editForm, {
                withCredentials: true
            });
            setSuccess('Profile updated successfully');
            setIsEditing(false);
            fetchUserProfile(); // Refresh data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            await axios.patch(`${API_BASE_URL}/api/user/changepassword`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, {
                withCredentials: true
            });
            setSuccess('Password changed successfully');
            setShowPasswordChange(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="profile-container">
            <Navbar />
            <div className="profile-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h2>{user?.fullName}</h2>
                        <span className="role-badge user">User</span>
                    </div>

                    {error && <div className="alert error">{error}</div>}
                    {success && <div className="alert success">{success}</div>}

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
                                <label>Account Status</label>
                                <span className="status-badge active">Active</span>
                            </div>

                            <div className="profile-actions">
                                <button onClick={() => setIsEditing(true)} className="btn-primary">
                                    Edit Profile
                                </button>
                                <button onClick={() => setShowPasswordChange(true)} className="btn-secondary">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}

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
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Current Password (Required to save)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editForm.password}
                                    onChange={handleEditChange}
                                    placeholder="Enter password to confirm"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

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
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowPasswordChange(false)} className="btn-cancel">
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
