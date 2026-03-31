import React from 'react';

export default function Dashboard({ user, onModeSelect, themes, currentTheme, onThemeChange, peersOnline }) {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-top">
                    <h2 className="user-greeting">Welcome back, <span>{user}</span></h2>
                    <div className="dashboard-nav">
                        <button className="btn-secondary" onClick={() => onModeSelect('logout')}>Log Out</button>
                    </div>
                </div>

                <div className="theme-selector-container">
                    <span className="theme-label">Atmosphere</span>
                    <div className="theme-chips">
                        {themes && themes.map(theme => (
                            <button
                                key={theme.id}
                                className={`theme-chip ${currentTheme === theme.id ? 'active' : ''}`}
                                onClick={() => onThemeChange(theme.id)}
                            >
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="mode-grid">
                <div className="glass-panel mode-card ai-mode" onClick={() => onModeSelect('ai')}>
                    <div className="mode-icon">🤖</div>
                    <h3 className="mode-title">AI Persona Mode</h3>
                    <p className="mode-desc">
                        EmotionSync's adaptive AI analyzes your feelings, suggests personalized agents, translates to Telugu, and gives real-time vocal support.
                    </p>
                    <button className="btn-secondary">Start AI Session</button>
                </div>

                <div 
                    className={`glass-panel mode-card peer-mode ${peersOnline < 2 ? 'disabled' : ''}`} 
                    onClick={() => peersOnline >= 2 ? onModeSelect('peer') : null}
                    style={{ opacity: peersOnline < 2 ? 0.6 : 1, cursor: peersOnline < 2 ? 'not-allowed' : 'pointer' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="mode-icon">👥</div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: peersOnline >= 2 ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '12px', color: '#fff' }}>
                            {peersOnline >= 2 ? `${peersOnline} Online` : (peersOnline === 1 ? '1 Online (Waiting)' : '0 Online')}
                        </span>
                    </div>
                    <h3 className="mode-title">Anonymous Peer</h3>
                    <p className="mode-desc">
                        Match securely with a real human peer for anonymous interaction. All chats are WSS encrypted, unsaved, and AI-Moderated for toxicity.
                    </p>
                    <button className="btn-secondary" disabled={peersOnline < 2} style={{ opacity: peersOnline < 2 ? 0.5 : 1 }}>
                        {peersOnline >= 2 ? 'Find Safe Peer' : 'Need 2+ Peers'}
                    </button>
                </div>

                <div className="glass-panel mode-card analytics-mode" onClick={() => onModeSelect('analytics')}>
                    <div className="mode-icon">📊</div>
                    <h3 className="mode-title">Mental Diagnostics</h3>
                    <p className="mode-desc">
                        View deep, visual biometric breakdowns of your mental history over your sessions including thematic and correlation mapping.
                    </p>
                    <button className="btn-secondary">View My Reports</button>
                </div>


                <div className="glass-panel mode-card games-mode" onClick={() => onModeSelect('games')} style={{ borderTop: '4px solid #10B981' }}>
                    <div className="mode-icon">🎮</div>
                    <h3 className="mode-title">Zen Sandbox</h3>
                    <p className="mode-desc">
                        Feeling overwhelmed? Take a beat with grounding games. Sync your breath with guided visuals or hit unlimited pop-its.
                    </p>
                    <button className="btn-secondary">Play to Relax</button>
                </div>
            </div>
        </div>
    );
}
