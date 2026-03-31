import React from 'react';
import { Music, Play, Pause, ChevronLeft } from 'lucide-react';

export default function MusicSanctuary({ onBack, tracks, currentTrackIdx, isPlaying, onPlayTrack, onToggleMusic, t, language }) {
    return (
        <div className="dashboard-container music-sanctuary">
            <header className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={onBack}>
                        <ChevronLeft size={20} /> {t.chat.back}
                    </button>
                    <div>
                        <h2 className="user-greeting">{t.musicTab.title}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.musicTab.subtitle}</p>
                    </div>
                </div>
            </header>

            <div className="music-grid">
                {tracks.map((track, idx) => (
                    <div
                        key={track.id}
                        className={`glass-panel music-card ${idx === currentTrackIdx ? 'active' : ''}`}
                        onClick={() => onPlayTrack(idx)}
                    >
                        <div className="music-type-badge">{track.type}</div>
                        <div className="music-icon-large">
                            {idx === currentTrackIdx && isPlaying ? <div className="audio-wave"><span></span><span></span><span></span></div> : <Music size={40} />}
                        </div>
                        <div className="music-info">
                            <h3>{track.name}</h3>
                            <p>{idx === currentTrackIdx && isPlaying ? t.musicTab.playing : (idx === currentTrackIdx ? t.musicTab.paused : '')}</p>
                        </div>
                        <button className="play-circle-btn">
                            {idx === currentTrackIdx && isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                    </div>
                ))}
            </div>

            {isPlaying && (
                <div className="mini-player glass-panel">
                    <div className="mini-info">
                        <strong>{tracks[currentTrackIdx].name}</strong>
                        <span>{tracks[currentTrackIdx].type}</span>
                    </div>
                    <button className="btn-send" onClick={onToggleMusic} style={{ width: '45px', height: '45px' }}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                </div>
            )}
        </div>
    );
}
