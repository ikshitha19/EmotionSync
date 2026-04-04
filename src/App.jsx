import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AiChat from './components/AiChat';
import PeerChat from './components/PeerChat';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RelaxationGames from './components/RelaxationGames';
import { Play, Pause, Music, ChevronDown } from 'lucide-react';

const AMBIENT_TRACKS = [
  { id: 'lofi', name: 'Ambient Focus (Lofi)', src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', type: 'Focus' },
  { id: 'rain', name: 'Gentle Rain', src: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-rain-nature-sounds-8186.mp3', type: 'Nature' },
  { id: 'piano', name: 'Soft Piano', src: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=piano-moment-9835.mp3', type: 'Relaxation' },
  { id: 'meditation', name: 'Deep Meditation (432Hz)', src: 'https://cdn.pixabay.com/download/audio/2021/11/23/audio_73e7f41f02.mp3?filename=meditation-111059.mp3', type: 'Binaural/Ambient' },
  { id: 'night', name: 'Crickets & Night', src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_511ecf1519.mp3?filename=crickets-and-insects-in-the-wild-ambience-108868.mp3', type: 'Nature' },
  { id: 'believer', name: 'Believer (High Energy)', src: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Brain%20Dance.mp3', type: 'High Intensity' },
  { id: 'stronger', name: 'Stronger (Motivation)', src: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a1130d.mp3?filename=energetic-sport-action-14234.mp3', type: 'High Intensity' },
  { id: 'unstoppable', name: 'Unstoppable (Power)', src: 'https://cdn.pixabay.com/download/audio/2022/01/10/audio_82cadd7fb1.mp3?filename=stomp-and-claps-9835.mp3', type: 'High Intensity' },
  { id: 'halloffame', name: 'Hall of Fame (Inspiring)', src: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_13a30c0cdd.mp3?filename=inspiring-cinematic-112191.mp3', type: 'High Intensity' },
  { id: 'remembername', name: 'Remember the Name (Grit)', src: 'https://cdn.pixabay.com/download/audio/2021/11/23/audio_0625c1539c.mp3?filename=rock-grit-108868.mp3', type: 'High Intensity' },
  { id: 'indian_flute', name: 'Bombay Theme (Flute)', src: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4da58eec4c.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3', type: 'Indian Film' },
  { id: 'indian_sitar', name: 'Tum Hi Ho (Sitar Mix)', src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_82cadd7fb1.mp3?filename=ocean-waves-112906.mp3', type: 'Indian Film' },
  { id: 'indian_tabla', name: 'Kal Ho Naa Ho (Instrumental)', src: 'https://cdn.pixabay.com/download/audio/2021/10/26/audio_13a30c0cdd.mp3?filename=fireplace-crackling-109017.mp3', type: 'Indian Film' },
];

const BACKGROUND_THEMES = [
  { id: 'default', name: 'Deep Slate', class: 'theme-default' },
  { id: 'forest', name: 'Emerald Forest', class: 'theme-forest' },
  { id: 'sunset', name: 'Golden Sunset', class: 'theme-sunset' },
  { id: 'space', name: 'Deep Space', class: 'theme-space' },
  { id: 'calm', name: 'Ocean Calm', class: 'theme-calm' },
];

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('dashboard'); // 'dashboard', 'ai', 'peer', 'analytics', 'games'
  const [analyticsData, setAnalyticsData] = useState([]); // Propagate history
  const [currentTheme, setCurrentTheme] = useState('default');
  const [peersOnline, setPeersOnline] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [showMusicMenu, setShowMusicMenu] = useState(false);

  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  useEffect(() => {
    // Exact online data tracking with cache busting and logging
    const t = new Date().getTime();
    if (!user) {
      // If not logged in, just poll for count
      const fetchCount = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/online-count?t=${t}`);
          const data = await res.json();
          console.log("DEBUG: Anonymous Online Count Fetch:", data.online_count);
          setPeersOnline(data.online_count || 0);
        } catch (e) {
          console.error("Failed to fetch online count", e);
        }
      };
      
      const interval = setInterval(fetchCount, 5000);
      fetchCount();
      return () => clearInterval(interval);
    } else {
      // If logged in, send heartbeat and fetch count
      const sendHeartbeat = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/heartbeat?userName=${user}&t=${t}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user })
          });
          const data = await res.json();
          console.log("DEBUG: Logged-in Heartbeat Result:", data.online_count);
          setPeersOnline(data.online_count || 0);
        } catch (e) {
          console.error("Heartbeat failed", e);
        }
      };

      const interval = setInterval(sendHeartbeat, 10000); // Heartbeat every 10s
      sendHeartbeat();
      return () => clearInterval(interval);
    }
  }, [user]);

  const audioRef = useRef(new Audio(AMBIENT_TRACKS[0].src));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.2;
    
    // Cleanup on unmount
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const wasPlaying = isPlaying;
    
    if (audio.src !== AMBIENT_TRACKS[currentTrackIdx].src) {
      audio.src = AMBIENT_TRACKS[currentTrackIdx].src;
      if (wasPlaying) {
        audio.play().catch(e => console.log("Audio play failed", e));
      }
    }
  }, [currentTrackIdx, isPlaying]);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const playSelectedTrack = (idx) => {
    setCurrentTrackIdx(idx);
    setIsPlaying(true);
    setShowMusicMenu(false);
  };

  const handleSaveAnalytics = (sessionData) => {
    setAnalyticsData(prev => [...prev, sessionData]);
  };

  const renderContent = () => {
    if (!user) return <Login onLogin={setUser} />;
    
    switch (mode) {
      case 'ai':
        return <AiChat onBack={() => setMode('dashboard')} onSaveAnalytics={handleSaveAnalytics} />;
      case 'peer':
        return <PeerChat onBack={() => setMode('dashboard')} peersOnline={peersOnline} />;
      case 'analytics':
        return <AnalyticsDashboard onBack={() => setMode('dashboard')} rawData={analyticsData} />;
      case 'games':
        return <RelaxationGames onBack={() => setMode('dashboard')} />;
      default:
        return (
          <Dashboard
            user={user}
            themes={BACKGROUND_THEMES}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            peersOnline={peersOnline}
            onModeSelect={(selectedMode) => {
              if (selectedMode === 'logout') {
                setUser(null);
                setMode('dashboard');
              } else {
                setMode(selectedMode);
              }
            }}
          />
        );
    }
  };

  return (
    <>
      {renderContent()}
      {user && (
        <div className="music-player-container">
          <div className="music-player">
            <button className="music-btn" onClick={() => setShowMusicMenu(!showMusicMenu)} title="Select Music">
              <Music size={20} color="var(--accent-main)" />
            </button>
            <span
              className="music-label"
              onClick={() => setShowMusicMenu(!showMusicMenu)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {AMBIENT_TRACKS[currentTrackIdx].name}
              <ChevronDown size={14} />
            </span>
            <button className="music-btn" onClick={toggleMusic} title="Play/Pause Background Music">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
          {showMusicMenu && (
            <div className="music-menu">
              <div className="music-menu-header">Select Ambient Track</div>
              {AMBIENT_TRACKS.map((track, idx) => (
                <div
                  key={track.id}
                  className={`music-menu-item ${idx === currentTrackIdx ? 'active' : ''}`}
                  onClick={() => playSelectedTrack(idx)}
                >
                  {track.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
