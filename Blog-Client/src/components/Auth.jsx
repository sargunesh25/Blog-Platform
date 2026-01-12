import { useState } from 'react';
import { authAPI } from '../api';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                const data = await authAPI.login(email, password);
                if (data.token) {
                    onLogin();
                } else {
                    setError(data.message || 'Login failed');
                }
            } else {
                const data = await authAPI.signup(email, password);
                if (data.message?.includes('successful')) {
                    setSuccess('Signup successful! Please login.');
                    setIsLogin(true);
                    setPassword('');
                } else {
                    setError(data.message || 'Signup failed');
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>📝 Blog Platform</h1>
                    <p>Share your thoughts with the world</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                    >
                        Login
                    </button>
                    <button
                        className={`tab-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg">{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default Auth;
