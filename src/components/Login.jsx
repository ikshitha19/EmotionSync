import React, { useState, useEffect } from 'react';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [strength, setStrength] = useState(0);

    // Calculate password strength
    useEffect(() => {
        let score = 0;
        if (password.length > 7) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        setStrength(score);
    }, [password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username.length < 4) {
            setError('Username must be at least 4 characters long.');
            return;
        }

        if (strength < 3) {
            setError('Password is too weak. Please use uppercase, numbers, and special characters.');
            return;
        }

        setIsLoading(true);

        // Simulate secure cryptographic handshake / DB connection delay
        setTimeout(() => {
            setIsLoading(false);
            onLogin(username);
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-card" style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '50%' }}>
                        <ShieldCheck size={40} color="var(--accent-main)" />
                    </div>
                </div>
                <h1 className="auth-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>EmotionSync</h1>
                <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Secure Emotion-Adaptive Communication</p>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14} /> Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your registered ID"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={14} /> Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        {/* Password Strength Meter */}
                        {password.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                                    {[1, 2, 3, 4].map((level) => (
                                        <div key={level} style={{ 
                                            flex: 1, 
                                            borderRadius: '2px', 
                                            background: strength >= level ? (strength > 2 ? '#10B981' : '#F59E0B') : 'rgba(255,255,255,0.1)',
                                            transition: 'background 0.3s ease'
                                        }} />
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.75rem', marginTop: '4px', color: strength > 2 ? '#10B981' : '#F59E0B' }}>
                                    {strength === 0 && 'Very Weak'}
                                    {strength === 1 && 'Weak'}
                                    {strength === 2 && 'Fair'}
                                    {strength > 2 && 'Strong'}
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '1rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Establishing Secure Connection...' : 'Secure Login'}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                        End-to-End Encrypted & HIPAA Compliant (Mock)
                    </p>
                </form>
            </div>
        </div>
    );
}
